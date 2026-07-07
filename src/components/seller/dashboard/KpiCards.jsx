import { ShoppingBag, DollarSign, Star, TrendingUp } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'

const KPIS = [
  { label: 'إجمالي الطلبات', value: 0, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
  { label: 'الإيرادات', value: formatPrice(0), icon: DollarSign, color: 'bg-green-50 text-green-600' },
  { label: 'متوسط التقييم', value: '0.0', icon: Star, color: 'bg-yellow-50 text-yellow-600' },
  { label: 'نمو المبيعات', value: '0%', icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
]

export default function KpiCards() {
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
