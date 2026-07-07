import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSellerStats, getSalesChart } from '@/api/seller.api'
import { useAuthStore } from '@/store/useAuthStore'
import KpiCards from '@/components/seller/dashboard/KpiCards'
import SalesChart from '@/components/seller/dashboard/SalesChart'
import CategoryDonut from '@/components/seller/dashboard/CategoryDonut'
import RecentOrders from '@/components/seller/dashboard/RecentOrders'
import { TrendingUp, ShoppingBag, Zap } from 'lucide-react'

function WelcomeBanner({ user, stats }) {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور'

  return (
    <div
      className="relative rounded-2xl overflow-hidden p-6 text-white"
      style={{ background: 'linear-gradient(135deg, #0A2218 0%, #0F3024 50%, #1A4D36 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,200,150,0.18) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,200,150,0.1) 0%, transparent 70%)' }} />
      <div className="absolute top-4 right-1/3 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          {/* Greeting pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-xs font-semibold"
            style={{ background: 'rgba(0,200,150,0.15)', color: '#6EE7C7', border: '1px solid rgba(0,200,150,0.2)' }}>
            <Zap className="w-3 h-3" />
            {greeting}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            أهلاً، {user?.name ?? 'البائع'} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            إليك نظرة شاملة على أداء متجرك اليوم
          </p>
        </div>

        {/* Quick stats */}
        <div className="hidden md:flex items-center gap-3">
          {stats?.pendingOrders > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: 'rgba(0,200,150,0.15)', border: '1px solid rgba(0,200,150,0.2)' }}>
              <ShoppingBag className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-lg font-extrabold leading-none">{stats.pendingOrders}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>طلب جديد</p>
              </div>
            </div>
          )}
          {stats?.revenue != null && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <div>
                <p className="text-lg font-extrabold leading-none">
                  {stats.revenue >= 1000 ? `${(stats.revenue / 1000).toFixed(1)}k` : stats.revenue}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>ريال إيرادات</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,150,0.5), transparent)' }} />
    </div>
  )
}

export default function SellerDashboardPage() {
  const [chartPeriod, setChartPeriod] = useState('week')
  const { user } = useAuthStore()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['seller-stats'],
    queryFn: getSellerStats,
  })

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['seller-sales-chart', chartPeriod],
    queryFn: () => getSalesChart(chartPeriod),
  })

  return (
    <div className="space-y-6" dir="rtl">
      {/* Hero banner */}
      <WelcomeBanner user={user} stats={stats} />

      {/* KPI cards */}
      <KpiCards stats={stats} isLoading={statsLoading} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart
            chartData={chartData}
            isLoading={chartLoading}
            onPeriodChange={setChartPeriod}
          />
        </div>
        <CategoryDonut data={stats?.salesByCategory ?? []} />
      </div>

      {/* Recent orders */}
      <RecentOrders orders={stats?.recentOrders ?? []} />
    </div>
  )
}
