import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown, Users, Store, Package, DollarSign, Clock, AlertCircle, UserPlus, BarChart3 } from 'lucide-react'
import { getPlatformStats } from '@/api/admin.api'
import { formatPrice } from '@/utils/formatPrice'

function KpiCard({ label, value, sub, icon: Icon, gradient, trend, alert }) {
  const up = trend >= 0
  return (
    <div className={`relative bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${alert ? 'border-red-200 ring-1 ring-red-200' : 'border-gray-100'}`}>
      {/* Background decoration */}
      <div className={`absolute -left-4 -top-4 w-24 h-24 rounded-full opacity-[0.06] ${gradient}`} />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient}`}>
            <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(trend)}%
            </div>
          )}
          {alert && (
            <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-red-50 text-red-600">
              <AlertCircle className="w-3 h-3" />
              يحتاج مراجعة
            </div>
          )}
        </div>

        <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
        <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="w-10 h-10 bg-gray-100 rounded-xl" />
        <div className="w-14 h-6 bg-gray-100 rounded-full" />
      </div>
      <div className="h-7 bg-gray-100 rounded-lg w-24 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-32" />
    </div>
  )
}

export default function PlatformKpis() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getPlatformStats,
    refetchInterval: 60_000,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  const cards = [
    {
      label: 'إجمالي الإيرادات',
      value: formatPrice(stats?.totalRevenue ?? 0),
      sub: 'من الطلبات المكتملة',
      icon: DollarSign,
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-600',
      trend: 15,
    },
    {
      label: 'إجمالي الطلبات',
      value: (stats?.totalOrders ?? 0).toLocaleString('ar-SA'),
      sub: `${stats?.todayOrders ?? 0} طلب اليوم`,
      icon: Package,
      gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      trend: 8,
    },
    {
      label: 'إجمالي العملاء',
      value: (stats?.customers ?? 0).toLocaleString('ar-SA'),
      sub: `+${stats?.newCustomers ?? 0} هذا الأسبوع`,
      icon: Users,
      gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
      trend: 12,
    },
    {
      label: 'البائعون النشطون',
      value: (stats?.sellers ?? 0).toLocaleString('ar-SA'),
      sub: stats?.pendingStores ? `${stats.pendingStores} ينتظر الموافقة` : 'جميعهم نشطون',
      icon: Store,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
      alert: (stats?.pendingStores ?? 0) > 0,
    },
    {
      label: 'طلبات اليوم',
      value: (stats?.todayOrders ?? 0).toLocaleString('ar-SA'),
      sub: 'مقارنة بالأمس',
      icon: Clock,
      gradient: 'bg-gradient-to-br from-cyan-500 to-sky-600',
      trend: 3,
    },
    {
      label: 'عملاء جدد (أسبوع)',
      value: (stats?.newCustomers ?? 0).toLocaleString('ar-SA'),
      sub: 'مقارنة بالأسبوع الماضي',
      icon: UserPlus,
      gradient: 'bg-gradient-to-br from-pink-500 to-rose-600',
      trend: 22,
    },
    {
      label: 'متاجر تنتظر الموافقة',
      value: (stats?.pendingStores ?? 0).toLocaleString('ar-SA'),
      sub: 'بحاجة إلى مراجعة',
      icon: AlertCircle,
      gradient: (stats?.pendingStores ?? 0) > 0
        ? 'bg-gradient-to-br from-red-500 to-rose-600'
        : 'bg-gradient-to-br from-gray-400 to-gray-500',
      alert: (stats?.pendingStores ?? 0) > 0,
    },
    {
      label: 'معدل النمو الشهري',
      value: '٢٣٪',
      sub: 'مقارنة بالشهر الماضي',
      icon: BarChart3,
      gradient: 'bg-gradient-to-br from-teal-500 to-green-600',
      trend: 23,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(c => <KpiCard key={c.label} {...c} />)}
    </div>
  )
}
