import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Package, DollarSign, Calendar, Clock } from 'lucide-react'
import { getEarnings } from '@/api/driver.api'

function formatPrice(n) {
  return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(n ?? 0)
}

function StatCard({ label, value, sub, color, icon: Icon }) {
  return (
    <div
      className="rounded-3xl p-4"
      style={{ background: '#1C1009', border: '1px solid #2E1A00' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: `${color}15`, color }}
        >
          {sub}
        </span>
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </div>
  )
}

export default function EarningsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['earnings'], queryFn: getEarnings })

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: '#0F0800' }}>
        <div className="w-10 h-10 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  const d = data ?? {}

  const miniBar = d.recentOrders?.map((o, i) => ({
    label: new Date(o.updatedAt).toLocaleDateString('ar-SA', { weekday: 'short' }),
    value: 10,
  })) ?? []

  const maxVal = Math.max(...miniBar.map(b => b.value), 1)

  return (
    <div className="flex flex-col min-h-dvh pb-24" dir="rtl" style={{ background: '#0F0800' }}>
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{ background: 'linear-gradient(160deg, #1A0900 0%, #0F0800 100%)' }}
      >
        <h1 className="text-2xl font-black text-white mb-1">أرباحي</h1>
        <p className="text-gray-500 text-sm">نظرة عامة على دخلك</p>
      </div>

      <div className="flex-1 px-5 pt-2 space-y-3">
        {/* Today hero */}
        <div
          className="rounded-3xl p-6 text-center"
          style={{
            background: 'linear-gradient(135deg, #1A0A00 0%, #2D1200 100%)',
            border: '1px solid #F9731630',
            boxShadow: '0 8px 32px rgba(249,115,22,0.15)',
          }}
        >
          <p className="text-gray-400 text-sm mb-2">دخل اليوم</p>
          <p className="text-4xl font-black text-white mb-1">{formatPrice(d.todayEarnings)}</p>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mt-2"
            style={{ background: '#F9731620' }}
          >
            <Package className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-orange-400 text-sm font-bold">{d.todayDeliveries} توصيلة</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="أرباح الأسبوع"
            value={formatPrice(d.weekEarnings)}
            sub={`${d.weekDeliveries} طلب`}
            color="#F97316"
            icon={Calendar}
          />
          <StatCard
            label="أرباح الشهر"
            value={formatPrice(d.monthEarnings)}
            sub={`${d.monthDeliveries} طلب`}
            color="#3B82F6"
            icon={TrendingUp}
          />
          <StatCard
            label="إجمالي الأرباح"
            value={formatPrice(d.totalEarnings)}
            sub="كل الأوقات"
            color="#22C55E"
            icon={DollarSign}
          />
          <StatCard
            label="إجمالي التوصيلات"
            value={d.totalDeliveries ?? 0}
            sub="كل الأوقات"
            color="#A855F7"
            icon={Package}
          />
        </div>

        {/* Mini chart */}
        {miniBar.length > 0 && (
          <div
            className="rounded-3xl p-4"
            style={{ background: '#1C1009', border: '1px solid #2E1A00' }}
          >
            <p className="font-bold text-white mb-4">آخر التوصيلات</p>
            <div className="flex items-end gap-2 h-24">
              {miniBar.slice(0, 7).map((b, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${(b.value / maxVal) * 80}px`,
                      background: 'linear-gradient(180deg, #F97316 0%, #EA580C 100%)',
                      minHeight: 8,
                    }}
                  />
                  <span className="text-gray-600 text-xs">{b.label}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 text-xs mt-3">10 ر.س. لكل توصيلة</p>
          </div>
        )}
      </div>
    </div>
  )
}
