import { useQuery } from '@tanstack/react-query'
import { ShoppingBag } from 'lucide-react'
import { getRecentActivity } from '@/api/admin.api'
import { formatPrice } from '@/utils/formatPrice'
import { fromNow } from '@/utils/formatDate'

const STATUS_COLORS = {
  pending:          'bg-yellow-100 text-yellow-700',
  confirmed:        'bg-blue-100 text-blue-700',
  preparing:        'bg-blue-100 text-blue-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered:        'bg-green-100 text-green-700',
  cancelled:        'bg-red-100 text-red-700',
}
const STATUS_LABELS = {
  pending:          'قيد الانتظار',
  confirmed:        'مؤكد',
  preparing:        'جاري التحضير',
  out_for_delivery: 'في الطريق',
  delivered:        'مُسلَّم',
  cancelled:        'ملغي',
}

export default function ActivityFeed() {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['admin-activity'],
    queryFn:  () => getRecentActivity(8),
    refetchInterval: 30_000,
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-full">
      <h3 className="font-bold text-gray-800 mb-4">آخر النشاطات</h3>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <ShoppingBag className="w-10 h-10 text-gray-200 mb-2" />
          <p className="text-sm text-gray-400">لا توجد نشاطات بعد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map(a => (
            <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {a.profiles?.name ?? 'عميل'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {a.stores?.name} • {formatPrice(a.total)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[a.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {STATUS_LABELS[a.status] ?? a.status}
                </span>
                <span className="text-[10px] text-gray-400">{fromNow(a.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
