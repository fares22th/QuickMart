import { io } from 'socket.io-client'

// Strip /api suffix to get the base server URL
const SERVER_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api')
  .replace(/\/api\/?$/, '')

export const socket = io(SERVER_URL, {
  autoConnect:          false,
  reconnection:         true,
  reconnectionAttempts: 10,
  reconnectionDelay:    1500,
  transports:           ['websocket', 'polling'],
})
