import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getPlatformSettings, updatePlatformSettings } from '@/api/admin.api'
import Spinner from '@/components/common/Spinner'

const schema = z.object({
  platformName:      z.string().min(2),
  commissionRate:    z.coerce.number().min(0).max(100),
  minWithdraw:       z.coerce.number().min(0),
  deliveryFee:       z.coerce.number().min(0),
  supportPhone:      z.string().optional(),
  supportEmail:      z.string().email().optional().or(z.literal('')),
  maintenanceMode:   z.boolean().optional(),
  allowNewSellers:   z.boolean().optional(),
  requireOtp:        z.boolean().optional(),
})

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="font-bold text-gray-800 text-lg border-b pb-3">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm text-gray-600 flex-1">{label}</label>
      <div className="flex-1 max-w-xs">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-admin' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function AdminSettingsPage() {
  const qc = useQueryClient()

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn:  getPlatformSettings,
  })

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (settings) reset(settings)
  }, [settings, reset])

  const mut = useMutation({
    mutationFn: updatePlatformSettings,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-settings'] }); toast.success('تم حفظ الإعدادات') },
    onError: () => toast.error('تعذّر حفظ الإعدادات'),
  })

  if (isLoading) return <div className="flex items-center justify-center h-48"><Spinner /></div>

  return (
    <div className="max-w-2xl space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900">إعدادات المنصة</h1>

      <form onSubmit={handleSubmit(data => mut.mutate(data))} className="space-y-5">

        <Section title="الإعدادات العامة">
          <Field label="اسم المنصة">
            <input {...register('platformName')} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-admin focus:outline-none" />
          </Field>
          <Field label="نسبة العمولة (%)">
            <input type="number" step="0.1" min="0" max="100" {...register('commissionRate')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-admin focus:outline-none" />
          </Field>
          <Field label="الحد الأدنى للسحب (ر.س)">
            <input type="number" step="0.5" {...register('minWithdraw')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-admin focus:outline-none" />
          </Field>
          <Field label="رسوم التوصيل الافتراضية (ر.س)">
            <input type="number" step="0.5" {...register('deliveryFee')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-admin focus:outline-none" />
          </Field>
        </Section>

        <Section title="بيانات الدعم">
          <Field label="رقم جوال الدعم">
            <input {...register('supportPhone')} placeholder="+966 5X XXX XXXX"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-admin focus:outline-none" />
          </Field>
          <Field label="بريد الدعم الإلكتروني">
            <input type="email" {...register('supportEmail')} placeholder="support@quickmart.sa"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-admin focus:outline-none" />
          </Field>
        </Section>

        <Section title="خيارات النظام">
          <Field label="وضع الصيانة">
            <Toggle value={watch('maintenanceMode')} onChange={v => setValue('maintenanceMode', v, { shouldDirty: true })} />
          </Field>
          <Field label="السماح بتسجيل بائعين جدد">
            <Toggle value={watch('allowNewSellers')} onChange={v => setValue('allowNewSellers', v, { shouldDirty: true })} />
          </Field>
          <Field label="إلزامية OTP عند تسجيل الدخول">
            <Toggle value={watch('requireOtp')} onChange={v => setValue('requireOtp', v, { shouldDirty: true })} />
          </Field>
        </Section>

        <button
          type="submit"
          disabled={(!isDirty && !mut.isPending) || mut.isPending}
          className="w-full py-4 text-white rounded-xl font-extrabold text-base disabled:opacity-50 transition-all active:scale-98"
          style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', boxShadow: '0 10px 30px rgba(99,102,241,0.5)' }}
        >
          {mut.isPending ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </form>
    </div>
  )
}
