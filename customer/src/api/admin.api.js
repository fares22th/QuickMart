import api from './axios'

export const getAdminStats      = ()       => api.get('/admin/stats')
export const getAdminSellers    = (params) => api.get('/admin/sellers', { params })
export const approveSeller      = (id)     => api.post(`/admin/sellers/${id}/approve`)
export const rejectSeller       = (id)     => api.post(`/admin/sellers/${id}/reject`)
export const getAdminCustomers  = (params) => api.get('/admin/customers', { params })
export const getAdminOrders     = (params) => api.get('/admin/orders', { params })
export const getAdminDrivers    = (params) => api.get('/admin/drivers', { params })
export const getCommissions     = (params) => api.get('/admin/commissions', { params })
export const getDisputes        = (params) => api.get('/admin/disputes', { params })
export const resolveDispute     = (id, data) => api.post(`/admin/disputes/${id}/resolve`, data)
