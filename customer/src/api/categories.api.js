import api from './axios'

export const getCategories = () => api.get('/customer/categories')

export const getStoresByCategory = (category, params) =>
  api.get('/customer/stores', { params: { category, ...params } })

export const getProductsByCategory = (category, params) =>
  api.get('/customer/products', { params: { category, ...params } })
