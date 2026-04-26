import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Store, MapPin, Phone, FileText, Image, ChevronRight, Loader2,
  Check, Zap, ShoppingBag, Star, Package,
} from 'lucide-react'
import { createStore } from '@/api/stores.api'

const schema = z.object({
  name:        z.string().min(2, 'اسم المتجر مطلوب (٢ أحرف على الأقل)'),
  phone:       z.string().min(9, 'رقم الجوال غير صحيح'),
  city:        z.string().min(2, 'المدينة مطلوبة'),
  category:    z.string().min(1, 'التصنيف مطلوب'),
  description: z.string().min(10, 'الوصف مطلوب (١٠ أحرف على الأقل)'),
  cr_number:   z.string().optional(),
})

const CATEGORIES = [
  { value: 'grocery',     label: 'بقالة ومواد غذائية',   emoji: '🛒' },
  { value: 'fruits',      label: 'خضروات وفواكه',         emoji: '🥦' },
  { value: 'bakery',      label: 'مخبوزات وحلويات',       emoji: '🥐' },
  { value: 'dairy',       label: 'ألبان ومنتجات',         emoji: '🥛' },
  { value: 'meat',        label: 'لحوم ودواجن',           emoji: '🥩' },
  { value: 'beverages',   label: 'مشروبات',               emoji: '🧃' },
  { value: 'pharmacy',    label: 'صحة وجمال',             emoji: '💊' },
  { value: 'electronics', label: 'إلكترونيات',            emoji: '📱' },
  { value: 'other',       label: 'أخرى',                  emoji: '📦' },
]

const CITIES = ['الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الظهران', 'أبها', 'تبوك', 'حائل', 'القصيم']

const STEPS = ['المعلومات الأساسية', 'موقع المتجر', 'التصنيف والوصف']

const BENEFITS = [
  { icon: Zap,        label: 'تفعيل فوري',        desc: 'ابدأ البيع خلال ٢٤ ساعة' },
  { icon: ShoppingBag, label: 'وصول لآلاف العملاء', desc: 'منصة واسعة وموثوقة' },
  { icon: Star,       label: 'دعم متواصل',         desc: 'فريق دعم ٢٤/٧' },
  { icon: Package,    label: 'لوحة تحكم متكاملة',  desc: 'إدارة سهلة ومرنة' },
]

function Field({ label, error, children, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-400 mr-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <span>⚠</span>{error}
        </p>
      )}
    </div>
  )
}

const inp = (err) =>
  `w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:bg-white
   ${err ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/20'}`

