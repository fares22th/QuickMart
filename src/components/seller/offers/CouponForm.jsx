import { useForm } from 'react-hook-form'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

export default function CouponForm({ onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    console.log('Create coupon:', data)
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="كود الكوبون" placeholder="SUMMER20" error={errors.code?.message} {...register('code', { required: 'مطلوب' })} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="قيمة الخصم" type="number" {...register('value', { required: 'مطلوب' })} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نوع الخصم</label>
          <select {...register('type')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-primary focus:outline-none">
            <option value="percent">نسبة مئوية (%)</option>
            <option value="fixed">مبلغ ثابت (ر.س)</option>
          </select>
        </div>
      </div>
      <Input label="تاريخ الانتهاء" type="date" {...register('expiresAt')} />
      <Button type="submit" className="w-full">إنشاء الكوبون</Button>
    </form>
  )
}
