import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Phone, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const schema = z.object({
  phone:    z.string().min(9, 'رقم الهاتف غير صحيح'),
  password: z.string().min(6, 'كلمة المرور ٦ أحرف على الأقل'),
})

function PhoneField({ register, error }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">رقم الهاتف</label>
      <div className={`flex items-center rounded-2xl border-2 overflow-hidden transition-all ${
        error ? 'border-red-400' : 'border-gray-100 focus-within:border-indigo-400'
      }`} style={{ background: '#F9FAFB' }}>
        <div className="flex items-center gap-1.5 px-3 py-3.5 border-l-2 border-gray-100 shrink-0 select-none">
          <span className="text-base leading-none">🇸🇦</span>
          <span className="text-xs font-bold text-gray-500">+966</span>
        </div>
        <input
          type="tel"
          placeholder="5xxxxxxxx"
          dir="ltr"
          className="flex-1 px-3 py-3.5 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-300"
          {...register('phone')}
        />
      </div>
      {error && <p className="text-red-500 text-xs flex items-center gap-1"><span>⚠</span>{error}</p>}
    </div>
  )
}

function PasswordField({ register, error }) {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">كلمة المرور</label>
      <div className={`flex items-center rounded-2xl border-2 overflow-hidden transition-all ${
        error ? 'border-red-400' : 'border-gray-100 focus-within:border-indigo-400'
      }`} style={{ background: '#F9FAFB' }}>
        <span className="pr-4 pl-2 text-gray-400"><Lock className="w-4 h-4" /></span>
        <input
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          className="flex-1 py-3.5 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-300"
          {...register('password')}
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
  const { login, isLoading } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    await login(data)
    navigate('/')
  }

  return (
    <div dir="rtl">
      {/* Header */}
      <div className="mb-7">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-md"
          style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 6px 20px rgba(99,102,241,0.4)' }}
        >
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">دخول المشرف</h2>
        <p className="text-gray-400 text-sm mt-1">أدخل بياناتك للوصول للوحة التحكم</p>
      </div>

      {/* Security badge */}
      <div
        className="flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 mb-5"
        style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)' }}
      >
        <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: '#6366F1' }} />
        <p className="text-xs font-medium" style={{ color: '#4F46E5' }}>
          منطقة محمية — الوصول للمشرفين المعتمدين فقط
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <PhoneField register={register} error={errors.phone?.message} />
        <PasswordField register={register} error={errors.password?.message} />

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="w-4 h-4 rounded accent-indigo-500" />
            <span className="text-sm text-gray-500">تذكرني</span>
          </label>
          <Link to="/forgot-password" className="text-sm font-semibold transition-colors"
            style={{ color: '#6366F1' }}>
            نسيت كلمة المرور؟
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 mt-2"
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            boxShadow: '0 8px 20px rgba(99,102,241,0.4)',
          }}
        >
          {isLoading
            ? <><Loader2 className="w-4 h-4 animate-spin" />جاري التحقق...</>
            : <><span>دخول لوحة التحكم</span><ArrowLeft className="w-4 h-4" /></>
          }
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-indigo-100" />
        <span className="text-xs text-gray-400">أو</span>
        <div className="flex-1 h-px bg-indigo-100" />
      </div>

      <p className="text-center text-sm text-gray-400">
        ليس لديك حساب؟{' '}
        <Link to="/register" className="font-extrabold" style={{ color: '#6366F1' }}>
          طلب صلاحية وصول
        </Link>
      </p>
    </div>
  )
}
