import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/store/useAuthStore'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

export default function ProfileSettingsPage() {
  const { user } = useAuthStore()
  const { register, handleSubmit } = useForm({ defaultValues: { name: user?.name, phone: user?.phone } })

  const onSubmit = (data) => {
    console.log('Update profile:', data)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-lg mb-4">تعديل البيانات الشخصية</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="الاسم" {...register('name')} />
          <Input label="رقم الهاتف" {...register('phone')} />
          <Button type="submit" className="w-full">حفظ التغييرات</Button>
        </form>
      </div>
    </div>
  )
}
