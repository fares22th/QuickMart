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
      const { user, token, refreshToken } = await authApi.login(credentials)
      setAuth(user, token, refreshToken)
      toast.success('مرحباً بعودتك!')
    } catch (err) {
      toast.error(err?.error || err?.message || err?.response?.data?.error || 'فشل تسجيل الدخول')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data) => {
    setIsLoading(true)
    try {
      const { user, token, refreshToken } = await authApi.register(data)
      setAuth(user, token, refreshToken)
      toast.success('تم إنشاء حسابك بنجاح!')
    } catch (err) {
      toast.error(err?.error || err?.message || err?.response?.data?.error || 'فشل إنشاء الحساب')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOtp = async (otp, phone) => {
    setIsLoading(true)
    try {
      const res = await authApi.verifyOtp({ otp, phone })
      if (res?.user && res?.token) {
        setAuth(res.user, res.token)
      }
      toast.success('تم التحقق بنجاح')
      return res
    } catch (err) {
      toast.error(err?.response?.data?.message || 'رمز OTP غير صحيح')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const forgotPassword = async (phone) => {
    setIsLoading(true)
    try {
      await authApi.forgotPassword({ phone })
      toast.success('تم إرسال رمز التحقق إلى هاتفك')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'تعذر إرسال رمز التحقق')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (data) => {
    setIsLoading(true)
    try {
      await authApi.resetPassword(data)
      toast.success('تم تغيير كلمة المرور بنجاح')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'تعذر تغيير كلمة المرور')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const resendOtp = async (phone) => {
    setIsLoading(true)
    try {
      await authApi.forgotPassword({ phone })
      toast.success('تم إعادة إرسال الرمز')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'تعذر إعادة الإرسال')
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

  return { login, register, verifyOtp, forgotPassword, resetPassword, resendOtp, logout, isLoading }
}
