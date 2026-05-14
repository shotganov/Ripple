import { io, type Socket } from 'socket.io-client'
import { SERVER_ORIGIN } from '@shared/config'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SERVER_ORIGIN, {
      autoConnect: false,
      transports: ['websocket'],
    })
  }
  return socket
}

export const connectSocket = (token: string) => {
  const s = getSocket()
  s.auth = { token }
  if (!s.connected) s.connect()
}

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect()
}
