import api from '@/lib/axios'

export const login = (data) =>
  api.post('/auth/login', data).then(r => r.data)

export const getMe = () =>
  api.get('/driver/me').then(r => r.data)

export const getAvailableOrders = () =>
  api.get('/driver/orders/available').then(r => r.data)

export const getActiveOrder = () =>
  api.get('/driver/orders/active').then(r => r.data)

export const acceptOrder = (id) =>
  api.post(`/driver/orders/${id}/accept`).then(r => r.data)

export const updateOrderStatus = (id, status) =>
  api.patch(`/driver/orders/${id}/status`, { status }).then(r => r.data)

export const getOrderHistory = (page = 1) =>
  api.get(`/driver/orders/history?page=${page}`).then(r => r.data)

export const getEarnings = () =>
  api.get('/driver/earnings').then(r => r.data)

export const setAvailability = (isAvailable) =>
  api.patch('/driver/availability', { isAvailable }).then(r => r.data)
