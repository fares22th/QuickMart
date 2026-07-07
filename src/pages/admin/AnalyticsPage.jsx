import RevenueByCategory from '@/components/admin/analytics/RevenueByCategory'
import PlatformCharts from '@/components/admin/analytics/PlatformCharts'

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">التحليلات المتقدمة</h1>
      <PlatformCharts />
      <RevenueByCategory />
    </div>
  )
}
