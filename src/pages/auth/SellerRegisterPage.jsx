import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'

/* ── Schemas ── */
const s1 = z.object({
  name:            z.string().min(2,  'الاسم يجب أن يكون حرفين على الأقل'),
  email:           z.string().email('البريد الإلكتروني غير صحيح'),
  password:        z.string().min(6,  'كلمة المرور يجب أن تكون ٦ أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: 'كلمتا المرور غير متطابقتين', path: ['confirmPassword'] })

const s2 = z.object({
  storeName:     z.string().min(3,  'اسم المتجر يجب أن يكون ٣ أحرف على الأقل'),
  storeCategory: z.string().min(1,  'اختر تصنيف المتجر'),
  city:          z.string().min(1,  'اختر المدينة'),
  storeDesc:     z.string().min(20, 'الوصف يجب أن يكون ٢٠ حرفاً على الأقل'),
})


const CATS  = ['مواد غذائية','إلكترونيات','ملابس وأزياء','صحة وجمال','منزل ومطبخ','رياضة ولياقة','كتب وتعليم','أخرى']
const CITIES = ['الرياض','جدة','مكة المكرمة','المدينة المنورة','الدمام','الخبر','تبوك','أبها','حائل','نجران','أخرى']

/* ── UI helpers ── */
function Err({ msg }) {
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

const bx = (e) =>
  `flex items-center border rounded-2xl overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-0 ${
    e ? 'border-red-400 focus-within:ring-red-200' : 'border-gray-200 focus-within:border-amber-500 focus-within:ring-amber-100'}`

const ic = 'flex-1 px-4 py-3 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400'

const selCls = (e) =>
  `w-full border rounded-2xl px-4 py-3 text-sm outline-none appearance-none cursor-pointer text-gray-800 transition-all focus:ring-2 focus:ring-amber-100 ${
    e ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-amber-500'}`

function PwField({ reg, name, label, err }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className={bx(err)}>
        <input type={show ? 'text' : 'password'} placeholder="••••••••" className={ic} {...reg(name)} />
        <button type="button" onClick={() => setShow(v => !v)} className="px-4 text-gray-400 hover:text-gray-600 shrink-0" tabIndex={-1}>
          {show
            ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          }
        </button>
      </div>
      <Err msg={err} />
    </div>
  )
}

/* ── Progress bar ── */
const STEPS = ['معلوماتك','المتجر']
function ProgressBar({ cur }) {
  return (
    <div className="flex items-start gap-0 mb-8">
      {STEPS.map((label, i) => {
        const n = i + 1
        const done = cur > n, active = cur === n
        return (
          <div key={n} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                done || active ? 'text-white' : 'text-gray-400 bg-gray-100'}`}
                style={done ? { background: '#F59E0B' } : active ? { background: 'linear-gradient(135deg,#F59E0B,#D97706)', boxShadow: '0 4px 12px rgba(245,158,11,.4)' } : {}}>
                {done
                  ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  : n}
              </div>
              <span className={`text-xs mt-1 font-medium ${n <= cur ? 'text-amber-600' : 'text-gray-400'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 mt-[-1.2rem] rounded-full transition-all duration-500"
                style={{ background: cur > n ? '#F59E0B' : '#E5E7EB' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Step forms ── */
function Step1({ reg, errs }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم الكامل</label>
        <div className={bx(errs.name?.message)}>
          <div className="px-3 text-gray-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
          <input type="text" placeholder="اسم صاحب المتجر" className={ic} {...reg('name')} />
        </div>
        <Err msg={errs.name?.message} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
        <div className={bx(errs.email?.message)}>
          <div className="px-3 text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <input type="email" placeholder="example@email.com" dir="ltr" className={ic} {...reg('email')} />
        </div>
        <Err msg={errs.email?.message} />
      </div>
      <PwField reg={reg} name="password" label="كلمة المرور" err={errs.password?.message} />
      <PwField reg={reg} name="confirmPassword" label="تأكيد كلمة المرور" err={errs.confirmPassword?.message} />
    </div>
  )
}

function Step2({ reg, errs }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المتجر</label>
        <div className={bx(errs.storeName?.message)}>
          <div className="px-3 text-gray-400"><span className="text-base">🏪</span></div>
          <input type="text" placeholder="اسم متجرك التجاري" className={ic} {...reg('storeName')} />
        </div>
        <Err msg={errs.storeName?.message} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">تصنيف المتجر</label>
        <div className="relative">
          <select className={selCls(errs.storeCategory?.message)} {...reg('storeCategory')}>
            <option value="">اختر التصنيف...</option>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </div>
        <Err msg={errs.storeCategory?.message} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">المدينة</label>
        <div className="relative">
          <select className={selCls(errs.city?.message)} {...reg('city')}>
            <option value="">اختر المدينة...</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </div>
        <Err msg={errs.city?.message} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">وصف المتجر</label>
        <textarea placeholder="اكتب وصفاً مختصراً عن متجرك ومنتجاتك (٢٠ حرف على الأقل)" rows={3}
          className={`w-full border rounded-2xl px-4 py-3 text-sm outline-none resize-none text-gray-800 placeholder:text-gray-400 transition-all focus:ring-2 focus:ring-amber-100 ${errs.storeDesc?.message ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-amber-500'}`}
          {...reg('storeDesc')} />
        <Err msg={errs.storeDesc?.message} />
      </div>
    </div>
  )
}

/* ── Left branding perks ── */
const perks = [
  { icon: '📦', t: 'إدارة المنتجات', d: 'أضف وعدّل منتجاتك بسهولة' },
  { icon: '📊', t: 'تقارير مبيعاتك', d: 'تابع أرباحك لحظة بلحظة' },
  { icon: '🚀', t: 'وصول واسع', d: 'آلاف العملاء بانتظارك' },
  { icon: '💰', t: 'دفع أسبوعي', d: 'استلم أرباحك بدون تعقيد' },
]

/* ── Main ── */
export default function SellerRegisterPage() {
  const navigate  = useNavigate()
  const { registerSeller, isLoading } = useAuth()
  const [step, setStep]   = useState(1)
  const [saved, setSaved] = useState({})

  const schemas = [null, s1, s2]
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(schemas[step]) })

  const onNext = (data) => { setSaved(p => ({ ...p, ...data })); reset(); setStep(s => s + 1) }
  const onBack = ()     => { reset(); setStep(s => s - 1) }
  const onSubmit = async (data) => {
    const prof = await registerSeller({ ...saved, ...data })
    navigate(prof?.role === 'admin' ? '/admin' : '/seller')
  }

  const isLast = step === 2
  const titles = [null,
    { h: 'معلوماتك الشخصية', s: 'أدخل بياناتك الأساسية' },
    { h: 'معلومات المتجر',   s: 'أخبرنا عن متجرك' },
  ]

  return (
    <div className="min-h-screen flex font-cairo" dir="rtl">

      {/* ── Left branding ── amber */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(145deg,#F59E0B 0%,#D97706 45%,#B45309 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-28 -left-28 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,#fff 0%,transparent 70%)' }} />
          <div className="absolute bottom-0 -right-20 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#fff 0%,transparent 70%)' }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.05]">
            <defs><pattern id="d" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2" fill="white" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#d)" />
          </svg>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🏪</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-white">QuickMart</span>
            <span className="block text-xs text-white/60 -mt-0.5">بوابة البائعين</span>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
          <h2 className="text-4xl font-bold text-white leading-snug mb-3">ابدأ رحلة<br />البيع اليوم</h2>
          <p className="text-white/70 text-base leading-relaxed mb-10">
            انضم لآلاف البائعين الناجحين وحقّق دخلاً إضافياً
          </p>
          <div className="grid grid-cols-2 gap-3">
            {perks.map(p => (
              <div key={p.t} className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <span className="text-2xl block mb-2">{p.icon}</span>
                <p className="text-white font-bold text-sm">{p.t}</p>
                <p className="text-white/60 text-xs mt-1">{p.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0">⭐</div>
          <div>
            <p className="text-white font-bold text-sm">متوسط دخل البائع</p>
            <p className="text-white/60 text-xs">+٨٥٠٠ ريال شهرياً للبائع النشط</p>
          </div>
        </div>
      </div>

      {/* ── Right form ── */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        <div className="lg:hidden px-6 pt-8 pb-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-lg">🏪</div>
            <span className="text-xl font-bold text-amber-600">QuickMart</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-14 py-10">
          <div className="w-full max-w-sm">

            <div className="mb-5">
              <h2 className="text-2xl font-bold text-gray-900">{titles[step].h}</h2>
              <p className="text-gray-500 text-sm mt-1">{titles[step].s}</p>
            </div>

            <ProgressBar cur={step} />

            <form onSubmit={handleSubmit(isLast ? onSubmit : onNext)}>
              {step === 1 && <Step1 reg={register} errs={errors} />}
              {step === 2 && <Step2 reg={register} errs={errors} />}

              <div className={`flex gap-3 mt-6 ${step > 1 ? '' : ''}`}>
                {step > 1 && (
                  <button type="button" onClick={onBack}
                    className="flex-1 py-3.5 rounded-2xl font-bold text-sm border-2 border-amber-400 text-amber-700 hover:bg-amber-50 transition-colors">
                    السابق
                  </button>
                )}
                <button type="submit" disabled={isLoading}
                  className={`py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 ${step > 1 ? 'flex-1' : 'w-full'}`}
                  style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)', boxShadow: '0 8px 24px rgba(245,158,11,.35)' }}>
                  {isLoading
                    ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>جاري الإنشاء...</>
                    : isLast
                      ? <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>إنشاء حساب البائع</>
                      : <>التالي<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></>
                  }
                </button>
              </div>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100" /><span className="text-xs text-gray-400">أو</span><div className="flex-1 h-px bg-gray-100" />
            </div>
            <p className="text-center text-sm text-gray-500">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="font-bold text-amber-600">تسجيل الدخول</Link>
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 pb-5">© {new Date().getFullYear()} QuickMart</p>
      </div>
    </div>
  )
}
