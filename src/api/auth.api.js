import api from './axios'

export const login          = (data)  => api.post('/auth/login', data)
export const register       = (data)  => api.post('/auth/register', data)
export const verifyOtp      = (data)  => api.post('/auth/verify-otp', data)
export const forgotPassword = (data)  => api.post('/auth/forgot-password', data)
export const resetPassword  = (data)  => api.post('/auth/reset-password', data)
export const refreshToken   = ()      => api.post('/auth/refresh')
export const logout         = ()      => api.post('/auth/logout')
