import api from './axios'

export const getOrders      = (params) => api.get('/customer/orders', { params })
export const getOrder       = (id)     => api.get(`/customer/orders/${id}`)
export const createOrder    = (data)   => api.post('/customer/orders', data)
export const cancelOrder    = (id)     => api.patch(`/customer/orders/${id}/cancel`)
export const validateCoupon = (data)  => api.post('/customer/coupons/validate', data)
export const updateOrderStatus = (id, status) => api.patch(`/customer/orders/${id}/status`, { status })
