import { io, Socket } from 'socket.io-client'

// VITE_BACKEND_URL is set in Vercel env vars for production.
// Falls back to local dev server so no .env file is needed locally.
const SOCKET_URL: string = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

let socketInstance: Socket | null = null

/**
 * Returns the singleton Socket.io client instance.
 * Creates it on first call and reuses the same connection thereafter.
 */
export function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: false,    // We connect manually when joining a room
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
  }
  return socketInstance
}

export default getSocket

