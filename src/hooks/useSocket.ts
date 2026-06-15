import { useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'
import { getSocket } from '../config/socket'

export interface UseSocketReturn {
  socket: Socket
  isConnected: boolean
}

/**
 * useSocket — manages the Socket.io connection lifecycle.
 *
 * Connects on mount, disconnects on unmount.
 * Returns the socket instance and live connection status.
 */
export function useSocket(): UseSocketReturn {
  const socket = useRef<Socket>(getSocket())
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const s = socket.current

    // Connect if not already connected
    if (!s.connected) {
      s.connect()
    }

    const handleConnect = () => {
      setIsConnected(true)
      console.log('[Socket] Connected:', s.id)
    }

    const handleDisconnect = (reason: string) => {
      setIsConnected(false)
      console.log('[Socket] Disconnected:', reason)
    }

    const handleConnectError = (err: Error) => {
      console.error('[Socket] Connection error:', err.message)
      setIsConnected(false)
    }

    s.on('connect', handleConnect)
    s.on('disconnect', handleDisconnect)
    s.on('connect_error', handleConnectError)

    // Sync initial state in case already connected
    if (s.connected) setIsConnected(true)

    return () => {
      s.off('connect', handleConnect)
      s.off('disconnect', handleDisconnect)
      s.off('connect_error', handleConnectError)
      s.disconnect()
    }
  }, [])

  return { socket: socket.current, isConnected }
}
