import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { MapPin, ChevronRight, Home, Briefcase, Navigation, ArrowLeft } from 'lucide-react'
import Input from '@/components/common/Input'
import { useAddressStore } from '@/store/useAddressStore'

const TYPE_ICONS = { home: Home, work: Briefcase, other: Navigation }

export default function AddressStep({ onNext, defaultValues }) {
  const savedAddresses = useAddressStore(s => s.addresses)
  const defaultAddr    = useAddressStore(s => s.getDefault())

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: defaultValues ?? (defaultAddr
      ? { city: defaultAddr.city, district: defaultAddr.district, street: defaultAddr.street, details: defaultAddr.details }
      : {}
    ),
  })

  const fillFromSaved = (addr) => {
    setValue('city',     addr.city     ?? '', { shouldDirty: true })
    setValue('district', addr.district ?? '', { shouldDirty: true })
    setValue('street',   addr.street   ?? '', { shouldDirty: true })
    setValue('details',  addr.details  ?? '', { shouldDirty: true })
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4 bg-white rounded-2xl p-6 shadow-sm">

      <h2 className="font-extrabold text-lg flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #00C896, #00A878)' }}>
          <MapPin className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
        </div>
        عنوان التوصيل
      </h2>

      {/* Saved addresses quick-fill */}
      {savedAddresses.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2 font-semibold">عناوينك المحفوظة:</p>
          <div className="flex flex-wrap gap-2">
            {savedAddresses.map(addr => {
              const Icon = TYPE_ICONS[addr.type] ?? Navigation
              return (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => fillFromSaved(addr)}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-gray-200 hover:border-green-400 hover:text-green-600 transition-all bg-gray-50 hover:bg-green-50 font-medium"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {addr.city} - {addr.district}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <Input
        label="المدينة"
        placeholder="الرياض"
        error={errors.city?.message}
        {...register('city', { required: 'المدينة مطلوبة' })}
      />
      <Input
        label="الحي"
        placeholder="حي النزهة"
        error={errors.district?.message}
        {...register('district', { required: 'الحي مطلوب' })}
      />
      <Input
        label="الشارع"
        placeholder="شارع الملك فهد"
        {...register('street')}
      />
      <Input
        label="تفاصيل إضافية (اختياري)"
        placeholder="رقم البناية، الدور، ملاحظات للسائق"
        {...register('details')}
      />

      <div className="flex gap-3 pt-2">
        {/* Back to cart */}
        <Link
          to="/cart"
          className="flex items-center justify-center gap-1.5 px-4 py-4 rounded-2xl text-sm font-bold border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
          السلة
        </Link>

        {/* Next — prominent */}
        <button
          type="submit"
          className="flex-1 py-4 rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.97] hover:opacity-95"
          style={{
            background: 'linear-gradient(135deg, #00C896 0%, #059669 100%)',
            boxShadow: '0 8px 28px rgba(0,200,150,0.5)',
          }}
        >
          التالي — اختر طريقة الدفع
          <ArrowLeft className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </form>
  )
}
