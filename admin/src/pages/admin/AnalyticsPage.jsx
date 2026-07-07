import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAdminAnalytics, getRevenueByCategory } from '@/api/admin.api'
import PlatformCharts from '@/components/admin/analytics/PlatformCharts'
import RevenueByCategory from '@/components/admin/analytics/RevenueByCategory'
import PageBanner from '@/components/admin/layout/PageBanner'
import { BarChart2 } from 'lucide-react'

const PERIODS = [
  { key: 'week',   label: 'أسبوعي' },
  { key: 'month',  label: 'شهري' },
  { key: 'year',   label: 'سنوي' },
]

function Skeleton() {
  return <div className="bg-white rounded-2xl shadow-sm animate-pulse h-72" />
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('month')

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-analytics', period],
    queryFn:  () => getAdminAnalytics(period),
  })

  const { data: byCategory, isLoading: catLoading } = useQuery({
    queryKey: ['admin-revenue-by-category'],
    queryFn:  getRevenueByCategory,
  })

  return (
    <div className="space-y-6" dir="rtl">
      <PageBanner
        title="التحليلات المتقدمة"
        subtitle="مخططات وإحصائيات أداء المنصة"
        icon={BarChart2}
        gradient="linear-gradient(135deg, #065F46 0%, #059669 50%, #10B981 100%)"
        glow="rgba(16,185,129,0.4)"
      />

      <div className="flex justify-end">
        <div className="flex bg-white rounded-xl p-0.5 shadow-sm border border-gray-100">
          {PERIODS.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                period === p.key ? 'text-white shadow' : 'text-gray-400 hover:text-gray-600'
              }`}
              style={period === p.key ? { background: 'linear-gradient(135deg, #059669, #10B981)' } : {}}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {analyticsLoading ? <Skeleton /> : (
        <PlatformCharts data={analytics?.chartData ?? []} />
      )}

      {catLoading ? <Skeleton /> : (
        <RevenueByCategory data={byCategory ?? []} />
      )}
    </div>
  )
}
