import { ShoppingBag, DollarSign, Star, Package, Clock, CheckCircle, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'

const CARDS = [
  {
    key: 'revenue',
    label: 'الإيرادات الإجمالية',
    icon: DollarSign,
    fmt: v => formatPrice(v ?? 0),
    gradient: 'linear-gradient(135deg, #00C896 0%, #00A878 100%)',
    glow: 'rgba(0,200,150,0.25)',
    light: 'rgba(0,200,150,0.1)',
    textAccent: '#00C896',
  },
  {
    key: 'totalOrders',
    label: 'إجمالي الطلبات',
    icon: ShoppingBag,
    fmt: v => v ?? 0,
    gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    glow: 'rgba(99,102,241,0.25)',
    light: 'rgba(99,102,241,0.1)',
    textAccent: '#6366F1',
  },
  {
    key: 'totalProducts',
    label: 'المنتجات النشطة',
    icon: Package,
    fmt: v => v ?? 0,
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    glow: 'rgba(245,158,11,0.25)',
    light: 'rgba(245,158,11,0.1)',
    textAccent: '#F59E0B',
  },
  {
    key: 'avgRating',
    label: 'متوسط التقييم',
    icon: Star,
    fmt: v => `${(v ?? 0).toFixed(1)} ★`,
    gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    glow: 'rgba(236,72,153,0.25)',
    light: 'rgba(236,72,153,0.1)',
    textAccent: '#EC4899',
  },
]

const MINI = [
  { key: 'pendingOrders',   label: 'قيد الانتظار',  icon: Clock,        color: '#F59E0B', bg: '#FFFBEB' },
  { key: 'deliveredOrders', label: 'تم التوصيل',    icon: CheckCircle,  color: '#10B981', bg: '#F0FDF4' },
  { key: 'totalCustomers',  label: 'العملاء',        icon: Users,        color: '#6366F1', bg: '#EEF2FF' },
  { key: 'growth',          label: 'نمو المبيعات',  icon: TrendingUp,   color: '#00C896', bg: '#E6FAF5', fmt: v => `${v ?? 0}%` },
]

function KpiSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-xl" />
        <div className="w-16 h-6 bg-gray-100 rounded-lg" />
      </div>
      <div className="h-8 bg-gray-100 rounded w-24 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-32" />
    </div>
  )
}

export default function KpiCards({ stats, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0,1,2,3].map(i => <KpiSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map(({ key, label, icon: Icon, fmt, gradient, glow, light, textAccent }) => {
          const value = fmt(stats?.[key])
          const trend = stats?.trends?.[key]
          const isPositive = trend == null || trend >= 0

          return (
            <div
              key={key}
              className="relative bg-white rounded-2xl p-5 shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Background glow */}
              <div
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)` }}
              />

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm"
                style={{ background: gradient, boxShadow: `0 4px 14px ${glow}` }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Value */}
              <p className="text-2xl font-extrabold text-gray-900 leading-none mb-1.5">{value}</p>
              <p className="text-xs font-medium text-gray-500">{label}</p>

              {/* Trend */}
              {trend != null && (
                <div className={`flex items-center gap-1 mt-2.5 text-xs font-bold rounded-lg px-2 py-1 w-fit
                  ${isPositive ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                  {isPositive
                    ? <ArrowUpRight className="w-3 h-3" />
                    : <ArrowDownRight className="w-3 h-3" />
                  }
                  {Math.abs(trend)}% هذا الشهر
                </div>
              )}

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: gradient }}
              />
            </div>
          )
        })}
      </div>

      {/* Mini stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {MINI.map(({ key, label, icon: Icon, color, bg, fmt }) => (
          <div
            key={key}
            className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition-all duration-200"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: bg }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-gray-900 leading-none">
                {fmt ? fmt(stats?.[key]) : (stats?.[key] ?? 0)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
