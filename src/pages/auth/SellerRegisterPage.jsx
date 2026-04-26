import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import {
  User, Mail, Lock, Phone, CreditCard, Store, MapPin,
  FileText, Upload, ChevronLeft, ChevronRight, Check,
  Banknote, Clock, Package, Shield, Zap, TrendingUp, Star,
} from 'lucide-react'

// ── Schemas ──────────────────────────────────────────────────────────────────
const schema1 = z.object({
  name:        z.string().min(2, 'الاسم مطلوب'),
  phone:       z.string().min(9, 'رقم الجوال غير صحيح'),
  national_id: z.string().min(10, 'رقم الهوية يجب أن يكون ١٠ أرقام'),
})

const schema2 = z.object({
  email:           z.string().email('البريد الإلكتروني غير صحيح'),
  password:        z.string().min(8, 'كلمة المرور ٨ أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
})

const schema3 = z.object({
  storeName:        z.string().min(3, 'اسم المتجر مطلوب'),
  storeCategory:    z.string().min(1, 'اختر التصنيف'),
  city:             z.string().min(1, 'اختر المدينة'),
  address:          z.string().min(5, 'العنوان مطلوب'),
  storeDesc:        z.string().min(20, 'الوصف ٢٠ حرفاً على الأقل'),
  delivery_fee:     z.coerce.number().min(0),
  min_order:        z.coerce.number().min(0),
  delivery_time_min: z.coerce.number().min(10).max(180),
})

const schema4 = z.object({
  cr_number: z.string().optional(),
})

const schema5 = z.object({
  bank_name: z.string().min(2, 'اسم البنك مطلوب'),
  iban:      z.string().min(24, 'رقم الآيبان غير صحيح').regex(/^SA\d{22}$/, 'الآيبان يبدأ بـ SA ويتكوّن من ٢٤ خانة'),
  terms:     z.literal(true, { errorMap: () => ({ message: 'يجب الموافقة على الشروط' }) }),
})

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { v: 'grocery',     l: 'مواد غذائية',     e: '🛒' },
  { v: 'fruits',      l: 'خضروات وفواكه',    e: '🥦' },
  { v: 'bakery',      l: 'مخبوزات وحلويات',  e: '🥐' },
  { v: 'dairy',       l: 'ألبان ومنتجات',    e: '🥛' },
  { v: 'meat',        l: 'لحوم ودواجن',      e: '🥩' },
  { v: 'beverages',   l: 'مشروبات',          e: '🧃' },
  { v: 'pharmacy',    l: 'صحة وجمال',        e: '💊' },
  { v: 'electronics', l: 'إلكترونيات',       e: '📱' },
  { v: 'other',       l: 'أخرى',             e: '📦' },
]

const CITIES = [
  'الرياض','جدة','مكة المكرمة','المدينة المنورة',
  'الدمام','الخبر','الظهران','أبها','تبوك','حائل','القصيم','نجران',
]

const BANKS = [
  'البنك الأهلي السعودي','بنك الراجحي','البنك السعودي الفرنسي',
  'بنك الرياض','البنك السعودي للاستثمار','بنك البلاد','بنك الجزيرة',
  'بنك سامبا','البنك العربي الوطني',
]

const STEPS = [
  { label: 'معلوماتك',    icon: User },
  { label: 'حسابك',       icon: Mail },
  { label: 'متجرك',       icon: Store },
  { label: 'المستندات',   icon: FileText },
  { label: 'الدفع',       icon: Banknote },
]

