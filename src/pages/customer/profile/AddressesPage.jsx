import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Plus, MapPin, Trash2, Star, X } from 'lucide-react'
import { getAddresses, addAddress, deleteAddress } from '@/api/users.api'
import Spinner from '@/components/common/Spinner'
import Button from '@/components/common/Button'

const schema = z.object({
  label:      z.string().min(1, 'الاسم مطلوب').max(30),
  city:       z.string().min(2, 'المدينة مطلوبة'),
  district:   z.string().min(2, 'الحي مطلوب'),
  street:     z.string().optional(),
  details:    z.string().optional(),
  is_default: z.boolean().optional(),
})

function AddressForm({ onClose }) {
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const { mutate, isPending } = useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      toast.success('تم إضافة العنوان')
      qc.invalidateQueries({ queryKey: ['addresses'] })
      onClose()
    },
    onError: () => toast.error('تعذّر إضافة العنوان'),
  })

  const onSubmit = (data) => mutate({ ...data, is_default: !!data.is_default })

  const fieldCls = (err) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
      err ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-green-500 focus:ring-green-500/15'
    }`

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">إضافة عنوان جديد</h3>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">اسم العنوان (مثال: المنزل)</label>
            <input {...register('label')} placeholder="المنزل" className={fieldCls(errors.label)} />
            {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">المدينة</label>
              <input {...register('city')} placeholder="الرياض" className={fieldCls(errors.city)} />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">الحي</label>
              <input {...register('district')} placeholder="النزهة" className={fieldCls(errors.district)} />
              {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">الشارع</label>
            <input {...register('street')} placeholder="شارع الأمير محمد" className={fieldCls()} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">تفاصيل إضافية</label>
            <input {...register('details')} placeholder="رقم المبنى، الشقة..." className={fieldCls()} />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" {...register('is_default')} className="w-4 h-4 accent-green-600" />
            <span className="text-sm text-gray-600">تعيين كعنوان افتراضي</span>
          </label>

          <Button type="submit" className="w-full" loading={isPending} disabled={isPending}>
            حفظ العنوان
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function AddressesPage() {
  const [showForm, setShowForm] = useState(false)
  const qc = useQueryClient()

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn:  getAddresses,
  })

  const { mutate: doDelete } = useMutation({
    mutationFn: deleteAddress,
    onSuccess:  () => {
      toast.success('تم حذف العنوان')
      qc.invalidateQueries({ queryKey: ['addresses'] })
    },
    onError: () => toast.error('تعذّر حذف العنوان'),
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">عناويني</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" /> إضافة عنوان
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse h-24" />
          ))}
        </div>
      ) : !addresses.length ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <MapPin className="w-14 h-14 mx-auto mb-4 text-gray-200" />
          <p className="font-semibold text-gray-700 mb-1">لا توجد عناوين بعد</p>
          <p className="text-gray-400 text-sm">أضف عنواناً لتسريع عملية الطلب</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition-colors"
          >
            إضافة أول عنوان
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map(addr => (
            <div key={addr.id} className={`bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3 border-2 transition-colors ${addr.is_default ? 'border-green-200' : 'border-transparent'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${addr.is_default ? 'bg-green-100' : 'bg-gray-100'}`}>
                <MapPin className={`w-5 h-5 ${addr.is_default ? 'text-green-600' : 'text-gray-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold">{addr.label}</p>
                  {addr.is_default && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-green-500" /> افتراضي
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {[addr.city, addr.district, addr.street, addr.details].filter(Boolean).join(' — ')}
                </p>
              </div>
              <button
                onClick={() => doDelete(addr.id)}
                className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl flex items-center justify-center transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && <AddressForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
