import api from './axios'

export const getReviews   = (productId, params) => api.get(`/customer/products/${productId}/reviews`, { params })
export const createReview = (productId, data)   => api.post(`/customer/products/${productId}/reviews`, data)