const PERKS = [
  { icon: Zap,        t: 'تفعيل في ٢٤ ساعة', d: 'ابدأ البيع بسرعة' },
  { icon: TrendingUp, t: '+٨٥٠٠ ريال/شهر',   d: 'متوسط دخل البائع النشط' },
  { icon: Package,    t: 'لوحة تحكم كاملة',  d: 'إدارة سهلة لمنتجاتك' },
  { icon: Star,       t: 'دعم ٢٤/٧',         d: 'فريقنا دائماً معك' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const inp = (err) =>
  `w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm outline-none transition-all
   ${err ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100/50'}`

function Field({ label, error, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
      {hint && !error && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
          <span>⚠</span>{error}
        </p>
      )}
    </div>
  )
}

function PwField({ reg, name, label, err }) {
  const [show, setShow] = useState(false)
  return (
    <Field label={label} error={err}>
      <div className={`flex items-center border rounded-xl overflow-hidden transition-all ${err ? 'border-red-300' : 'border-gray-200 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100/50'}`}>
        <input type={show ? 'text' : 'password'} placeholder="••••••••" className="flex-1 px-4 py-2.5 text-sm bg-gray-50 outline-none" {...reg(name)} />
        <button type="button" onClick={() => setShow(v => !v)} className="px-3 text-gray-400 hover:text-gray-600 bg-gray-50">
          {show
            ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          }
        </button>
      </div>
    </Field>
  )
}

function UploadBox({ label, hint, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
      <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all
        ${value ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/30'}`}>
        <input type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png"
          onChange={e => onChange(e.target.files?.[0]?.name ?? null)} />
        {value
          ? <><Check className="w-5 h-5 text-amber-600" /><span className="text-xs text-amber-700 font-semibold text-center">{value}</span></>
          : <><Upload className="w-5 h-5 text-gray-400" /><span className="text-xs text-gray-500 text-center">{hint}</span></>
        }
      </label>
    </div>
  )
}

// ── Step Panels ───────────────────────────────────────────────────────────────
function Step1({ reg, errs }) {
  return (
    <div className="space-y-4">
      <Field label="الاسم الكامل" error={errs.name?.message}>
        <input placeholder="كما هو في الهوية الوطنية" className={inp(errs.name)} {...reg('name')} />
      </Field>
      <Field label="رقم الجوال" error={errs.phone?.message}>
        <div className="flex gap-2">
          <span className="flex items-center bg-gray-100 border border-gray-200 rounded-xl px-3 text-sm text-gray-500 font-mono shrink-0">+966</span>
          <input placeholder="5XXXXXXXX" className={`${inp(errs.phone)} flex-1`} dir="ltr" {...reg('phone')} />
        </div>
      </Field>
      <Field label="رقم الهوية الوطنية / الإقامة" error={errs.national_id?.message} hint="١٠ أرقام بدون مسافات">
        <input placeholder="١٠٠٠٠٠٠٠٠٠" className={inp(errs.national_id)} dir="ltr" {...reg('national_id')} />
      </Field>
    </div>
  )
}

function Step2({ reg, errs }) {
  return (
    <div className="space-y-4">
      <Field label="البريد الإلكتروني" error={errs.email?.message}>
        <input type="email" placeholder="vendor@example.com" dir="ltr" className={inp(errs.email)} {...reg('email')} />
      </Field>
      <PwField reg={reg} name="password" label="كلمة المرور" err={errs.password?.message} />
      <PwField reg={reg} name="confirmPassword" label="تأكيد كلمة المرور" err={errs.confirmPassword?.message} />
    </div>
  )
}

function Step3({ reg, errs, watch }) {
  return (
    <div className="space-y-4">
      <Field label="اسم المتجر" error={errs.storeName?.message}>
        <input placeholder="مثال: متجر النور للمواد الغذائية" className={inp(errs.storeName)} {...reg('storeName')} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="التصنيف" error={errs.storeCategory?.message}>
          <select className={inp(errs.storeCategory)} {...reg('storeCategory')}>
            <option value="">اختر...</option>
            {CATEGORIES.map(c => <option key={c.v} value={c.v}>{c.e} {c.l}</option>)}
          </select>
        </Field>
        <Field label="المدينة" error={errs.city?.message}>
          <select className={inp(errs.city)} {...reg('city')}>
            <option value="">اختر...</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <Field label="العنوان التفصيلي" error={errs.address?.message}>
        <input placeholder="الحي، الشارع، رقم المبنى" className={inp(errs.address)} {...reg('address')} />
      </Field>

      <Field label="وصف المتجر" error={errs.storeDesc?.message}>
        <textarea rows={3} placeholder="اشرح ما تقدمه، مميزاتك، ساعات عملك..."
          className={`${inp(errs.storeDesc)} resize-none`} {...reg('storeDesc')} />
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Field label="رسوم التوصيل (ر.س)" error={errs.delivery_fee?.message}>
          <input type="number" min="0" placeholder="١٥" className={inp(errs.delivery_fee)} {...reg('delivery_fee')} />
        </Field>
        <Field label="الحد الأدنى (ر.س)" error={errs.min_order?.message}>
          <input type="number" min="0" placeholder="٥٠" className={inp(errs.min_order)} {...reg('min_order')} />
        </Field>
        <Field label="وقت التوصيل (دقيقة)" error={errs.delivery_time_min?.message}>
          <input type="number" min="10" max="180" placeholder="٣٠" className={inp(errs.delivery_time_min)} {...reg('delivery_time_min')} />
        </Field>
      </div>
    </div>
  )
}

function Step4({ docs, setDocs }) {
  return (
    <div className="space-y-5">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
        <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          جميع المستندات تُراجع من فريقنا خلال ٢٤ ساعة. يُقبل PDF وصور JPG/PNG.
        </p>
      </div>

      <UploadBox
        label="السجل التجاري *"
        hint="ارفع صورة أو PDF للسجل التجاري"
        value={docs.cr}
        onChange={v => setDocs(d => ({ ...d, cr: v }))}
      />
      <UploadBox
        label="الوثيقة الضريبية"
        hint="ارفع شهادة تسجيل ضريبة القيمة المضافة (اختياري)"
        value={docs.tax}
        onChange={v => setDocs(d => ({ ...d, tax: v }))}
      />
      <UploadBox
        label="شعار المتجر *"
        hint="صورة مربعة ≥ 200×200 بكسل"
        value={docs.logo}
        onChange={v => setDocs(d => ({ ...d, logo: v }))}
      />
      <UploadBox
        label="صورة الغلاف"
        hint="بانر أفقي ≥ 1200×400 بكسل (اختياري)"
        value={docs.cover}
        onChange={v => setDocs(d => ({ ...d, cover: v }))}
      />
    </div>
  )
}

function Step5({ reg, errs }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">معلومات الدفع</p>
        <div className="space-y-4">
          <Field label="البنك" error={errs.bank_name?.message}>
            <select className={inp(errs.bank_name)} {...reg('bank_name')}>
              <option value="">اختر البنك...</option>
              {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="رقم الآيبان" error={errs.iban?.message} hint="يبدأ بـ SA مثال: SA0380000000608010167519">
            <input placeholder="SA0380000000608010167519" className={inp(errs.iban)} dir="ltr" {...reg('iban')} />
          </Field>
        </div>
      </div>

      <div className="bg-green-50 rounded-xl p-4 border border-green-100">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">جدول استلام الأرباح</p>
        {[
          ['دورية الدفع', 'أسبوعي (كل أحد)'],
          ['الحد الأدنى للسحب', '٥٠ ريال'],
          ['العمولة', '٨٪ من كل طلب مكتمل'],
          ['رسوم اشتراك', 'لا توجد رسوم ثابتة'],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-1.5 border-b border-green-100 last:border-0 text-xs">
            <span className="text-gray-500">{k}</span>
            <span className="font-bold text-gray-800">{v}</span>
          </div>
        ))}
      </div>

      <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
        <input type="checkbox" className="mt-0.5 w-4 h-4 accent-amber-500 shrink-0" {...reg('terms')} />
        <span className="text-xs text-gray-600 leading-relaxed">
          أوافق على{' '}
          <span className="text-amber-600 font-semibold">شروط الاستخدام</span>
          {' '}و{' '}
          <span className="text-amber-600 font-semibold">سياسة الخصوصية</span>
          {' '}لمنصة QuickMart، وأقرّ بأن جميع المعلومات المُدخَلة صحيحة.
        </span>
      </label>
      {errs.terms && <p className="text-xs text-red-500 flex items-center gap-1"><span>⚠</span>{errs.terms.message}</p>}
    </div>
  )
}

// ── Progress Stepper ──────────────────────────────────────────────────────────
function Stepper({ current }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((s, i) => {
        const done   = i < current
        const active = i === current
        const Icon   = s.icon
        return (
          <div key={s.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
                ${done   ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : active ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/40 scale-110'
                  : 'bg-gray-100 text-gray-300'}`}>
                {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-[10px] mt-1 font-semibold ${active ? 'text-amber-600' : done ? 'text-amber-500' : 'text-gray-300'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 rounded-full transition-all duration-500 ${done ? 'bg-amber-400' : 'bg-gray-100'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const SCHEMAS  = [schema1, schema2, schema3, null, schema5]
const TITLES   = [
  { h: 'معلوماتك الشخصية',        s: 'أدخل بيانات الهوية' },
  { h: 'بيانات حسابك',            s: 'البريد وكلمة المرور' },
  { h: 'معلومات متجرك',           s: 'أخبرنا عن متجرك ونطاق التوصيل' },
  { h: 'المستندات والصور',         s: 'ارفع الوثائق المطلوبة' },
  { h: 'إعداد الدفع والتأكيد',    s: 'آيبان واستلام الأرباح' },
]

export default function SellerRegisterPage() {
  const navigate = useNavigate()
  const { registerSeller, isLoading } = useAuth()
  const [step,    setStep]    = useState(0)
  const [saved,   setSaved]   = useState({})
  const [docs,    setDocs]    = useState({ cr: null, tax: null, logo: null, cover: null })

  const schema = SCHEMAS[step]
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
  })

  const isLast = step === STEPS.length - 1

  const onNext = (data) => {
    setSaved(p => ({ ...p, ...data }))
    reset()
    setStep(s => s + 1)
  }

  const onBack = () => { reset(); setStep(s => s - 1) }

  const onSubmit = async (data) => {
    const all = { ...saved, ...data }
    await registerSeller({
      name:             all.name,
      phone:            all.phone,
      national_id:      all.national_id,
      email:            all.email,
      password:         all.password,
      storeName:        all.storeName,
      storeCategory:    all.storeCategory,
      city:             all.city,
      address:          all.address,
      storeDesc:        all.storeDesc,
      crNumber:         all.cr_number,
      delivery_fee:     all.delivery_fee,
      min_order:        all.min_order,
      delivery_time_min: all.delivery_time_min,
      bank_name:        all.bank_name,
      iban:             all.iban,
    })
    navigate('/seller')
  }

  const handleStep4Next = () => {
    if (!docs.logo) { toast.error('شعار المتجر مطلوب'); return }
    setSaved(p => ({ ...p, docs }))
    setStep(s => s + 1)
  }

  return (
    <div className="min-h-screen flex" dir="rtl">

      {/* ── Left Branding ── */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(145deg,#F59E0B 0%,#D97706 45%,#92400E 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle,#fff 0%,transparent 70%)' }} />
          <div className="absolute bottom-10 right-0 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#fff 0%,transparent 70%)' }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
            <defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.5" fill="white" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-white font-black text-xl">QuickMart</p>
            <p className="text-white/60 text-xs">بوابة البائعين</p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 w-fit">
            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            <span className="text-white/90 text-xs font-semibold">+٢٠٠٠ بائع نشط</span>
          </div>
          <h2 className="text-4xl font-black text-white leading-snug mb-4">
            افتح متجرك<br />وابدأ الربح<br /><span className="text-amber-200">اليوم</span>
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-xs">
            انضم لآلاف البائعين الناجحين على QuickMart وحقّق دخلاً متميزاً مع أدوات إدارة احترافية.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PERKS.map(p => (
              <div key={p.t} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <p.icon className="w-5 h-5 text-amber-200 mb-2" />
                <p className="text-white font-bold text-sm">{p.t}</p>
                <p className="text-white/50 text-xs mt-0.5">{p.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom testimonial */}
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg shrink-0">👨‍🍳</div>
            <div>
              <p className="text-white font-semibold text-sm">"QuickMart غيّر حياتي"</p>
              <p className="text-white/60 text-xs mt-0.5">أحمد العتيبي — صاحب متجر مخبوزات — الرياض</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Form ── */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black text-amber-600">QuickMart</span>
          </div>
          <Link to="/seller/login" className="text-xs text-gray-500 hover:text-gray-700">
            لديك حساب؟ <span className="text-amber-600 font-semibold">سجّل دخولك</span>
          </Link>
        </div>

        <div className="flex-1 flex items-start justify-center px-6 sm:px-12 py-8">
          <div className="w-full max-w-lg">

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{TITLES[step].h}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{TITLES[step].s}</p>
                </div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                  {step + 1} / {STEPS.length}
                </span>
              </div>
            </div>

            <Stepper current={step} />

            {/* Form */}
            <form onSubmit={handleSubmit(isLast ? onSubmit : step === 3 ? handleStep4Next : onNext)}>
              {step === 0 && <Step1 reg={register} errs={errors} />}
              {step === 1 && <Step2 reg={register} errs={errors} />}
              {step === 2 && <Step3 reg={register} errs={errors} watch={watch} />}
              {step === 3 && <Step4 docs={docs} setDocs={setDocs} />}
              {step === 4 && <Step5 reg={register} errs={errors} />}

              <div className={`flex gap-3 mt-7 ${step > 0 ? 'justify-between' : ''}`}>
                {step > 0 && (
                  <button type="button" onClick={onBack}
                    className="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                    <ChevronRight className="w-4 h-4" /> السابق
                  </button>
                )}
                <button type={step === 3 ? 'button' : 'submit'}
                  onClick={step === 3 ? handleStep4Next : undefined}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-60 shadow-lg shadow-amber-500/30"
                  style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)' }}>
                  {isLoading
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />جاري التسجيل...</>
                    : isLast
                      ? <><Check className="w-4 h-4" />إنشاء حساب البائع</>
                      : <>التالي <ChevronLeft className="w-4 h-4" /></>
                  }
                </button>
              </div>
            </form>

            <div className="hidden lg:flex items-center gap-3 mt-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">لديك حساب؟</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <Link to="/seller/login"
              className="hidden lg:flex items-center justify-center mt-3 text-sm text-amber-600 font-bold hover:text-amber-700 transition-colors">
              تسجيل الدخول
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 py-4 border-t border-gray-50">
          © {new Date().getFullYear()} QuickMart — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  )
}
