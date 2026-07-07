import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSellerStats, getSalesChart } from '@/api/seller.api'
import RevenueCard from '@/components/seller/analytics/RevenueCard'
import TopProductsList from '@/components/seller/analytics/TopProductsList'
import MiniBarChart from '@/components/seller/analytics/MiniBarChart'
import CategoryDonut from '@/components/seller/dashboard/CategoryDonut'
import { BarChart3 } from 'lucide-react'

const PERIODS = [
  { key: 'week',  label: 'هذا الأسبوع' },
  { key: 'month', label: 'هذا الشهر' },
  { key: 'year',  label: 'هذا العام' },
]

function StatCard({ label, value, sub, color = 'text-gray-900' }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function ChartSkeleton() {
  return <div className="bg-white rounded-2xl h-64 animate-pulse shadow-sm" />
}

export default function SellerAnalyticsPage() {
  const [period, setPeriod] = useState('month')

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['seller-stats'],
    queryFn:  getSellerStats,
  })

  const { data: chart, isLoading: chartLoading } = useQuery({
    queryKey: ['seller-sales-chart', period],
    queryFn:  () => getSalesChart(period),
  })

  const chartData = chart?.[period] ?? []
  const monthlyRevenue = chartData.map(d => ({ label: d.label, value: d.sales ?? 0 }))
  const monthlyOrders  = chartData.map(d => ({ label: d.label, value: d.orders ?? 0 }))

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">التحليلات والإحصائيات</h1>

        <div className="flex bg-gray-100 rounded-xl p-0.5">
          {PERIODS.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                period === p.key ? 'bg-white shadow text-gray-800' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
              <div className="h-3 bg-gray-100 rounded w-24 mb-3" />
              <div className="h-7 bg-gray-100 rounded w-32" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              label="إجمالي الإيرادات"
              value={`${(stats?.revenue ?? 0).toLocaleString('ar-SA')} ر.س`}
              sub={stats?.trends?.revenue != null ? `${stats.trends.revenue > 0 ? '+' : ''}${stats.trends.revenue}% مقارنة بالفترة السابقة` : undefined}
              color={stats?.trends?.revenue >= 0 ? 'text-green-600' : 'text-red-500'}
            />
            <StatCard
              label="إجمالي الطلبات"
              value={stats?.totalOrders ?? 0}
              sub={stats?.trends?.totalOrders != null ? `${stats.trends.totalOrders > 0 ? '+' : ''}${stats.trends.totalOrders}% نمو` : undefined}
            />
            <StatCard
              label="متوسط قيمة الطلب"
              value={`${(stats?.avgOrderValue ?? 0).toFixed(0)} ر.س`}
            />
            <StatCard
              label="العملاء"
              value={stats?.totalCustomers ?? 0}
              sub="عميل فريد"
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartLoading ? <ChartSkeleton /> : (
          <MiniBarChart data={monthlyRevenue} title="الإيرادات" />
        )}
        {chartLoading ? <ChartSkeleton /> : (
          <MiniBarChart data={monthlyOrders} title="الطلبات" />
        )}
      </div>

      {/* Donut + top products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDonut data={stats?.salesByCategory ?? []} />
        {statsLoading ? (
          <div className="bg-white rounded-2xl shadow-sm animate-pulse h-64" />
        ) : (
          <TopProductsList products={stats?.topProducts ?? []} />
        )}
      </div>

      {/* Revenue card */}
      <RevenueCard
        total={stats?.revenue ?? 0}
        growth={stats?.trends?.revenue ?? 0}
      />
    </div>
  )
}
