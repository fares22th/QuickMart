import { Store, Users, ShoppingBag, DollarSign, TrendingUp, Truck, AlertTriangle, Star } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'

const CONFIGS = [
  {
    key: 'totalSellers',
    label: 'إجمالي البائعين',
    icon: Store,
    gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    glow: 'rgba(99,102,241,0.25)',
    fmt: v => v ?? 0,
  },
  {
    key: 'totalCustomers',
    label: 'إجمالي العملاء',
    icon: Users,
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    glow: 'rgba(59,130,246,0.25)',
    fmt: v => v ?? 0,
  },
  {
    key: 'todayOrders',
    label: 'الطلبات اليوم',
    icon: ShoppingBag,
    gradient: 'linear-gradient(135deg, #00C896 0%, #00A878 100%)',
    glow: 'rgba(0,200,150,0.25)',
    fmt: v => v ?? 0,
  },
  {
    key: 'monthRevenue',
    label: 'إيرادات الشهر',
    icon: DollarSign,
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    glow: 'rgba(245,158,11,0.25)',
    fmt: v => formatPrice(v ?? 0),
  },
  {
    key: 'pendingSellers',
    label: 'بائعون قيد الموافقة',
    icon: TrendingUp,
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
    glow: 'rgba(167,139,250,0.25)',
    fmt: v => v ?? 0,
  },
  {
    key: 'activeDrivers',
    label: 'مندوبون نشطون',
    icon: Truck,
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    glow: 'rgba(6,182,212,0.25)',
    fmt: v => v ?? 0,
  },
  {
    key: 'openDisputes',
    label: 'نزاعات مفتوحة',
    icon: AlertTriangle,
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    glow: 'rgba(239,68,68,0.25)',
    fmt: v => v ?? 0,
    urgent: true,
  },
  {
    key: 'avgRating',
    label: 'متوسط التقييم',
    icon: Star,
    gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    glow: 'rgba(236,72,153,0.25)',
    fmt: v => `${(v ?? 0).toFixed(1)} ★`,
  },
]

function Skeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="w-11 h-11 bg-gray-100 rounded-xl mb-4" />
      <div className="h-7 bg-gray-100 rounded w-20 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-28" />
    </div>
  )
}

export default function PlatformKpis({ stats, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CONFIGS.map(({ key, label, icon: Icon, gradient, glow, fmt, urgent }) => {
        const value = fmt(stats?.[key])
        const trend = stats?.trends?.[key]
        const isPositive = trend == null || trend >= 0

        return (
          <div
            key={key}
            className="relative bg-white rounded-2xl p-5 shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            style={urgent && stats?.[key] > 0 ? { boxShadow: `0 0 0 2px rgba(239,68,68,0.3)` } : {}}
          >
            {/* Hover glow */}
            <div
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)` }}
            />

            {/* Icon */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow-md"
              style={{ background: gradient, boxShadow: `0 4px 12px ${glow}` }}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>

            {/* Value */}
            <p className="text-2xl font-extrabold text-gray-900 leading-none mb-1.5">{value}</p>
            <p className="text-xs font-medium text-gray-500">{label}</p>

            {/* Trend */}
            {trend != null && (
              <div className={`flex items-center gap-1 mt-2.5 text-xs font-bold rounded-lg px-2 py-1 w-fit
                ${isPositive ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                {isPositive ? '▲' : '▼'} {Math.abs(trend)}%
              </div>
            )}

            {/* Bottom accent */}
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: gradient }}
            />

            {/* Urgent pulse for disputes */}
            {urgent && stats?.[key] > 0 && (
              <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-red-500 animate-ping opacity-75" />
            )}
          </div>
        )
      })}
    </div>
  )
}
