import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'

const schema = z.object({
  email:    z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل'),
})

function EmailInput({ register, error }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        البريد الإلكتروني
      </label>
      <div className={`flex items-center border rounded-2xl overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-0 ${
        error
          ? 'border-red-400 focus-within:ring-red-200'
          : 'border-gray-200 focus-within:border-primary focus-within:ring-primary/20'
      }`}>
        <div className="px-3 text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <input
          type="email"
          placeholder="example@email.com"
          dir="ltr"
          className="flex-1 px-2 py-3 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
          {...register('email')}
        />
      </div>
      {error && (
        <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

function PasswordInput({ register, error }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        كلمة المرور
      </label>
      <div className={`flex items-center border rounded-2xl overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-0 ${
        error
          ? 'border-red-400 focus-within:ring-red-200'
          : 'border-gray-200 focus-within:border-primary focus-within:ring-primary/20'
      }`}>
        <input
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          className="flex-1 px-4 py-3 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="px-4 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          tabIndex={-1}
        >
          {show ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

const DEV = import.meta.env.DEV

function DevPanel({ devLogin, navigate }) {
  if (!DEV) return null
  return (
    <div className="mt-5 p-3.5 rounded-2xl border-2 border-dashed border-yellow-300 bg-yellow-50">
      <p className="text-xs font-bold text-yellow-700 mb-2.5 flex items-center gap-1.5">
        <span>⚡</span> وضع التطوير — دخول سريع
      </p>
      <div className="grid grid-cols-3 gap-2">
        {[
          { role: 'customer', label: 'زبون', to: '/',       color: '#00C896' },
          { role: 'seller',   label: 'بائع', to: '/seller', color: '#F59E0B' },
          { role: 'admin',    label: 'مدير', to: '/admin',  color: '#6366F1' },
        ].map(({ role, label, to, color }) => (
          <button key={role} type="button"
            onClick={() => { devLogin(role); navigate(to) }}
            className="py-2 rounded-xl text-white text-xs font-bold transition-all active:scale-95"
            style={{ background: color }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, devLogin } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    const prof = await login(data)
    if (prof?.role === 'seller') navigate('/seller')
    else if (prof?.role === 'admin') navigate('/admin')
    else navigate('/')
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">مرحباً بعودتك 👋</h2>
        <p className="text-gray-500 text-sm mt-1.5">أدخل بياناتك للدخول إلى حسابك</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <EmailInput register={register} error={errors.email?.message} />
        <PasswordInput register={register} error={errors.password?.message} />

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: '#00C896' }}
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
              تذكرني
            </span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium transition-colors"
            style={{ color: '#00C896' }}
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-2xl text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          style={{
            background: 'linear-gradient(135deg, #00C896 0%, #00A878 100%)',
            boxShadow: '0 8px 24px rgba(0,200,150,0.35)',
          }}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              جاري الدخول...
            </>
          ) : (
            <>
              تسجيل الدخول
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-100"/>
        <span className="text-xs text-gray-400 font-medium">أو</span>
        <div className="flex-1 h-px bg-gray-100"/>
      </div>

      {/* Register link */}
      <p className="text-center text-sm text-gray-500">
        ليس لديك حساب؟{' '}
        <Link to="/register" className="font-bold transition-colors" style={{ color: '#00C896' }}>
          إنشاء حساب مجاني
        </Link>
      </p>

      <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
        <p className="text-xs text-center text-gray-400 mb-3">هل أنت بائع أو مدير؟</p>
        <div className="flex gap-2">
          <Link to="/seller/login"
            className="flex-1 text-center text-xs font-bold py-2.5 rounded-xl border-2 border-amber-400 text-amber-600 hover:bg-amber-50 transition-colors">
            🏪 بوابة البائعين
          </Link>
          <Link to="/admin/login"
            className="flex-1 text-center text-xs font-bold py-2.5 rounded-xl border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors">
            🔐 بوابة الإدارة
          </Link>
        </div>
      </div>

      <DevPanel devLogin={devLogin} navigate={navigate} />

    </div>
  )
}
