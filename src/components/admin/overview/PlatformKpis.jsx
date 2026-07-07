import { Store, Users, ShoppingBag, DollarSign } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'

const KPIS = [
  { label: 'إجمالي البائعين', value: 0,             icon: Store,      color: 'text-admin bg-admin/10' },
  { label: 'إجمالي العملاء',  value: 0,             icon: Users,      color: 'text-blue-600 bg-blue-50' },
  { label: 'الطلبات اليوم',   value: 0,             icon: ShoppingBag,color: 'text-seller bg-seller/10' },
  { label: 'إيرادات المنصة',  value: formatPrice(0), icon: DollarSign, color: 'text-green-600 bg-green-50' },
]

export default function PlatformKpis() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {KPIS.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{label}</p>
        </div>
      ))}
    </div>
  )
}