export default function RegisterStorePage() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors }, trigger, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { category: '' },
  })

  const mutation = useMutation({
    mutationFn: (data) => createStore({
      name:        data.name,
      phone:       data.phone,
      city:        data.city,
      category:    data.category,
      description: data.description,
      cr_number:   data.cr_number || null,
      status:      'pending',
    }),
    onSuccess: () => {
      toast.success('تم إرسال طلب تسجيل متجرك! ستحصل على رد خلال ٢٤ ساعة 🎉')
      navigate('/seller')
    },
    onError: (e) => toast.error(e.message || 'فشل إنشاء المتجر'),
  })

  const nextStep = async () => {
    const fieldsPerStep = [['name', 'phone'], ['city'], ['category', 'description']]
    const ok = await trigger(fieldsPerStep[step])
    if (ok) setStep(s => s + 1)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-5xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black text-gray-900">QuickMart</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">أنشئ متجرك الآن</h1>
          <p className="text-gray-500">خطوات بسيطة للبدء بالبيع على منصة QuickMart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Benefits Sidebar */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#0F172A] to-slate-800 rounded-2xl p-5">
              <p className="text-white font-bold mb-4">مزايا البائعين</p>
              <div className="space-y-3">
                {BENEFITS.map(b => (
                  <div key={b.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <b.icon className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{b.label}</p>
                      <p className="text-white/40 text-xs">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm font-bold text-gray-700 mb-3">العمولة</p>
              <div className="text-center py-3">
                <p className="text-4xl font-black text-green-600">٨٪</p>
                <p className="text-xs text-gray-400 mt-1">فقط من كل طلب مكتمل</p>
              </div>
              <div className="mt-3 space-y-2">
                {['لا رسوم اشتراك شهرية', 'لا رسوم تسجيل', 'دفع مرن أسبوعياً'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-xs text-gray-600">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Progress bar */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-50">
              <div className="flex items-center gap-2 mb-4">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all
                      ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-[#0F172A] text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium truncate ${i === step ? 'text-gray-800' : 'text-gray-400'}`}>{s}</span>
                    {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 rounded ${i < step ? 'bg-green-400' : 'bg-gray-100'}`} />}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(d => mutation.mutateAsync(d))} className="p-6">
              {/* Step 0 — Basic Info */}
              {step === 0 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      <Store className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">معلومات المتجر</p>
                      <p className="text-xs text-gray-400">الاسم والتواصل</p>
                    </div>
                  </div>
                  <Field label="اسم المتجر" error={errors.name?.message} required>
                    <input placeholder="مثال: متجر النور للمواد الغذائية" className={inp(errors.name)} {...register('name')} />
                  </Field>
                  <Field label="رقم الجوال" error={errors.phone?.message} required>
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-mono select-none">+966</span>
                      <input placeholder="5XXXXXXXX" className={`${inp(errors.phone)} pr-14`} dir="ltr" {...register('phone')} />
                    </div>
                  </Field>
                  <Field label="رقم السجل التجاري" error={errors.cr_number?.message}>
                    <input placeholder="اختياري" className={inp(false)} {...register('cr_number')} />
                  </Field>
                </div>
              )}

              {/* Step 1 — Location */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">موقع المتجر</p>
                      <p className="text-xs text-gray-400">المدينة التي يعمل فيها متجرك</p>
                    </div>
                  </div>
                  <Field label="المدينة" error={errors.city?.message} required>
                    <select className={inp(errors.city)} {...register('city')}>
                      <option value="">— اختر المدينة —</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                </div>
              )}

              {/* Step 2 — Category & Description */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">نوع المتجر والوصف</p>
                      <p className="text-xs text-gray-400">ما الذي يبيعه متجرك؟</p>
                    </div>
                  </div>
                  <Field label="تصنيف المتجر" error={errors.category?.message} required>
                    <div className="grid grid-cols-3 gap-2">
                      {CATEGORIES.map(cat => {
                        const selected = watch('category') === cat.value
                        return (
                          <label key={cat.value}
                            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 cursor-pointer transition-all text-center
                              ${selected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input type="radio" value={cat.value} {...register('category')} className="sr-only" />
                            <span className="text-xl">{cat.emoji}</span>
                            <span className={`text-[10px] font-semibold leading-tight ${selected ? 'text-green-700' : 'text-gray-600'}`}>
                              {cat.label}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                    {errors.category && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span>⚠</span>{errors.category.message}</p>}
                  </Field>
                  <Field label="وصف المتجر" error={errors.description?.message} required>
                    <textarea rows={4} placeholder="اشرح ما يقدمه متجرك، المنتجات المتاحة، ساعات العمل..."
                      className={`${inp(errors.description)} resize-none`}
                      {...register('description')} />
                  </Field>
                </div>
              )}

              {/* Nav buttons */}
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-50">
                {step > 0 ? (
                  <button type="button" onClick={() => setStep(s => s - 1)}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <ChevronRight className="w-4 h-4" /> السابق
                  </button>
                ) : <div />}

                {step < STEPS.length - 1 ? (
                  <button type="button" onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#0F172A] hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors">
                    التالي <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                ) : (
                  <button type="submit" disabled={mutation.isPending}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#16A34A] hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 shadow-lg shadow-green-500/25">
                    {mutation.isPending
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري الإرسال...</>
                      : <><Check className="w-4 h-4" /> إرسال الطلب</>}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
