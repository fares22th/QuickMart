import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

const schema = z.object({
  code:      z.string().min(3, 'الكود يجب أن يكون 3 أحرف على الأقل').toUpperCase(),
  value:     z.coerce.number().positive('أدخل قيمة صحيحة'),
  type:      z.enum(['percent', 'fixed']),
  minOrder:  z.coerce.number().min(0).optional(),
  maxUses:   z.coerce.number().int().min(1).optional(),
  expiresAt: z.string().optional(),
})

export default function CouponForm({ onSubmit, isLoading, onCancel }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: 'percent' },
  })

  const type = watch('type')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
      <Input
        label="كود الكوبون *"
        placeholder="مثال: SUMMER20"
        error={errors.code?.message}
        {...register('code')}
        style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نوع الخصم *</label>
          <select
            {...register('type')}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-primary focus:outline-none bg-white"
          >
            <option value="percent">نسبة مئوية (%)</option>
            <option value="fixed">مبلغ ثابت (ر.س)</option>
          </select>
        </div>
        <Input
          label={type === 'percent' ? 'نسبة الخصم (%)' : 'مبلغ الخصم (ر.س)'}
          type="number"
          step={type === 'percent' ? '1' : '0.5'}
          max={type === 'percent' ? '100' : undefined}
          placeholder={type === 'percent' ? '10' : '20'}
          error={errors.value?.message}
          {...register('value')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="حد أدنى للطلب (ر.س)"
          type="number"
          step="0.5"
          placeholder="0 = بدون حد"
          error={errors.minOrder?.message}
          {...register('minOrder')}
        />
        <Input
          label="الحد الأقصى للاستخدام"
          type="number"
          placeholder="بدون حد"
          error={errors.maxUses?.message}
          {...register('maxUses')}
        />
      </div>

      <Input
        label="تاريخ الانتهاء"
        type="date"
        error={errors.expiresAt?.message}
        {...register('expiresAt')}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isLoading} className="flex-1">
          إنشاء الكوبون
        </Button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
          >
            إلغاء
          </button>
        )}
      </div>
    </form>
  )
}
