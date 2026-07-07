import { Server as SocketIO } from 'socket.io'

let _io = null

export function initSocket(httpServer, corsOrigins) {
  _io = new SocketIO(httpServer, {
    cors: { origin: corsOrigins.filter(Boolean), credentials: true },
  })

  _io.on('connection', (socket) => {
    socket.on('join:order',   (orderId)  => socket.join(`order:${orderId}`))
    socket.on('join:store',   (storeId)  => socket.join(`store:${storeId}`))
    socket.on('join:driver',  (driverId) => socket.join(`driver:${driverId}`))
    socket.on('join:admin',   ()         => socket.join('admin:drivers'))
    socket.on('join:drivers', ()         => socket.join('drivers:online'))
    socket.on('leave:drivers',()         => socket.leave('drivers:online'))

    // Driver broadcasts GPS → relay to the order room so customer can see it
    socket.on('driver:location', ({ orderId, lat, lng }) => {
      if (!orderId || lat == null || lng == null) return
      socket.to(`order:${orderId}`).emit('driver:location', { lat, lng, ts: Date.now() })
    })

    socket.on('disconnect',   () => {})
  })

  return _io
}

export function getIO() {
  if (!_io) throw new Error('Socket.IO not initialized — call initSocket() first')
  return _io
}
