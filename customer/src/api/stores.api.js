import api from './axios'

export const getStores = (params) => api.get('/customer/stores', { params })
export const getStore  = (id)     => api.get(`/customer/stores/${id}`)
