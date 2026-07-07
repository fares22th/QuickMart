import { useQuery } from '@tanstack/react-query'
import { getAdminStats, getActivityFeed } from '@/api/admin.api'
import { useAuthStore } from '@/store/useAuthStore'
import PlatformKpis from '@/components/admin/overview/PlatformKpis'
import ActivityFeed from '@/components/admin/overview/ActivityFeed'
import GeoMap from '@/components/admin/overview/GeoMap'
import { ShieldCheck, AlertTriangle, TrendingUp } from 'lucide-react'

function AdminBanner({ user, stats }) {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور'

  return (
    <div
      className="relative rounded-2xl overflow-hidden p-6 text-white"
      style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #2d2b6b 50%, #3730a3 100%)' }}
    >
      <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.15) 0%, transparent 70%)' }} />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-xs font-bold"
            style={{ background: 'rgba(99,102,241,0.25)', color: '#C7D2FE', border: '1px solid rgba(165,180,252,0.2)' }}>
            <ShieldCheck className="w-3 h-3" />
            {greeting}، {user?.name ?? 'المشرف'}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">نظرة عامة على المنصة</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(199,210,254,0.6)' }}>
            لوحة تحكم QuickMart — مراقبة شاملة لجميع العمليات
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {stats?.pendingSellers > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <TrendingUp className="w-4 h-4 text-yellow-400" />
              <div>
                <p className="text-lg font-extrabold leading-none">{stats.pendingSellers}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(253,230,138,0.7)' }}>بائع ينتظر</p>
              </div>
            </div>
          )}
          {stats?.openDisputes > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <div>
                <p className="text-lg font-extrabold leading-none">{stats.openDisputes}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(252,165,165,0.7)' }}>نزاع مفتوح</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }} />
    </div>
  )
}

export default function AdminOverviewPage() {
  const { user } = useAuthStore()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getAdminStats,
    refetchInterval: 60_000,
  })

  const { data: activities = [], isLoading: feedLoading } = useQuery({
    queryKey: ['admin-activity'],
    queryFn: getActivityFeed,
    refetchInterval: 30_000,
  })

  return (
    <div className="space-y-6" dir="rtl">
      <AdminBanner user={user} stats={stats} />
      <PlatformKpis stats={stats} isLoading={statsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GeoMap data={stats?.ordersByCity ?? []} />
        </div>
        <ActivityFeed activities={activities} isLoading={feedLoading} />
      </div>
    </div>
  )
}
