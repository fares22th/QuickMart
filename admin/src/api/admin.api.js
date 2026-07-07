import api from './axios'

// ── Overview / Stats ───────────────────────────────────────
export const getAdminStats    = ()       => api.get('/admin/stats')
export const getActivityFeed  = ()       => api.get('/admin/activity')
export const getAdminAlerts   = ()       => api.get('/admin/alerts')
export const dismissAlert     = (id)     => api.delete(`/admin/alerts/${id}`)

// ── Sellers ────────────────────────────────────────────────
export const getAdminSellers  = (params) => api.get('/admin/sellers', { params })
export const getAdminSeller   = (id)     => api.get(`/admin/sellers/${id}`)
export const approveSeller    = (id)     => api.post(`/admin/sellers/${id}/approve`)
export const rejectSeller     = (id, reason) => api.post(`/admin/sellers/${id}/reject`, { reason })
export const suspendSeller    = (id)     => api.post(`/admin/sellers/${id}/suspend`)
export const activateSeller   = (id)     => api.post(`/admin/sellers/${id}/activate`)

// ── Customers ──────────────────────────────────────────────
export const getAdminCustomers  = (params) => api.get('/admin/customers', { params })
export const getAdminCustomer   = (id)     => api.get(`/admin/customers/${id}`)
export const banCustomer        = (id)     => api.post(`/admin/customers/${id}/ban`)
export const unbanCustomer      = (id)     => api.post(`/admin/customers/${id}/unban`)

// ── Drivers ────────────────────────────────────────────────
export const getAdminDrivers      = (params)     => api.get('/admin/drivers', { params })
export const addDriver            = (data)        => api.post('/admin/drivers', data)
export const updateDriver         = (id, data)    => api.put(`/admin/drivers/${id}`, data)
export const deleteDriver         = (id)          => api.delete(`/admin/drivers/${id}`)
export const getUnassignedOrders  = ()            => api.get('/admin/orders/unassigned')
export const assignDriverToOrder  = (orderId, driverId) => api.patch(`/admin/orders/${orderId}/assign-driver`, { driverId })

// ── Orders ─────────────────────────────────────────────────
export const getAdminOrders   = (params) => api.get('/admin/orders', { params })
export const getAdminOrder    = (id)     => api.get(`/admin/orders/${id}`)

// ── Analytics ──────────────────────────────────────────────
export const getAdminAnalytics      = (period) => api.get('/admin/analytics', { params: { period } })
export const getRevenueByCategory   = ()       => api.get('/admin/analytics/by-category')

// ── Commissions ────────────────────────────────────────────
export const getCommissions         = (params) => api.get('/admin/commissions', { params })
export const getCommissionsSummary  = ()       => api.get('/admin/commissions/summary')

// ── Disputes ───────────────────────────────────────────────
export const getDisputes    = (params)     => api.get('/admin/disputes', { params })
export const resolveDispute = (id, data)   => api.post(`/admin/disputes/${id}/resolve`, data)
export const rejectDispute  = (id, reason) => api.post(`/admin/disputes/${id}/reject`, { reason })

// ── Ads ────────────────────────────────────────────────────
export const getAds         = ()       => api.get('/admin/ads')
export const createAd       = (data)   => api.post('/admin/ads', data)
export const updateAd       = (id, d)  => api.put(`/admin/ads/${id}`, d)
export const deleteAd       = (id)     => api.delete(`/admin/ads/${id}`)
export const toggleAd       = (id, active) => api.patch(`/admin/ads/${id}`, { active })

// ── Platform Settings ──────────────────────────────────────
export const getPlatformSettings    = ()     => api.get('/admin/settings')
export const updatePlatformSettings = (data) => api.put('/admin/settings', data)
