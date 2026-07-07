import api from './axios'

export const getReviews     = (productId) => api.get(`/products/${productId}/reviews`)
export const createReview   = (productId, data) => api.post(`/products/${productId}/reviews`, data)
export const deleteReview   = (id) => api.delete(`/reviews/${id}`)
