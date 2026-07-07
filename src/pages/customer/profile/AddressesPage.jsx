import { Plus, MapPin } from 'lucide-react'
import Button from '@/components/common/Button'

export default function AddressesPage() {
  const addresses = []

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">عناويني</h1>
        <Button size="sm">
          <Plus className="w-4 h-4 ml-1" /> إضافة عنوان
        </Button>
      </div>
      {!addresses.length
        ? (
          <div className="text-center py-12 text-gray-400">
            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>لا توجد عناوين مضافة</p>
          </div>
        )
        : addresses.map(a => (
          <div key={a.id} className="bg-white rounded-2xl p-4 shadow-sm mb-3">
            <p className="font-bold">{a.label}</p>
            <p className="text-sm text-gray-500">{a.details}</p>
          </div>
        ))
      }
    </div>
  )
}
