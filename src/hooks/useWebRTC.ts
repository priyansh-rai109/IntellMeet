import { useCallback, useEffect, useRef, useState } from 'react'
import Peer from 'simple-peer'
import { Socket } from 'socket.io-client'

export interface PeerEntry {
  socketId: string
  userId: string
  userName: string
  peer: Peer.Instance
  stream?: MediaStream
}

export interface UseWebRTCReturn {
  localStream: MediaStream | null
  peers: PeerEntry[]
  initLocalStream: () => Promise<MediaStream | null>
  destroyAll: () => void
}

/**
 * useWebRTC — manages simple-peer instances and local media stream.
 *
 * Flow:
 *   1. Call initLocalStream() to acquire camera/mic.
 *   2. When `room-participants` fires (existing peers), create initiating offers.
 *   3. When `user-connected` fires (new peer), they will send an offer to us.
 *   4. Relay offers/answers/ICE via socket events.
 *   5. On stream event, store the remote stream in peers state for rendering.
 */
export function useWebRTC(
  socket: Socket,
  roomId: string,
  userId: string,
  userName: string
): UseWebRTCReturn {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [peers, setPeers] = useState<PeerEntry[]>([])

  // Refs to avoid stale closures in socket callbacks
  const localStreamRef = useRef<MediaStream | null>(null)
  const peersRef = useRef<Map<string, PeerEntry>>(new Map())

  // ─── Acquire local media ────────────────────────────────────────────────────
  const initLocalStream = useCallback(async (): Promise<MediaStream | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      })
      localStreamRef.current = stream
      setLocalStream(stream)
      return stream
    } catch (err) {
      console.warn('[WebRTC] Could not get local stream (permission denied or no device):', err)
      return null
    }
  }, [])

  // ─── Create a new peer ──────────────────────────────────────────────────────
  const createPeer = useCallback(
    (
      remoteSocketId: string,
      remoteUserId: string,
      remoteUserName: string,
      initiator: boolean,
      stream: MediaStream | null
    ): Peer.Instance => {
      const peerOptions: Peer.Options = {
        initiator,
        trickle: true, // Trickle ICE for faster connection
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        },
      }

      if (stream) {
        peerOptions.stream = stream
      }

      const peer = new Peer(peerOptions)

      peer.on('signal', (signalData) => {
        if (signalData.type === 'offer') {
          socket.emit('webrtc-offer', { to: remoteSocketId, offer: signalData })
        } else if (signalData.type === 'answer') {
          socket.emit('webrtc-answer', { to: remoteSocketId, answer: signalData })
        } else {
          // ICE candidate
          socket.emit('ice-candidate', { to: remoteSocketId, candidate: signalData })
        }
      })

      peer.on('stream', (remoteStream) => {
        peersRef.current.get(remoteSocketId) &&
          updatePeerStream(remoteSocketId, remoteStream)
      })

      peer.on('error', (err) => {
        console.error(`[WebRTC] Peer error with ${remoteSocketId}:`, err)
        removePeer(remoteSocketId)
      })

      peer.on('close', () => {
        removePeer(remoteSocketId)
      })

      const entry: PeerEntry = {
        socketId: remoteSocketId,
        userId: remoteUserId,
        userName: remoteUserName,
        peer,
      }

      peersRef.current.set(remoteSocketId, entry)
      setPeers(Array.from(peersRef.current.values()))

      return peer
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [socket]
  )

  const updatePeerStream = (socketId: string, stream: MediaStream) => {
    const entry = peersRef.current.get(socketId)
    if (entry) {
      const updated = { ...entry, stream }
      peersRef.current.set(socketId, updated)
      setPeers(Array.from(peersRef.current.values()))
    }
  }

  const removePeer = (socketId: string) => {
    const entry = peersRef.current.get(socketId)
    if (entry) {
      try { entry.peer.destroy() } catch (_) { /* ignore */ }
      peersRef.current.delete(socketId)
      setPeers(Array.from(peersRef.current.values()))
    }
  }

  // ─── Destroy everything ─────────────────────────────────────────────────────
  const destroyAll = useCallback(() => {
    peersRef.current.forEach((entry) => {
      try { entry.peer.destroy() } catch (_) { /* ignore */ }
    })
    peersRef.current.clear()
    setPeers([])

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop())
      localStreamRef.current = null
      setLocalStream(null)
    }
  }, [])

  // ─── Socket event listeners ─────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !roomId) return

    /**
     * room-participants — fired once when we join, lists existing peers.
     * We (the new joiner) act as the initiator and create offers to all of them.
     */
    const handleRoomParticipants = (participants: Array<{ socketId: string; userId: string; userName: string }>) => {
      participants.forEach(({ socketId, userId: uid, userName: uname }) => {
        if (!peersRef.current.has(socketId)) {
          createPeer(socketId, uid, uname, true, localStreamRef.current)
        }
      })
    }

    /**
     * user-connected — a new peer joined AFTER us.
     * They will send us an offer; we are NOT the initiator here.
     * We just create a non-initiating peer to be ready to receive the offer.
     */
    const handleUserConnected = ({ socketId, userId: uid, userName: uname }: { socketId: string; userId: string; userName: string }) => {
      if (!peersRef.current.has(socketId)) {
        createPeer(socketId, uid, uname, false, localStreamRef.current)
      }
    }

    /**
     * user-disconnected — clean up the peer whose socket closed.
     */
    const handleUserDisconnected = ({ socketId }: { socketId: string }) => {
      removePeer(socketId)
    }

    /**
     * webrtc-offer — received from an initiating peer.
     * Signal their offer data into our non-initiating peer instance.
     */
    const handleOffer = ({ from, offer }: { from: string; offer: Peer.SignalData }) => {
      const existing = peersRef.current.get(from)
      if (existing) {
        existing.peer.signal(offer)
      }
    }

    /**
     * webrtc-answer — received from a non-initiating peer.
     * Signal their answer into our initiating peer instance.
     */
    const handleAnswer = ({ from, answer }: { from: string; answer: Peer.SignalData }) => {
      const existing = peersRef.current.get(from)
      if (existing) {
        existing.peer.signal(answer)
      }
    }

    /**
     * ice-candidate — trickle ICE candidates between peers.
     */
    const handleIceCandidate = ({ from, candidate }: { from: string; candidate: Peer.SignalData }) => {
      const existing = peersRef.current.get(from)
      if (existing) {
        try {
          existing.peer.signal(candidate)
        } catch (_) { /* ignore out-of-order candidates */ }
      }
    }

    socket.on('room-participants', handleRoomParticipants)
    socket.on('user-connected', handleUserConnected)
    socket.on('user-disconnected', handleUserDisconnected)
    socket.on('webrtc-offer', handleOffer)
    socket.on('webrtc-answer', handleAnswer)
    socket.on('ice-candidate', handleIceCandidate)

    return () => {
      socket.off('room-participants', handleRoomParticipants)
      socket.off('user-connected', handleUserConnected)
      socket.off('user-disconnected', handleUserDisconnected)
      socket.off('webrtc-offer', handleOffer)
      socket.off('webrtc-answer', handleAnswer)
      socket.off('ice-candidate', handleIceCandidate)
    }
  }, [socket, roomId, createPeer])

  return { localStream, peers, initLocalStream, destroyAll }
}
