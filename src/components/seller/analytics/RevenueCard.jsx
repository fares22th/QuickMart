import { TrendingUp } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'

export default function RevenueCard({ total = 0, growth = 0 }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm col-span-full md:col-span-1">
      <p className="text-sm text-gray-500">إجمالي الإيرادات</p>
      <p className="text-3xl font-bold mt-1">{formatPrice(total)}</p>
      <div className={`flex items-center gap-1 mt-2 text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
        <TrendingUp className="w-4 h-4" />
        <span>{growth >= 0 ? '+' : ''}{growth}% مقارنة بالشهر الماضي</span>
      </div>
    </div>
  )
}
