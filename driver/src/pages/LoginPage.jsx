import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Truck, Phone, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/api/driver.api'
import { useDriverStore } from '@/store/useDriverStore'

export default function LoginPage() {
  const navigate  = useNavigate()
  const setAuth   = useDriverStore(s => s.setAuth)
  const [phone,   setPhone]   = useState('')
  const [pass,    setPass]    = useState('')
  const [showPw,  setShowPw]  = useState(false)
  const [error,   setError]   = useState('')

  const mut = useMutation({
    mutationFn: () => login({ phone, password: pass }),
    onSuccess: (data) => {
      if (data.user.role !== 'driver') {
        setError('هذا الحساب ليس حساب مندوب')
        return
      }
      setAuth(data.user, data.token)
      navigate('/', { replace: true })
    },
    onError: (err) => {
      setError(err.response?.data?.error ?? 'خطأ في تسجيل الدخول')
    },
  })

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (!phone || !pass) { setError('يرجى إدخال الجوال وكلمة المرور'); return }
    mut.mutate()
  }

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1A0900 0%, #0F0800 60%, #000 100%)' }}
      dir="rtl"
    >
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 shadow-xl"
            style={{ background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', boxShadow: '0 12px 40px rgba(249,115,22,0.5)' }}
          >
            <Truck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">QuickMart</h1>
          <p className="text-orange-400 font-bold mt-1">تطبيق مندوب التوصيل</p>
          <p className="text-gray-500 text-sm mt-1">Delivery Partner App</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {/* Phone */}
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-2">رقم الجوال</label>
            <div className="relative">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="05XXXXXXXX"
                dir="ltr"
                className="w-full pr-12 pl-4 py-4 rounded-2xl text-white placeholder-gray-600 text-base outline-none transition-all"
                style={{
                  background: '#1C1009',
                  border: '1px solid #2E1A00',
                  fontFamily: 'Cairo, sans-serif',
                }}
                onFocus={e => { e.target.style.borderColor = '#F97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)' }}
                onBlur={e  => { e.target.style.borderColor = '#2E1A00'; e.target.style.boxShadow = 'none' }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPw ? 'text' : 'password'}
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full pr-12 pl-12 py-4 rounded-2xl text-white placeholder-gray-600 text-base outline-none transition-all"
                style={{
                  background: '#1C1009',
                  border: '1px solid #2E1A00',
                  fontFamily: 'Cairo, sans-serif',
                }}
                onFocus={e => { e.target.style.borderColor = '#F97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)' }}
                onBlur={e  => { e.target.style.borderColor = '#2E1A00'; e.target.style.boxShadow = 'none' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ background: '#2D0A0A', border: '1px solid #EF444440' }}>
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={mut.isPending}
            className="w-full py-4 rounded-2xl font-black text-white text-base transition-all active:scale-95 disabled:opacity-60"
            style={{
              background: mut.isPending ? '#7C3D00' : 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              boxShadow: mut.isPending ? 'none' : '0 10px 30px rgba(249,115,22,0.5)',
            }}
          >
            {mut.isPending ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>

        {/* Hint */}
        <p className="text-center text-gray-600 text-xs mt-6">
          كلمة المرور الافتراضية:{' '}
          <span className="text-orange-600 font-mono font-bold">Driver@123</span>
        </p>
      </div>
    </div>
  )
}
