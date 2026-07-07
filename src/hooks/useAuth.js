import { useState } from 'react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/useAuthStore'
import * as authApi from '@/api/auth.api'

export function useAuth() {
  const { setAuth, logout: storeLogout } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const login = async (credentials) => {
    setIsLoading(true)
    try {
      const { user, token } = await authApi.login(credentials)
      setAuth(user, token)
      toast.success('مرحباً بعودتك!')
    } catch (err) {
      toast.error(err?.message || 'فشل تسجيل الدخول')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data) => {
    setIsLoading(true)
    try {
      await authApi.register(data)
      toast.success('تم إنشاء الحساب، تحقق من رمز OTP')
    } catch (err) {
      toast.error(err?.message || 'فشل إنشاء الحساب')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOtp = async (otp) => {
    setIsLoading(true)
    try {
      const { user, token } = await authApi.verifyOtp({ otp })
      setAuth(user, token)
      toast.success('تم التحقق بنجاح')
    } catch (err) {
      toast.error(err?.message || 'رمز OTP غير صحيح')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try { await authApi.logout() } catch {}
    storeLogout()
    toast.success('تم تسجيل الخروج')
  }

  return { login, register, verifyOtp, logout, isLoading }
}
