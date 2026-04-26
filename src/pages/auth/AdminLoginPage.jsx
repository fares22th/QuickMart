import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

const schema = z.object({
  email:    z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور قصيرة'),
})

const darkWrap = (err) =>
  `flex items-center rounded-2xl border overflow-hidden transition-all duration-200 focus-within:ring-2 ${
    err ? 'border-red-500/40 focus-within:ring-red-500/20' : 'border-white/10 focus-within:border-indigo-500 focus-within:ring-indigo-500/20'}`
const dInp  = 'flex-1 px-4 py-3 text-sm bg-transparent outline-none placeholder:text-gray-600'
const dInpS = { color: '#e0e7ff' }
const dBg   = { background: 'rgba(255,255,255,0.05)' }

function DErr({ msg }) {
  if (!msg) return null
  return (
    <p className="flex items-center gap-1 text-red-400 text-xs mt-1.5">
      <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  )
}

const DEV = import.meta.env.DEV

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, devLogin } = useAuth()
  const [show, setShow] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    const prof = await login(data)
    if (prof?.role === 'admin') {
      navigate('/admin')
    } else {
      toast.error('هذا الحساب لا يملك صلاحيات الإدارة')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: 'rgba(99,102,241,.2)', border: '1px solid rgba(99,102,241,.3)' }}>
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#818cf8" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">دخول لوحة الإدارة</h2>
        <p className="text-sm mt-1.5" style={{ color: 'rgba(165,180,252,.55)' }}>أدخل بيانات حسابك للمتابعة</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* email */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'rgba(199,210,254,.8)' }}>البريد الإلكتروني</label>
          <div className={darkWrap(errors.email)} style={dBg}>
            <div className="px-3 shrink-0" style={{ color: 'rgba(165,180,252,.4)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input type="email" placeholder="admin@quickmart.sa" dir="ltr" className={dInp} style={dInpS} {...register('email')} />
          </div>
          <DErr msg={errors.email?.message} />
        </div>

        {/* password */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'rgba(199,210,254,.8)' }}>كلمة المرور</label>
          <div className={darkWrap(errors.password)} style={dBg}>
            <input type={show ? 'text' : 'password'} placeholder="••••••••" className={dInp} style={dInpS} {...register('password')} />
            <button type="button" onClick={() => setShow(v => !v)} className="px-4 shrink-0" style={{ color: 'rgba(165,180,252,.5)' }} tabIndex={-1}>
              {show
                ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              }
            </button>
          </div>
          <DErr msg={errors.password?.message} />
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
          style={{ background: 'linear-gradient(135deg,#6366F1,#4F46E5)', boxShadow: '0 8px 24px rgba(99,102,241,.4)' }}>
          {isLoading
            ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>جاري الدخول...</>
            : <>دخول لوحة التحكم <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></>
          }
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,.06)' }} />
        <span className="text-xs" style={{ color: 'rgba(165,180,252,.35)' }}>أو</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,.06)' }} />
      </div>

      <p className="text-center text-sm" style={{ color: 'rgba(165,180,252,.5)' }}>
        ليس لديك حساب؟{' '}
        <Link to="/admin/register" className="font-bold" style={{ color: 'rgba(129,140,248,.8)' }}>إنشاء حساب مدير</Link>
      </p>

      <p className="text-center text-xs mt-4" style={{ color: 'rgba(99,102,241,.4)' }}>
        <Link to="/login" className="hover:opacity-70">← بوابة العملاء</Link>
        {' · '}
        <Link to="/seller/login" className="hover:opacity-70">بوابة البائعين</Link>
      </p>

      {DEV && (
        <div className="mt-5 p-3.5 rounded-2xl border-2 border-dashed border-yellow-400/60"
          style={{ background: 'rgba(254,243,199,.08)' }}>
          <p className="text-xs font-bold text-yellow-400 mb-2.5 flex items-center gap-1.5">
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
      )}
    </div>
  )
}
