import api from './axios'

// ── Dashboard ──────────────────────────────────────────────
export const getSellerStats   = ()       => api.get('/seller/stats')
export const getSalesChart    = (period) => api.get('/seller/stats/sales', { params: { period } })

// ── Products ───────────────────────────────────────────────
export const getMyProducts    = (params) => api.get('/seller/products', { params })
export const getMyProduct     = (id)     => api.get(`/seller/products/${id}`)
export const createMyProduct  = (data)   => api.post('/seller/products', data)
export const updateMyProduct  = (id, data) => api.put(`/seller/products/${id}`, data)
export const deleteMyProduct  = (id)     => api.delete(`/seller/products/${id}`)
export const uploadProductImages = (id, files) => {
  const fd = new FormData()
  files.forEach(f => fd.append('images', f))
  return api.post(`/seller/products/${id}/images`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
export const updateProductStock = (id, stock) => api.patch(`/seller/products/${id}/stock`, { stock })

// ── Orders ─────────────────────────────────────────────────
export const getMyOrders      = (params)         => api.get('/seller/orders', { params })
export const getMyOrder       = (id)             => api.get(`/seller/orders/${id}`)
export const updateMyOrderStatus = (id, status)  => api.patch(`/seller/orders/${id}/status`, { status })

// ── Store / Settings ───────────────────────────────────────
export const getMyStore       = ()       => api.get('/seller/store')
export const updateMyStore    = (data)   => api.put('/seller/store', data)

// ── Coupons ────────────────────────────────────────────────
export const getMyCoupons     = ()       => api.get('/seller/coupons')
export const createMyCoupon   = (data)   => api.post('/seller/coupons', data)
export const deleteMyCoupon   = (id)     => api.delete(`/seller/coupons/${id}`)
export const toggleCoupon     = (id, active) => api.patch(`/seller/coupons/${id}`, { active })

// ── Reviews ────────────────────────────────────────────────
export const getMyReviews     = (params) => api.get('/seller/reviews', { params })
export const replyToReview    = (id, reply) => api.post(`/seller/reviews/${id}/reply`, { reply })

// ── Payments ───────────────────────────────────────────────
export const getMyPayments    = (params) => api.get('/seller/payments', { params })
export const getMyBalance     = ()       => api.get('/seller/balance')
export const requestWithdrawal = (amount) => api.post('/seller/withdrawals', { amount })
