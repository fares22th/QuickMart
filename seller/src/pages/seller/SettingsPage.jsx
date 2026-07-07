import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getMyStore, updateMyStore } from '@/api/seller.api'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import Spinner from '@/components/common/Spinner'

const schema = z.object({
  storeName:   z.string().min(2, 'اسم المتجر مطلوب'),
  phone:       z.string().min(9, 'رقم الجوال غير صحيح'),
  email:       z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  description: z.string().optional(),
  city:        z.string().optional(),
  address:     z.string().optional(),
  category:    z.string().optional(),
  deliveryTime: z.string().optional(),
  minOrder:    z.coerce.number().min(0).optional(),
})

const STORE_CATEGORIES = [
  'فواكه وخضروات',
  'لحوم ودواجن',
  'ألبان وأجبان',
  'مخبوزات وحلويات',
  'مشروبات',
  'عناية شخصية',
  'إلكترونيات',
  'ملابس وأزياء',
  'منزل ومطبخ',
  'متجر متنوع',
]

export default function SellerSettingsPage() {
  const qc = useQueryClient()

  const { data: store, isLoading } = useQuery({
    queryKey: ['seller-store'],
    queryFn:  getMyStore,
  })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (store) reset(store)
  }, [store, reset])

  const mut = useMutation({
    mutationFn: updateMyStore,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seller-store'] })
      toast.success('تم حفظ إعدادات المتجر')
    },
    onError: () => toast.error('تعذّر حفظ الإعدادات'),
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-48">
      <Spinner />
    </div>
  )

  return (
    <div className="max-w-2xl space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900">إعدادات المتجر</h1>

      <form onSubmit={handleSubmit(data => mut.mutate(data))} className="space-y-5">

        {/* Basic info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-800">معلومات المتجر</h2>

          <Input
            label="اسم المتجر *"
            placeholder="اسم متجرك"
            error={errors.storeName?.message}
            {...register('storeName')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">فئة المتجر</label>
            <select
              {...register('category')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-primary focus:outline-none bg-white"
            >
              <option value="">— اختر فئة —</option>
              {STORE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">وصف المتجر</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="وصف قصير عن متجرك ومنتجاتك..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-primary focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-800">بيانات التواصل</h2>

          <Input
            label="رقم الجوال *"
            placeholder="+966 5X XXX XXXX"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="store@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="المدينة"
            placeholder="الرياض"
            {...register('city')}
          />
          <Input
            label="العنوان التفصيلي"
            placeholder="الحي، الشارع..."
            {...register('address')}
          />
        </div>

        {/* Delivery settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-800">إعدادات التوصيل</h2>

          <Input
            label="وقت التوصيل المتوقع"
            placeholder="مثال: 30-60 دقيقة"
            {...register('deliveryTime')}
          />
          <Input
            label="الحد الأدنى للطلب (ر.س)"
            type="number"
            step="0.5"
            placeholder="0"
            error={errors.minOrder?.message}
            {...register('minOrder')}
          />
        </div>

        <Button
          type="submit"
          loading={mut.isPending || isSubmitting}
          disabled={!isDirty && !mut.isPending}
          className="w-full"
        >
          حفظ التغييرات
        </Button>
      </form>
    </div>
  )
}
