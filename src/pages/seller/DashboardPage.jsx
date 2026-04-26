import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import {
  DollarSign, ShoppingBag, Clock, CheckCircle, TrendingUp, TrendingDown,
  Users, Star, BarChart3, Package, ArrowUpRight, Zap, Store, AlertTriangle,
} from 'lucide-react'
import { getMyStore } from '@/api/stores.api'
import { getSellerStats, getSellerTimeSeries } from '@/api/seller.api'
import { formatPrice } from '@/utils/formatPrice'

const PERIOD_OPTS = [
  { label: '٧ أيام',  value: 7  },
  { label: '٣٠ يوم',  value: 30 },
  { label: '٩٠ يوم',  value: 90 },
]

const STATUS_COLORS = ['#16A34A', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#EF4444']
const STATUS_AR = {
  pending:           'معلق',
  confirmed:         'مؤكد',
  preparing:         'تجهيز',
  out_for_delivery:  'في الطريق',
  delivered:         'مُسلَّم',
  cancelled:         'ملغي',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-3 min-w-[140px]">
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-bold text-gray-800">
            {p.dataKey === 'revenue' ? formatPrice(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function KpiCard({ label, value, sub, icon: Icon, gradient, trend, alert }) {
  const up = trend >= 0
  return (
    <div className={`relative bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${alert ? 'border-amber-200 ring-1 ring-amber-200' : 'border-gray-100'}`}>
      <div className={`absolute -left-4 -top-4 w-24 h-24 rounded-full opacity-[0.06] ${gradient}`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient}`}>
            <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              {up ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(trend)}%
            </div>
          )}
          {alert && (
            <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-600">
              <AlertTriangle className="w-3 h-3" /> تنبيه
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
        <p className="text-sm font-medium text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="w-10 h-10 bg-gray-100 rounded-xl" />
        <div className="w-14 h-6 bg-gray-100 rounded-full" />
      </div>
      <div className="h-7 bg-gray-100 rounded-lg w-24 mb-1.5" />
      <div className="h-3.5 bg-gray-100 rounded w-32" />
    </div>
  )
}

const MOCK_ACTIVITY = [
  { id: '1', icon: '📦', text: 'طلب جديد #4921 من أحمد الزبون',        time: 'منذ ٢ دقائق',   color: 'bg-blue-50 text-blue-600' },
  { id: '2', icon: '✅', text: 'تم توصيل طلب #4919 بنجاح',            time: 'منذ ١٥ دقيقة',  color: 'bg-green-50 text-green-600' },
  { id: '3', icon: '⭐', text: 'تقييم ٥ نجوم من نورة القحطاني',        time: 'منذ ٤٠ دقيقة',  color: 'bg-violet-50 text-violet-600' },
  { id: '4', icon: '⚠️', text: 'مخزون منخفض: عصير برتقال (٣ قطع)',    time: 'منذ ١ ساعة',    color: 'bg-amber-50 text-amber-600' },
  { id: '5', icon: '💰', text: 'تم تحويل ٢,٨٤٠ ر.س إلى حسابك',        time: 'منذ ٣ ساعات',  color: 'bg-emerald-50 text-emerald-600' },
]

const MOCK_TOP_PRODUCTS = [
  { name: 'عصير برتقال طازج',     sales: 148, revenue: 2960,  img: null },
  { name: 'سلطة فواكه مشكلة',     sales: 92,  revenue: 1840,  img: null },
  { name: 'خبز عربي أصيل',        sales: 216, revenue: 1080,  img: null },
  { name: 'لبن كامل الدسم',       sales: 184, revenue: 920,   img: null },
  { name: 'تفاح أحمر طازج',       sales: 76,  revenue: 760,   img: null },
]

export default function SellerDashboardPage() {
  const [period, setPeriod] = useState(30)

  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['my-store'],
    queryFn:  getMyStore,
    retry: false,
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['seller-stats', store?.id],
    queryFn:  () => getSellerStats(store.id),
    enabled:  !!store?.id,
  })

  const { data: timeSeries = [], isLoading: tsLoading } = useQuery({
    queryKey: ['seller-timeseries', store?.id, period],
    queryFn:  () => getSellerTimeSeries(store.id, period),
    enabled:  !!store?.id,
  })

  const isLoading = storeLoading || statsLoading

  const formattedTS = timeSeries.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' }),
  }))

  const maxProduct = Math.max(...MOCK_TOP_PRODUCTS.map(p => p.revenue), 1)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'صباح الخير' : hour < 18 ? 'مساء الخير' : 'مساء النور'

  // No store yet — onboarding state
  if (!storeLoading && !store) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-200">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">أنشئ متجرك الآن</h2>
          <p className="text-gray-500 text-sm mb-6">أنت لا تملك متجراً بعد. أنشئ متجرك وابدأ البيع خلال دقائق.</p>
          <a href="/seller/register-store"
            className="inline-flex items-center gap-2 bg-[#16A34A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-sm">
            <Zap className="w-4 h-4" /> إنشاء المتجر
          </a>
        </div>
      </div>
    )
  }

  const kpis = [
    { label: 'إجمالي الإيرادات',  value: formatPrice(stats?.totalRevenue ?? 0),            sub: 'من الطلبات المكتملة',                icon: DollarSign,  gradient: 'bg-gradient-to-br from-green-500 to-emerald-600',  trend: 15 },
    { label: 'إجمالي الطلبات',     value: (stats?.totalOrders ?? 0).toLocaleString('ar-SA'), sub: `${stats?.todayOrders ?? 0} طلب اليوم`, icon: ShoppingBag, gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',    trend: 8  },
    { label: 'طلبات معلقة',        value: (stats?.pendingOrders ?? 0).toLocaleString('ar-SA'), sub: 'تحتاج إجراءً منك',                icon: Clock,       gradient: 'bg-gradient-to-br from-amber-500 to-orange-500',   alert: (stats?.pendingOrders ?? 0) > 0 },
    { label: 'إيرادات هذا الشهر',  value: formatPrice(stats?.monthRevenue ?? 0),             sub: 'آخر ٣٠ يوم',                       icon: TrendingUp,  gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',  trend: 22 },
    { label: 'إجمالي المنتجات',    value: (stats?.totalProducts ?? 0).toLocaleString('ar-SA'), sub: 'في كتالوج متجرك',                icon: Package,     gradient: 'bg-gradient-to-br from-cyan-500 to-sky-600',       trend: 5  },
    { label: 'تقييم المتجر',       value: Number(stats?.rating ?? 0).toFixed(1),             sub: 'متوسط تقييم العملاء',              icon: Star,        gradient: 'bg-gradient-to-br from-pink-500 to-rose-600',      trend: 3  },
    { label: 'معدل النمو',          value: '٢٣٪',                                            sub: 'مقارنة بالشهر الماضي',              icon: BarChart3,   gradient: 'bg-gradient-to-br from-teal-500 to-green-600',    trend: 23 },
    { label: 'متوسط قيمة الطلب',   value: stats?.totalOrders ? formatPrice(Math.round((stats.totalRevenue || 0) / (stats.totalOrders || 1))) : '—', sub: 'AOV', icon: Users, gradient: 'bg-gradient-to-br from-slate-500 to-gray-600', trend: 6 },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">{greeting}،</p>
          <h1 className="text-2xl font-bold text-gray-900">{store?.name ?? 'متجري'} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">هذا هو أداء متجرك — تابع كل شيء من هنا</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-2xl p-1 shadow-sm shrink-0">
          {PERIOD_OPTS.map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${period === p.value ? 'bg-[#0F172A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      {isLoading
        ? <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}</div>
        : <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{kpis.map(k => <KpiCard key={k.label} {...k} />)}</div>
      }

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue & Orders AreaChart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-bold text-gray-900">الإيرادات والطلبات</p>
              <p className="text-xs text-gray-400 mt-0.5">مقارنة يومية خلال آخر {period} يوم</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" /> الإيرادات
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> الطلبات
              </div>
            </div>
          </div>
          {tsLoading ? (
            <div className="h-52 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
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
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} width={38} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="الإيرادات" stroke="#16A34A" strokeWidth={2} fill="url(#rev)" dot={false} />
                <Area type="monotone" dataKey="orders"  name="الطلبات"   stroke="#6366F1" strokeWidth={2} fill="url(#ord)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-900 mb-1">آخر الأحداث</p>
          <p className="text-xs text-gray-400 mb-4">نشاط متجرك في الوقت الفعلي</p>
          <div className="space-y-3">
            {MOCK_ACTIVITY.map(a => (
              <div key={a.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${a.color}`}>
                  {a.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-700 leading-snug">{a.text}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-bold text-gray-900">أفضل المنتجات مبيعاً</p>
            <p className="text-xs text-gray-400 mt-0.5">ترتيب المنتجات حسب الإيرادات</p>
          </div>
          <a href="/seller/products" className="text-xs text-green-600 font-semibold hover:underline">
            عرض الكل
          </a>
        </div>
        <div className="space-y-3">
          {MOCK_TOP_PRODUCTS.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3">
              <span className="w-5 text-xs font-bold text-gray-300 text-center shrink-0">{i + 1}</span>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0 overflow-hidden">
                {p.img ? <img src={p.img} alt="" className="w-full h-full object-cover" /> : p.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                  <div className="flex items-center gap-2 shrink-0 mr-2">
                    <span className="text-[10px] text-gray-400">{p.sales} مبيعة</span>
                    <span className="text-xs font-bold text-green-700">{formatPrice(p.revenue)}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${(p.revenue / maxProduct) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
