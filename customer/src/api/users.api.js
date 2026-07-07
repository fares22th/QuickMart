import api from './axios'

export const updateProfile  = (data)  => api.put('/customer/profile', data)
export const updateMe       = updateProfile
export const getAddresses   = ()      => api.get('/customer/addresses')
export const addAddress     = (data)  => api.post('/customer/addresses', data)
export const updateAddress  = (id, data) => api.put(`/customer/addresses/${id}`, data)
export const deleteAddress  = (id)   => api.delete(`/customer/addresses/${id}`)
export const getWishlist    = ()      => api.get('/customer/wishlist')
export const addToWishlist  = (productId) => api.post(`/customer/wishlist/${productId}`)
export const removeFromWishlist = (productId) => api.delete(`/customer/wishlist/${productId}`)
