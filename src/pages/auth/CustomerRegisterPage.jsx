import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'

const schema = z.object({
  name:            z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email:           z.string().email('البريد الإلكتروني غير صحيح'),
  password:        z.string().min(6, 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل'),
  confirmPassword: z.string(),
  terms: z.literal(true, { errorMap: () => ({ message: 'يجب الموافقة على الشروط' }) }),
}).refine(d => d.password === d.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
})

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
      <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  )
}

const wrap = (err) =>
  `flex items-center border rounded-2xl overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-0 ${err
    ? 'border-red-400 focus-within:ring-red-200'
    : 'border-gray-200 focus-within:border-[#00C896] focus-within:ring-[#00C896]/15'}`

const inp = 'flex-1 px-4 py-3 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400'

function PasswordField({ register, name, label, error }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className={wrap(error)}>
        <input type={show ? 'text' : 'password'} placeholder="••••••••" className={inp} {...register(name)} />
        <button type="button" onClick={() => setShow(v => !v)}
          className="px-4 text-gray-400 hover:text-gray-600 shrink-0" tabIndex={-1}>
          {show
            ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          }
        </button>
      </div>
      <FieldError msg={error} />
    </div>
  )
}

/* ── Left panel stats ── */
const stats = [
  { icon: '🛒', title: 'تسوق من أي مكان', desc: 'آلاف المنتجات في راحة يدك' },
  { icon: '🚀', title: 'توصيل سريع', desc: 'استلم طلبك خلال ساعات' },
  { icon: '🔒', title: 'دفع آمن ومضمون', desc: 'تشفير كامل لبياناتك' },
  { icon: '↩️', title: 'إرجاع سهل', desc: 'سياسة إرجاع مرنة ٧ أيام' },
]

export default function CustomerRegisterPage() {
  const navigate = useNavigate()
  const { registerCustomer, isLoading } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    const prof = await registerCustomer({ name: data.name, email: data.email, password: data.password })
    navigate(prof?.role === 'seller' ? '/seller' : prof?.role === 'admin' ? '/admin' : '/')
  }

  return (
    <div className="min-h-screen flex font-cairo" dir="rtl">

      {/* ── Left branding ── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(145deg,#00C896 0%,#00A878 45%,#007A58 100%)' }}>
        {/* decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,#fff 0%,transparent 70%)' }} />
          <div className="absolute bottom-0 -right-20 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#fff 0%,transparent 70%)' }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
            <defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0L0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#g)" />
          </svg>
        </div>

        {/* logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 5h13M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-white">QuickMart</span>
        </div>

        {/* center */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
          <h2 className="text-4xl font-bold text-white leading-snug mb-4">
            عالم التسوق<br />في راحة يدك
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-10">
            انضم لأكثر من ٥٠ ألف عميل يتسوقون يومياً من أفضل المتاجر
          </p>
          <div className="grid grid-cols-2 gap-3">
            {stats.map(s => (
              <div key={s.title} className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <span className="text-2xl block mb-2">{s.icon}</span>
                <p className="text-white font-bold text-sm">{s.title}</p>
                <p className="text-white/60 text-xs mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* bottom */}
        <div className="relative z-10 bg-white/10 backdrop-blur rounded-2xl p-4 flex items-center gap-3">
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4'].map((c, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-xs font-bold text-white"
                style={{ background: c }}>
                {['م','أ','س','ف'][i]}
              </div>
            ))}
          </div>
          <div>
            <p className="text-white font-bold text-sm">انضم لمجتمعنا</p>
            <p className="text-white/60 text-xs">+٥٠٠ عضو جديد هذا الأسبوع</p>
          </div>
        </div>
      </div>

      {/* ── Right form ── */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        {/* mobile logo */}
        <div className="lg:hidden px-6 pt-8 pb-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#00C896' }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 5h13M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold" style={{ color: '#00C896' }}>QuickMart</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-14 py-10">
          <div className="w-full max-w-sm">

            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-900">إنشاء حساب جديد 🎉</h2>
              <p className="text-gray-500 text-sm mt-1.5">أنشئ حسابك وابدأ التسوق الآن</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم الكامل</label>
                <div className={wrap(errors.name?.message)}>
                  <div className="px-3 text-gray-400 shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input type="text" placeholder="محمد عبدالله" className={inp} {...register('name')} />
                </div>
                <FieldError msg={errors.name?.message} />
              </div>

              {/* email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
                <div className={wrap(errors.email?.message)}>
                  <div className="px-3 text-gray-400 shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input type="email" placeholder="example@email.com" dir="ltr" className={inp} {...register('email')} />
                </div>
                <FieldError msg={errors.email?.message} />
              </div>

              <PasswordField register={register} name="password" label="كلمة المرور" error={errors.password?.message} />
              <PasswordField register={register} name="confirmPassword" label="تأكيد كلمة المرور" error={errors.confirmPassword?.message} />

              {/* terms */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input type="checkbox" className="w-4 h-4 mt-0.5 rounded shrink-0 cursor-pointer"
                  style={{ accentColor: '#00C896' }} {...register('terms')} />
                <span className="text-sm text-gray-600 leading-relaxed">
                  أوافق على{' '}
                  <a href="#" className="font-semibold" style={{ color: '#00C896' }}>الشروط والأحكام</a>
                  {' '}و{' '}
                  <a href="#" className="font-semibold" style={{ color: '#00C896' }}>سياسة الخصوصية</a>
                </span>
              </label>
              <FieldError msg={errors.terms?.message} />

              {/* submit */}
              <button type="submit" disabled={isLoading}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 mt-1"
                style={{ background: 'linear-gradient(135deg,#00C896,#00A878)', boxShadow: '0 8px 24px rgba(0,200,150,.35)' }}>
                {isLoading
                  ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>جاري الإنشاء...</>
                  : <>إنشاء الحساب<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></>
                }
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100" /><span className="text-xs text-gray-400">أو</span><div className="flex-1 h-px bg-gray-100" />
            </div>

            <p className="text-center text-sm text-gray-500">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="font-bold" style={{ color: '#00C896' }}>تسجيل الدخول</Link>
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="text-xs text-center text-gray-400 mb-3">هل أنت بائع أو مدير؟</p>
              <div className="flex gap-2">
                <Link to="/register/seller"
                  className="flex-1 text-center text-xs font-bold py-2.5 rounded-xl border-2 border-amber-400 text-amber-600 hover:bg-amber-50 transition-colors">
                  🏪 سجّل كبائع
                </Link>
                <Link to="/admin/register"
                  className="flex-1 text-center text-xs font-bold py-2.5 rounded-xl border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors">
                  🔐 دخول المدير
                </Link>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-5">
          © {new Date().getFullYear()} QuickMart
        </p>
      </div>
    </div>
  )
}
