import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

export default function RegisterStorePage() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    console.log('Register store:', data)
    navigate('/seller')
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">تسجيل متجر جديد</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="اسم المتجر" error={errors.name?.message} {...register('name', { required: 'مطلوب' })} />
          <Input label="رقم الجوال" error={errors.phone?.message} {...register('phone', { required: 'مطلوب' })} />
          <Input label="رقم السجل التجاري" {...register('crNumber')} />
          <Input label="المدينة" {...register('city')} />
          <textarea
            placeholder="وصف المتجر"
            {...register('description')}
            className="w-full border border-gray-200 rounded-xl p-3 focus:border-primary focus:outline-none resize-none h-28"
          />
          <Button type="submit" className="w-full">تسجيل المتجر</Button>
        </form>
      </div>
    </div>
  )
}
