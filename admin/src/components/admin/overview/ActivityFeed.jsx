import { formatDate } from '@/utils/formatDate'
import { ShoppingBag, UserPlus, Store, AlertTriangle, Star, CreditCard } from 'lucide-react'

const TYPE_ICONS = {
  order:    { Icon: ShoppingBag,   color: 'bg-green-50 text-green-600' },
  customer: { Icon: UserPlus,      color: 'bg-blue-50 text-blue-600' },
  seller:   { Icon: Store,         color: 'bg-admin/10 text-admin' },
  dispute:  { Icon: AlertTriangle, color: 'bg-red-50 text-red-500' },
  review:   { Icon: Star,          color: 'bg-yellow-50 text-yellow-600' },
  payment:  { Icon: CreditCard,    color: 'bg-purple-50 text-purple-600' },
}

function ActivitySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="w-8 h-8 bg-gray-100 rounded-lg shrink-0" />
          <div className="flex-1 space-y-1.5 pt-1">
            <div className="h-3.5 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ActivityFeed({ activities = [], isLoading }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">آخر الأنشطة</h3>

      {isLoading ? (
        <ActivitySkeleton />
      ) : !activities.length ? (
        <p className="text-gray-400 text-sm text-center py-8">لا توجد أنشطة حديثة</p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {activities.map((a, i) => {
            const cfg = TYPE_ICONS[a.type] ?? TYPE_ICONS.order
            const Icon = cfg.Icon
            return (
              <div key={i} className="flex gap-3 text-sm">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 leading-snug">{a.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(a.time)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
