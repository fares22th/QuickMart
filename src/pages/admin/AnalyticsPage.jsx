import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { TrendingUp, Users, Package, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { getOrdersTimeSeries, getCustomerGrowth, getOrdersByStatus, getTopStores } from '@/api/admin.api'
import { formatPrice } from '@/utils/formatPrice'

const PERIOD_OPTS = [
  { label: '٧ أيام',  value: 7  },
  { label: '٣٠ يوم',  value: 30 },
  { label: '٩٠ يوم',  value: 90 },
]

const STATUS_AR = {
  pending:    'معلق',
  confirmed:  'مؤكد',
  preparing:  'تجهيز',
  out_for_delivery: 'في الطريق',
  delivered:  'مُسلَّم',
  cancelled:  'ملغي',
}

const PIE_COLORS = ['#16A34A', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#EF4444']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-3 min-w-[140px]">
      <p className="text-xs text-gray-400 font-medium mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-600">{p.name}:</span>
          <span className="font-bold text-gray-800">
            {p.dataKey === 'revenue' ? formatPrice(p.value) : p.value.toLocaleString('ar-SA')}
          </span>
        </div>
      ))}
    </div>
  )
}

function MetricCard({ label, value, sub, icon: Icon, gradient, up }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient}`}>
          <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
        </div>
        {up !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {up ? '+' : '-'}12%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState(30)

  const { data: timeSeries = [], isLoading: tsLoading } = useQuery({
    queryKey: ['admin-timeseries', period],
    queryFn: () => getOrdersTimeSeries(period),
  })

  const { data: growth = [] } = useQuery({
    queryKey: ['admin-growth', period],
    queryFn: () => getCustomerGrowth(period),
  })

  const { data: byStatus = [] } = useQuery({
    queryKey: ['admin-by-status'],
    queryFn: getOrdersByStatus,
  })

  const { data: topStores = [] } = useQuery({
    queryKey: ['admin-top-stores'],
    queryFn: () => getTopStores(6),
  })

  const totalRevenue = timeSeries.reduce((s, d) => s + d.revenue, 0)
  const totalOrders  = timeSeries.reduce((s, d) => s + d.orders, 0)
  const totalGrowth  = growth.reduce((s, d) => s + d.count, 0)

  const formattedTS = timeSeries.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' }),
  }))

  const formattedGrowth = growth.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' }),
  }))

  const pieData = byStatus.map(d => ({
    name: STATUS_AR[d.status] ?? d.status,
    value: d.count,
  }))

  const maxRevenue = Math.max(...(topStores.map(s => s.revenue)), 1)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التحليلات المتقدمة</h1>
          <p className="text-sm text-gray-500 mt-0.5">نظرة شاملة على أداء المنصة</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          {PERIOD_OPTS.map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${period === p.value ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="إجمالي الإيرادات"   value={formatPrice(totalRevenue)} sub={`آخر ${period} يوم`} icon={DollarSign} gradient="bg-gradient-to-br from-green-500 to-emerald-600"  up={true} />
        <MetricCard label="إجمالي الطلبات"      value={totalOrders.toLocaleString('ar-SA')}                sub={`آخر ${period} يوم`} icon={Package}    gradient="bg-gradient-to-br from-blue-500 to-indigo-600"   up={true} />
        <MetricCard label="عملاء جدد"            value={totalGrowth.toLocaleString('ar-SA')}               sub={`آخر ${period} يوم`} icon={Users}      gradient="bg-gradient-to-br from-violet-500 to-purple-600" up={true} />
        <MetricCard label="معدل النمو الشهري"   value="٢٣٪"                                               sub="مقارنة بالشهر الماضي" icon={TrendingUp}  gradient="bg-gradient-to-br from-teal-500 to-green-600"    up={true} />
      </div>

      {/* Revenue + Orders Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-bold text-gray-900">الإيرادات والطلبات</p>
              <p className="text-xs text-gray-400 mt-0.5">مقارنة الإيرادات بعدد الطلبات اليومية</p>
            </div>
          </div>
          {tsLoading ? (
            <div className="h-56 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={formattedTS} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#16A34A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ord" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="الإيرادات" stroke="#16A34A" strokeWidth={2} fill="url(#rev)" dot={false} />
                <Area type="monotone" dataKey="orders"  name="الطلبات"   stroke="#6366F1" strokeWidth={2} fill="url(#ord)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status Pie */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-900 mb-1">توزيع حالات الطلبات</p>
          <p className="text-xs text-gray-400 mb-4">إجمالي الطلبات حسب الحالة</p>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [v.toLocaleString('ar-SA'), '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-gray-600">{d.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{d.value.toLocaleString('ar-SA')}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-300 text-sm">لا توجد بيانات</div>
          )}
        </div>
      </div>

      {/* Customer Growth + Top Stores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Customer Growth */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-900 mb-1">نمو العملاء</p>
          <p className="text-xs text-gray-400 mb-5">عدد العملاء الجدد يومياً</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={formattedGrowth} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="عملاء جدد" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Stores */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-900 mb-1">أفضل المتاجر</p>
          <p className="text-xs text-gray-400 mb-5">ترتيب المتاجر حسب الإيرادات</p>
          {topStores.length > 0 ? (
            <div className="space-y-3">
              {topStores.map((store, i) => (
                <div key={store.id} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-gray-400 text-center">{i + 1}</span>
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {store.logo_url
                      ? <img src={store.logo_url} alt="" className="w-full h-full object-cover" />
                      : <span className="text-xs font-bold text-slate-500">{store.name?.[0]}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-gray-800 truncate">{store.name ?? '—'}</p>
                      <p className="text-xs font-bold text-green-700 shrink-0 mr-2">{formatPrice(store.revenue)}</p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(store.revenue / maxRevenue) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-300 text-sm">لا توجد بيانات</div>
          )}
        </div>
      </div>
    </div>
  )
}
