import { useForm } from 'react-hook-form'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

export default function AddressStep({ onNext }) {
  const { register, handleSubmit, formState: { errors } } = useForm()

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4 bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="font-bold text-lg">عنوان التوصيل</h2>
      <Input label="المدينة" error={errors.city?.message} {...register('city', { required: 'مطلوب' })} />
      <Input label="الحي" error={errors.district?.message} {...register('district', { required: 'مطلوب' })} />
      <Input label="الشارع" {...register('street')} />
      <Input label="تفاصيل إضافية" {...register('details')} />
      <Button type="submit" className="w-full">التالي</Button>
    </form>
  )
}
