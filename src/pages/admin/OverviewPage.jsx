import PlatformKpis from '@/components/admin/overview/PlatformKpis'
import GeoMap from '@/components/admin/overview/GeoMap'
import ActivityFeed from '@/components/admin/overview/ActivityFeed'

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">نظرة عامة على المنصة</h1>
      <PlatformKpis />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><GeoMap /></div>
        <ActivityFeed />
      </div>
    </div>
  )
}
