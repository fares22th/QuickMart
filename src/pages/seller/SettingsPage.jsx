import { useForm } from 'react-hook-form'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

export default function SellerSettingsPage() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data) => {
    console.log('Update store settings:', data)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">إعدادات المتجر</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-lg mb-4">معلومات المتجر</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="اسم المتجر" {...register('storeName')} />
          <Input label="رقم الجوال" {...register('phone')} />
          <Input label="البريد الإلكتروني" type="email" {...register('email')} />
          <textarea
            placeholder="وصف المتجر"
            {...register('description')}
            className="w-full border border-gray-200 rounded-xl p-3 focus:border-primary focus:outline-none resize-none h-28"
          />
          <Button type="submit">حفظ التغييرات</Button>
        </form>
      </div>
    </div>
  )
}
