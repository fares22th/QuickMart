import api from './axios'

export const getMe          = ()       => api.get('/users/me')
export const updateMe       = (data)   => api.put('/users/me', data)
export const getAddresses   = ()       => api.get('/users/me/addresses')
export const addAddress     = (data)   => api.post('/users/me/addresses', data)
export const deleteAddress  = (id)     => api.delete(`/users/me/addresses/${id}`)
