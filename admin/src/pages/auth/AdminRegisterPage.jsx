import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'

const schema = z.object({
  inviteCode:      z.string().min(6,  'رمز الدعوة مطلوب'),
  name:            z.string().min(2,  'الاسم مطلوب'),
  email:           z.string().email( 'بريد إلكتروني غير صحيح'),
  phone:           z.string().min(9,  'رقم الهاتف غير صحيح'),
  password:        z.string().min(8,  'كلمة المرور يجب أن تكون ٨ أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
})

/* ── dark field helpers ── */
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

function DLabel({ children }) {
  return <label className="block text-sm font-semibold mb-2" style={{ color: 'rgba(199,210,254,.8)' }}>{children}</label>
}

function DPwField({ register, name, label, error }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <DLabel>{label}</DLabel>
      <div className={darkWrap(error)} style={dBg}>
        <input type={show ? 'text' : 'password'} placeholder="••••••••" className={dInp} style={dInpS} {...register(name)} />
        <button type="button" onClick={() => setShow(v => !v)}
          className="px-4 shrink-0 transition-colors" style={{ color: 'rgba(165,180,252,.5)' }} tabIndex={-1}>
          {show
            ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          }
        </button>
      </div>
      <DErr msg={error} />
    </div>
  )
}

/* ── Left branding features ── */
const features = [
  { icon: '🛡️', label: 'وصول كامل للوحة التحكم' },
  { icon: '📈', label: 'تقارير المنصة الشاملة' },
  { icon: '👥', label: 'إدارة البائعين والعملاء' },
  { icon: '⚙️', label: 'إعدادات النظام والصلاحيات' },
  { icon: '🔔', label: 'تنبيهات وإشعارات فورية' },
  { icon: '💹', label: 'إدارة العمولات والمدفوعات' },
]

