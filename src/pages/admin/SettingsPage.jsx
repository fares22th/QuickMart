import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { useForm } from 'react-hook-form'

export default function AdminSettingsPage() {
  const { register, handleSubmit } = useForm()

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">إعدادات المنصة</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-lg">الإعدادات العامة</h2>
        <form onSubmit={handleSubmit(d => console.log(d))} className="space-y-4">
          <Input label="اسم المنصة" {...register('platformName')} />
          <Input label="نسبة العمولة (%)" type="number" {...register('commissionRate')} />
          <Input label="الحد الأدنى للسحب" type="number" {...register('minWithdraw')} />
          <Button type="submit">حفظ الإعدادات</Button>
        </form>
      </div>
    </div>
  )
}
