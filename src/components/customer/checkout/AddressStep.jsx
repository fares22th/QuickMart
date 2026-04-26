import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin } from 'lucide-react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

const schema = z.object({
  city:     z.string().min(2, 'المدينة مطلوبة'),
  district: z.string().min(2, 'الحي مطلوب'),
  street:   z.string().optional(),
  details:  z.string().optional(),
})

export default function AddressStep({ onNext, defaultValues }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4 bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="font-bold text-lg flex items-center gap-2">
        <MapPin className="w-5 h-5 text-green-600" /> عنوان التوصيل
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="المدينة"
          placeholder="الرياض"
          error={errors.city?.message}
          {...register('city')}
        />
        <Input
          label="الحي"
          placeholder="حي النزهة"
          error={errors.district?.message}
          {...register('district')}
        />
      </div>

      <Input
        label="اسم الشارع"
        placeholder="شارع الأمير محمد"
        {...register('street')}
      />

      <Input
        label="تفاصيل إضافية"
        placeholder="رقم المبنى، الشقة..."
        {...register('details')}
      />

      <Button type="submit" className="w-full">
        التالي — طريقة الدفع
      </Button>
    </form>
  )
}
