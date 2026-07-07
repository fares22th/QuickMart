import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Phone, Lock, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import PhoneInput from '@/components/common/PhoneInput'

function PasswordField({ register, error }) {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">كلمة المرور</label>
      <div className={`flex items-center rounded-2xl border-2 overflow-hidden transition-all ${
        error ? 'border-red-400' : 'border-gray-100 focus-within:border-green-400'
      }`} style={{ background: '#F9FAFB' }}>
        <span className="pr-4 pl-2 text-gray-400">
          <Lock className="w-4 h-4" />
        </span>
        <input
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          className="flex-1 py-3.5 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-300"
          {...register('password', { required: 'كلمة المرور مطلوبة' })}
        />
        <button type="button" onClick={() => setShow(v => !v)}
          className="px-4 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs flex items-center gap-1"><span>⚠</span>{error}</p>}
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading } = useAuth()

  const [phone, setPhone] = useState('')
  const [dialCode, setDial] = useState('+966')

  const { register, handleSubmit, setError, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    if (!phone || phone.length < 6) {
      setError('phone', { message: 'أدخل رقم هاتف صحيح' })
      return
    }
    try {
      await login({ phone: `${dialCode}${phone}`, password: data.password })
      const from = location.state?.from?.pathname ?? '/'
      navigate(from, { replace: true })
    } catch {}
  }

  return (
    <div dir="rtl">
      {/* Header */}
      <div className="mb-7">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-md"
          style={{ background: 'linear-gradient(135deg, #00C896, #00A878)' }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 5h13M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">أهلاً بعودتك!</h2>
        <p className="text-gray-400 text-sm mt-1">سجّل دخولك للمتابعة</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <PhoneInput
          value={phone}
          onChange={(val, dial) => { setPhone(val); setDial(dial) }}
          error={errors.phone?.message}
        />
        <PasswordField register={register} error={errors.password?.message} />

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="w-4 h-4 rounded accent-green-500" />
            <span className="text-sm text-gray-500">تذكرني</span>
          </label>
          <Link to="/forgot-password" className="text-sm font-semibold transition-colors"
            style={{ color: '#00C896' }}>
            نسيت كلمة المرور؟
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 mt-2"
          style={{
            background: 'linear-gradient(135deg, #00C896 0%, #00A878 100%)',
            boxShadow: '0 8px 20px rgba(0,200,150,0.35)',
          }}
        >
          {isLoading
            ? <><Loader2 className="w-4 h-4 animate-spin" />جاري الدخول...</>
            : <><span>تسجيل الدخول</span><ArrowLeft className="w-4 h-4" /></>
          }
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: '#F0FDF4' }} />
        <span className="text-xs text-gray-400">أو</span>
        <div className="flex-1 h-px" style={{ background: '#F0FDF4' }} />
      </div>

      <p className="text-center text-sm text-gray-400">
        ليس لديك حساب؟{' '}
        <Link to="/register" className="font-extrabold" style={{ color: '#00C896' }}>
          إنشاء حساب مجاني
        </Link>
      </p>
    </div>
  )
}
