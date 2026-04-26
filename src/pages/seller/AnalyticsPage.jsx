import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import {
  DollarSign, ShoppingBag, Users, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Star, Package, BarChart3,
} from 'lucide-react'
import { getMyStore } from '@/api/stores.api'
import { getSellerTimeSeries } from '@/api/seller.api'
import { formatPrice } from '@/utils/formatPrice'

const PERIOD_OPTS = [
  { label: '٧ أيام',  value: 7  },
  { label: '٣٠ يوم',  value: 30 },
  { label: '٩٠ يوم',  value: 90 },
]

const MOCK_HOURS = [
  { hour: '٦ص',  orders: 2  }, { hour: '٨ص',  orders: 8  }, { hour: '١٠ص', orders: 18 },
  { hour: '١٢ظ', orders: 35 }, { hour: '٢م',  orders: 28 }, { hour: '٤م',  orders: 42 },
  { hour: '٦م',  orders: 52 }, { hour: '٨م',  orders: 38 }, { hour: '١٠م', orders: 20 },
  { hour: '١٢م', orders: 10 },
]

const MOCK_TOP = [
  { name: 'عصير برتقال طازج',  sales: 148, revenue: 2960  },
  { name: 'سلطة فواكه مشكلة',  sales: 92,  revenue: 1840  },
  { name: 'خبز عربي أصيل',     sales: 216, revenue: 1080  },
  { name: 'لبن كامل الدسم',    sales: 184, revenue: 920   },
  { name: 'تفاح أحمر طازج',    sales: 76,  revenue: 760   },
]

const MOCK_CATEGORIES = [
  { name: 'مشروبات',    value: 35, color: '#16A34A' },
  { name: 'خضار وفواكه', value: 28, color: '#3B82F6' },
  { name: 'ألبان',       value: 20, color: '#8B5CF6' },
  { name: 'مخبوزات',    value: 12, color: '#F59E0B' },
  { name: 'أخرى',        value: 5,  color: '#EC4899' },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-3 min-w-[130px]">
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="font-bold text-gray-800">
            {p.dataKey === 'revenue' ? formatPrice(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function MetricCard({ label, value, sub, icon: Icon, gradient, change, up }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient}`}>
          <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${up !== false ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {up !== false ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function SellerAnalyticsPage() {
  const [period, setPeriod] = useState(30)

  const { data: store } = useQuery({ queryKey: ['my-store'], queryFn: getMyStore, retry: false })

  const { data: timeSeries = [], isLoading } = useQuery({
    queryKey: ['seller-timeseries', store?.id, period],
    queryFn:  () => getSellerTimeSeries(store.id, period),
    enabled:  !!store?.id,
  })

  const totalRevenue = timeSeries.reduce((s, d) => s + d.revenue, 0)
  const totalOrders  = timeSeries.reduce((s, d) => s + d.orders, 0)

  const formattedTS = timeSeries.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' }),
  }))

  const maxProduct = Math.max(...MOCK_TOP.map(p => p.revenue), 1)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التحليلات المتقدمة</h1>
          <p className="text-sm text-gray-500 mt-0.5">نظرة شاملة على أداء متجرك</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-2xl p-1 shadow-sm">
          {PERIOD_OPTS.map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${period === p.value ? 'bg-[#0F172A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="إجمالي الإيرادات"   value={formatPrice(totalRevenue)}                  sub={`آخر ${period} يوم`}  icon={DollarSign}  gradient="bg-gradient-to-br from-green-500 to-emerald-600"  change={15} up={true} />
        <MetricCard label="إجمالي الطلبات"      value={totalOrders.toLocaleString('ar-SA')}        sub={`آخر ${period} يوم`}  icon={ShoppingBag} gradient="bg-gradient-to-br from-blue-500 to-indigo-600"    change={8}  up={true} />
        <MetricCard label="تقييم المتجر"        value="٤.٨ ⭐"                                    sub="من ٥ نجوم"            icon={Star}        gradient="bg-gradient-to-br from-amber-500 to-orange-500"   change={3}  up={true} />
        <MetricCard label="متوسط قيمة الطلب"   value={totalOrders ? formatPrice(Math.round(totalRevenue / totalOrders)) : '—'} sub="AOV" icon={BarChart3}  gradient="bg-gradient-to-br from-violet-500 to-purple-600" change={6}  up={true} />
      </div>

      {/* Revenue Chart + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-bold text-gray-900">الإيرادات والطلبات</p>
              <p className="text-xs text-gray-400 mt-0.5">الاتجاه اليومي</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2 h-2 bg-[#16A34A] rounded-full" /> الإيرادات</div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2 h-2 bg-indigo-500 rounded-full" /> الطلبات</div>
            </div>
          </div>
          {isLoading ? (
            <div className="h-52 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={formattedTS} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#16A34A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="go" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} width={38} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="الإيرادات" stroke="#16A34A" strokeWidth={2} fill="url(#gr)" dot={false} />
                <Area type="monotone" dataKey="orders"  name="الطلبات"   stroke="#6366F1" strokeWidth={2} fill="url(#go)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Donut */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-900 mb-1">المبيعات حسب التصنيف</p>
          <p className="text-xs text-gray-400 mb-3">توزيع المبيعات</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={MOCK_CATEGORIES} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {MOCK_CATEGORIES.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {MOCK_CATEGORIES.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  <span className="text-gray-600">{c.name}</span>
                </div>
                <span className="font-bold text-gray-700">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Hours + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Peak Hours */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-900 mb-1">ساعات الذروة</p>
          <p className="text-xs text-gray-400 mb-4">أكثر الأوقات نشاطاً للطلبات</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MOCK_HOURS} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
              <Tooltip formatter={v => [v, 'طلبات']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="orders" fill="#16A34A" radius={[4,4,0,0]}
                label={null}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-900 mb-1">أفضل المنتجات</p>
          <p className="text-xs text-gray-400 mb-4">حسب الإيرادات</p>
          <div className="space-y-3">
            {MOCK_TOP.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-5 text-xs font-bold text-gray-300 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                    <div className="flex items-center gap-2 shrink-0 mr-2">
                      <span className="text-[10px] text-gray-400">{p.sales} مبيعة</span>
                      <span className="text-xs font-bold text-green-700">{formatPrice(p.revenue)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-1.5 rounded-full"
                      style={{ width: `${(p.revenue / maxProduct) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">توصيات الذكاء الاصطناعي</p>
            <p className="text-white/70 text-xs mt-1 leading-relaxed">
              بناءً على أنماط مبيعاتك، ننصحك بـ: <span className="text-white font-semibold">رفع مخزون "عصير البرتقال"</span> قبل نهاية الأسبوع حيث يزداد الطلب ٤٢٪.
              كذلك يمكنك <span className="text-white font-semibold">إنشاء عرض مجموعة</span> لمنتجات الألبان لرفع متوسط الطلب بنسبة ١٨٪.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
