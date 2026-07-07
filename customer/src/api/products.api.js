import api from './axios'

export const getProducts   = (params) => api.get('/customer/products', { params })
export const getProduct    = (id)     => api.get(`/customer/products/${id}`)
export const getProductReviews = (id, params) => api.get(`/customer/products/${id}/reviews`, { params })
export const createReview  = (id, data)       => api.post(`/customer/products/${id}/reviews`, data)
