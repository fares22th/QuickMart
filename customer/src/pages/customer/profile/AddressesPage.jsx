import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, MapPin, Trash2, Star, Home, Briefcase, Map } from 'lucide-react'
import { useAddressStore } from '@/store/useAddressStore'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Modal from '@/components/common/Modal'

const ADDRESS_TYPES = [
  { id: 'home',  label: 'المنزل', icon: Home },
  { id: 'work',  label: 'العمل',  icon: Briefcase },
  { id: 'other', label: 'أخرى',   icon: Map },
]

function AddressForm({ onSubmit, onClose }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { type: 'home' },
  })
  const selectedType = watch('type')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* نوع العنوان */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">نوع العنوان</label>
        <div className="grid grid-cols-3 gap-2">
          {ADDRESS_TYPES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setValue('type', id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-sm font-medium transition-colors
                ${selectedType === id ? 'border-primary bg-primary-light text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </div>

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
        label="تفاصيل إضافية"
        placeholder="رقم البناية، الدور، ملاحظات"
        {...register('details')}
      />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">إلغاء</Button>
        <Button type="submit" className="flex-1">حفظ العنوان</Button>
      </div>
    </form>
  )
}

export default function AddressesPage() {
  const { addresses, addAddress, removeAddress, setDefault } = useAddressStore()
  const [showModal, setShowModal] = useState(false)

  const handleAdd = (data) => {
    addAddress(data)
    setShowModal(false)
  }

  const typeLabel = (type) => ADDRESS_TYPES.find(t => t.id === type)?.label ?? 'عنوان'
  const TypeIcon = (type) => ADDRESS_TYPES.find(t => t.id === type)?.icon ?? MapPin

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">عناويني</h1>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 ml-1" /> إضافة عنوان
        </Button>
      </div>

      {!addresses.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <MapPin className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium mb-1">لا توجد عناوين مضافة</p>
          <p className="text-gray-400 text-sm mb-4">أضف عنوانك لتسريع عملية الطلب</p>
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 ml-1" /> إضافة عنوان
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map(addr => {
            const Icon = TypeIcon(addr.type)
            return (
              <div
                key={addr.id}
                className={`bg-white rounded-2xl p-4 shadow-sm border-2 transition-colors
                  ${addr.isDefault ? 'border-primary' : 'border-transparent'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                      ${addr.isDefault ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-800">{typeLabel(addr.type)}</p>
                        {addr.isDefault && (
                          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-white" /> افتراضي
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {[addr.city, addr.district, addr.street].filter(Boolean).join(' - ')}
                      </p>
                      {addr.details && (
                        <p className="text-xs text-gray-400 mt-0.5">{addr.details}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefault(addr.id)}
                        className="text-xs text-primary font-medium hover:underline"
                      >
                        تعيين افتراضي
                      </button>
                    )}
                    <button
                      onClick={() => removeAddress(addr.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal إضافة عنوان */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="إضافة عنوان جديد">
        <AddressForm onSubmit={handleAdd} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  )
}
