import api from './axios'

export const getOrders      = (params) => api.get('/orders', { params })
export const getOrder       = (id)     => api.get(`/orders/${id}`)
export const createOrder    = (data)   => api.post('/orders', data)
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status })
export const cancelOrder    = (id)     => api.post(`/orders/${id}/cancel`)
export const trackOrder     = (id)     => api.get(`/orders/${id}/track`)