export default function AdminRegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    await registerUser({
      name: data.name, email: data.email, phone: data.phone,
      password: data.password, inviteCode: data.inviteCode, role: 'admin',
    })
    navigate('/admin')
  }

  const darkPage = { background: '#0a0918' }
  const leftPanel = { background: 'linear-gradient(145deg,#1e1b4b 0%,#312e81 45%,#3730a3 100%)' }

  return (
    <div className="min-h-screen flex font-cairo" dir="rtl" style={darkPage}>

      {/* ── Left branding ── dark indigo */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12" style={leftPanel}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle,#6366f1 0%,transparent 70%)' }} />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,#818cf8 0%,transparent 70%)' }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.08]">
            <defs><pattern id="ag" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0L0 0 0 40" fill="none" stroke="#a5b4fc" strokeWidth="0.5" />
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#ag)" />
          </svg>
        </div>

        {/* logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,.3)', border: '1px solid rgba(99,102,241,.3)' }}>
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#a5b4fc" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-bold text-white">QuickMart</span>
            <span className="block text-xs -mt-0.5" style={{ color: 'rgba(165,180,252,.7)' }}>لوحة الإدارة</span>
          </div>
        </div>

        {/* center */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: 'rgba(99,102,241,.2)', border: '1px solid rgba(99,102,241,.25)' }}>
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#818cf8" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white leading-snug mb-3">وصول آمن<br />للإدارة</h2>
          <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(165,180,252,.65)' }}>
            منطقة مقيّدة — يتطلب الوصول رمز دعوة<br />صادراً من مدير النظام فقط
          </p>
          <div className="grid grid-cols-2 gap-3">
            {features.map(f => (
              <div key={f.label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                style={{ background: 'rgba(99,102,241,.12)', border: '1px solid rgba(99,102,241,.15)' }}>
                <span className="text-lg shrink-0">{f.icon}</span>
                <span className="text-xs" style={{ color: 'rgba(199,210,254,.75)' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* warning */}
        <div className="relative z-10 flex items-center gap-3 rounded-2xl p-4"
          style={{ background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.2)' }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(253,230,138,.7)' }}>
            هذه المنطقة محمية — إذا لم يكن لديك رمز دعوة تواصل مع مدير النظام
          </p>
        </div>
      </div>

      {/* ── Right form ── dark */}
      <div className="flex-1 flex flex-col overflow-y-auto" style={darkPage}>
        {/* mobile logo */}
        <div className="lg:hidden px-6 pt-8 pb-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-indigo-400">QuickMart</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-14 py-10">
          <div className="w-full max-w-sm">

            <div className="mb-7">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(99,102,241,.2)', border: '1px solid rgba(99,102,241,.3)' }}>
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#818cf8" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">تسجيل مدير جديد</h2>
              <p className="text-sm mt-1.5" style={{ color: 'rgba(165,180,252,.55)' }}>أدخل رمز الدعوة الخاص بك للمتابعة</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* invite code */}
              <div>
                <DLabel>🔑 رمز الدعوة</DLabel>
                <div className={`flex items-center rounded-2xl border overflow-hidden transition-all duration-200 focus-within:ring-2 ${
                  errors.inviteCode ? 'border-red-500/40 focus-within:ring-red-500/20' : 'border-indigo-500/30 focus-within:border-indigo-400 focus-within:ring-indigo-500/20'}`}
                  style={{ background: 'rgba(99,102,241,.1)' }}>
                  <div className="px-3 shrink-0" style={{ color: 'rgba(165,180,252,.5)' }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                  </div>
                  <input type="text" placeholder="ADMIN-XXXX-XXXX" dir="ltr"
                    className={dInp + ' font-mono uppercase tracking-widest'}
                    style={dInpS} {...register('inviteCode')} />
                </div>
                {errors.inviteCode
                  ? <DErr msg={errors.inviteCode.message} />
                  : <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: 'rgba(165,180,252,.4)' }}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                      هذا الرمز صادر من مسؤول النظام فقط
                    </p>
                }
              </div>

              {/* divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,.06)' }} />
                <span className="text-xs" style={{ color: 'rgba(165,180,252,.35)' }}>بياناتك الشخصية</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,.06)' }} />
              </div>

              {/* name */}
              <div>
                <DLabel>الاسم الكامل</DLabel>
                <div className={darkWrap(errors.name?.message)} style={dBg}>
                  <div className="px-3 shrink-0" style={{ color: 'rgba(165,180,252,.4)' }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <input type="text" placeholder="اسم المدير" className={dInp} style={dInpS} {...register('name')} />
                </div>
                <DErr msg={errors.name?.message} />
              </div>

              {/* email */}
              <div>
                <DLabel>البريد الإلكتروني</DLabel>
                <div className={darkWrap(errors.email?.message)} style={dBg}>
                  <div className="px-3 shrink-0" style={{ color: 'rgba(165,180,252,.4)' }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <input type="email" placeholder="admin@quickmart.sa" dir="ltr" className={dInp} style={dInpS} {...register('email')} />
                </div>
                <DErr msg={errors.email?.message} />
              </div>

              {/* phone */}
              <div>
                <DLabel>رقم الهاتف</DLabel>
                <div className={darkWrap(errors.phone?.message)} style={dBg}>
                  <div className="flex items-center gap-1.5 px-3 py-3 shrink-0 border-l"
                    style={{ borderColor: 'rgba(255,255,255,.06)', background: 'rgba(255,255,255,.03)' }}>
                    <span className="text-base leading-none">🇸🇦</span>
                    <span className="text-sm font-medium" style={{ color: 'rgba(199,210,254,.55)' }}>+966</span>
                  </div>
                  <input type="tel" placeholder="5xxxxxxxx" dir="ltr" className={dInp} style={dInpS} {...register('phone')} />
                </div>
                <DErr msg={errors.phone?.message} />
              </div>

              <DPwField register={register} name="password" label="كلمة المرور" error={errors.password?.message} />
              <DPwField register={register} name="confirmPassword" label="تأكيد كلمة المرور" error={errors.confirmPassword?.message} />

              {/* submit */}
              <button type="submit" disabled={isLoading}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-1"
                style={{ background: 'linear-gradient(135deg,#6366F1,#4F46E5)', boxShadow: '0 8px 24px rgba(99,102,241,.4)' }}>
                {isLoading
                  ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>جاري الإنشاء...</>
                  : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>إنشاء حساب المدير</>
                }
              </button>
            </form>

            <p className="text-center text-sm mt-5">
              <Link to="/login" className="transition-colors" style={{ color: 'rgba(129,140,248,.65)' }}>
                → العودة إلى تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs pb-5" style={{ color: 'rgba(99,102,241,.4)' }}>
          © {new Date().getFullYear()} QuickMart — وصول مقيّد
        </p>
      </div>
    </div>
  )
}
