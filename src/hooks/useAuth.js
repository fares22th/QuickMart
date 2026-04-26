import { useState } from 'react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/useAuthStore'
import * as authApi from '@/api/auth.api'
import { getMe } from '@/api/users.api'

export function useAuth() {
  const { setSession, setProfile, logout: storeLogout, user, session, profile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  // shared: set session + load profile
  const _hydrate = async (data) => {
    setSession(data.session)
    const prof = await getMe()
    setProfile(prof)
    return prof
  }

  const login = async (credentials) => {
    setIsLoading(true)
    try {
      const data = await authApi.login(credentials)
      const prof = await _hydrate(data)
      toast.success(`مرحباً ${prof?.name || ''} 👋`)
      return prof
    } catch (err) {
      toast.error(err?.message || 'فشل تسجيل الدخول')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const registerCustomer = async (payload) => {
    setIsLoading(true)
    try {
      const data = await authApi.registerCustomer(payload)
      const prof = await _hydrate(data)
      toast.success(`مرحباً ${prof?.name || ''} 🎉`)
      return prof
    } catch (err) {
      toast.error(err?.message || 'فشل إنشاء الحساب')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const registerSeller = async (payload) => {
    setIsLoading(true)
    try {
      const data = await authApi.registerSeller(payload)
      const prof = await _hydrate(data)
      toast.success('تم تسجيل متجرك! سيتم مراجعة طلبك خلال 24 ساعة 🏪')
      return prof
    } catch (err) {
      toast.error(err?.message || 'فشل إنشاء الحساب')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const registerAdmin = async (payload) => {
    setIsLoading(true)
    try {
      const data = await authApi.registerAdmin(payload)
      const prof = await _hydrate(data)
      toast.success('تم إنشاء حساب الإدارة بنجاح 🛡️')
      return prof
    } catch (err) {
      toast.error(err?.message || 'فشل إنشاء الحساب')
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

  const role = profile?.role ?? user?.user_metadata?.role ?? null

  const devLogin = (devRole = 'customer') => {
    const names = { customer: 'أحمد الزبون', seller: 'محمد البائع', admin: 'سارة المديرة' }
    const id    = `dev-${devRole}-0000-0000-0000-000000000001`
    setSession({
      access_token: 'dev-bypass',
      refresh_token: 'dev-bypass',
      user: { id, email: `${devRole}@dev.test`, user_metadata: { name: names[devRole], role: devRole } },
    })
    setProfile({ id, name: names[devRole], role: devRole, phone: '0500000000', avatar_url: null })
    toast.success(`وضع تطوير — دخلت كـ ${names[devRole]}`)
  }

  return {
    user, session, profile, role,
    isAuthenticated: !!session,
    isLoading,
    login, registerCustomer, registerSeller, registerAdmin, logout,
    devLogin,
  }
}
