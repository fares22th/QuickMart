import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts'
import {
  AlertCircle, ChevronLeft, TrendingUp, ArrowUpRight,
  Store, Package, RefreshCw, Flame, CheckCircle, Clock, XCircle,
} from 'lucide-react'
import PlatformKpis from '@/components/admin/overview/PlatformKpis'
import { getPlatformStats, getAllStores, getAllOrders, getOrdersTimeSeries, getOrdersByStatus, getTopStores } from '@/api/admin.api'
import { formatPrice } from '@/utils/formatPrice'
import { formatDate } from '@/utils/formatDate'

const STATUS_META = {
  pending:          { label: 'انتظار',       color: 'bg-yellow-100 text-yellow-700',  dot: '#EAB308' },
  confirmed:        { label: 'مؤكد',         color: 'bg-blue-100 text-blue-700',      dot: '#3B82F6' },
  preparing:        { label: 'تحضير',        color: 'bg-indigo-100 text-indigo-700',  dot: '#6366F1' },
  out_for_delivery: { label: 'في الطريق',    color: 'bg-purple-100 text-purple-700',  dot: '#A855F7' },
  delivered:        { label: 'مُسلَّم',      color: 'bg-green-100 text-green-700',    dot: '#22C55E' },
  cancelled:        { label: 'ملغي',         color: 'bg-red-100 text-red-700',        dot: '#EF4444' },
}

const PIE_COLORS = ['#EAB308','#3B82F6','#6366F1','#A855F7','#22C55E','#EF4444']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          {p.name}: <span className="font-bold">{p.name === 'revenue' ? formatPrice(p.value) : p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function AdminOverviewPage() {
  const [period, setPeriod] = useState(30)

  const { data: stats }               = useQuery({ queryKey: ['admin-stats'],              queryFn: getPlatformStats })
  const { data: pendingStores = [] }  = useQuery({ queryKey: ['stores','pending'],         queryFn: () => getAllStores({ status: 'pending', limit: 5 }) })
  const { data: recentOrders  = [] }  = useQuery({ queryKey: ['admin-orders','recent'],    queryFn: () => getAllOrders({ limit: 8 }) })
  const { data: timeSeries    = [] }  = useQuery({ queryKey: ['timeseries', period],       queryFn: () => getOrdersTimeSeries(period), refetchInterval: 120_000 })
  const { data: statusData    = [] }  = useQuery({ queryKey: ['orders-by-status'],         queryFn: getOrdersByStatus })
  const { data: topStores     = [] }  = useQuery({ queryKey: ['top-stores'],               queryFn: () => getTopStores(5) })

  const chartData = timeSeries.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }),
  }))

  const pieData = statusData.map(s => ({
    name: STATUS_META[s.status]?.label ?? s.status,
    value: s.count,
  }))

  const maxRevenue = topStores[0]?.revenue ?? 1

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-sm text-gray-500 mt-0.5">نظرة شاملة على أداء المنصة</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-green-700">مباشر</span>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            تحديث
          </button>
        </div>
      </div>

      {/* KPIs */}
      <PlatformKpis />

      {/* Pending stores alert */}
      {pendingStores.length > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">
              {pendingStores.length} متجر ينتظر مراجعتك
            </p>
            <p className="text-xs text-amber-600 mt-0.5">راجع طلبات التسجيل الجديدة وافصل في الموافقة أو الرفض</p>
          </div>
          <Link to="/admin/sellers"
            className="flex items-center gap-1 text-sm font-bold text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-colors">
            مراجعة <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue area chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900">الإيرادات والطلبات</h3>
              <p className="text-xs text-gray-400 mt-0.5">آخر {period} يوم</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              {[7, 30, 90].map(d => (
                <button
                  key={d}
                  onClick={() => setPeriod(d)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${period === d ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {d}د
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#16A34A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#16A34A" strokeWidth={2} fill="url(#gRevenue)" dot={false} />
              <Area type="monotone" dataKey="orders"  name="orders"  stroke="#6366F1" strokeWidth={2} fill="url(#gOrders)"  dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-3 justify-center">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-0.5 bg-green-600 rounded-full inline-block" />
              الإيرادات
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-0.5 bg-indigo-500 rounded-full inline-block" />
              الطلبات
            </div>
          </div>
        </div>

        {/* Status donut */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="font-bold text-gray-900">توزيع الطلبات</h3>
            <p className="text-xs text-gray-400 mt-0.5">حسب الحالة</p>
          </div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [v, 'طلب']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-3">
                {pieData.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-bold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">لا توجد بيانات</div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <div>
              <h3 className="font-bold text-gray-900">آخر الطلبات</h3>
              <p className="text-xs text-gray-400 mt-0.5">أحدث طلبات المنصة</p>
            </div>
            <Link to="/admin/orders" className="flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 bg-green-50 px-3 py-1.5 rounded-xl transition-colors">
              عرض الكل <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 bg-gray-50/50">
                  {['الطلب', 'العميل', 'المتجر', 'المبلغ', 'الحالة', 'التاريخ'].map(h => (
                    <th key={h} className="text-right px-5 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map(o => {
                  const meta = STATUS_META[o.status] ?? { label: o.status, color: 'bg-gray-100 text-gray-600' }
                  return (
                    <tr key={o.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5 text-gray-400 text-xs font-mono">#{o.id.slice(-6).toUpperCase()}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {(o.customer_profiles?.name ?? 'ع')[0]}
                          </div>
                          <span className="font-medium text-gray-800 text-xs">{o.customer_profiles?.name ?? '—'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs">{o.seller_stores?.name ?? '—'}</td>
                      <td className="px-5 py-3.5 font-bold text-gray-900 text-xs">{formatPrice(o.total)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.color}`}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.dot }} />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate(o.created_at)}</td>
                    </tr>
                  )
                })}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">
                      لا توجد طلبات بعد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top stores */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900">أفضل المتاجر</h3>
              <p className="text-xs text-gray-400 mt-0.5">حسب الإيرادات</p>
            </div>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="space-y-4">
            {topStores.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">لا توجد بيانات</p>
            )}
            {topStores.map((store, i) => (
              <div key={store.id} className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                  i === 0 ? 'bg-yellow-100 text-yellow-700' :
                  i === 1 ? 'bg-gray-100 text-gray-500' :
                  i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-400'
                }`}>
                  {i + 1}
                </span>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shrink-0">
                  {store.logo_url
                    ? <img src={store.logo_url} alt="" className="w-full h-full object-cover rounded-xl" />
                    : <Store className="w-4 h-4 text-white" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{store.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700"
                        style={{ width: `${Math.round((store.revenue / maxRevenue) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-800 shrink-0">{formatPrice(store.revenue)}</p>
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div className="mt-5 pt-4 border-t border-gray-50 grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-green-700">{formatPrice(stats?.totalRevenue ?? 0)}</p>
              <p className="text-[10px] text-green-600 font-medium mt-0.5">إجمالي الإيرادات</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-blue-700">{(stats?.totalOrders ?? 0).toLocaleString('ar-SA')}</p>
              <p className="text-[10px] text-blue-600 font-medium mt-0.5">إجمالي الطلبات</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
