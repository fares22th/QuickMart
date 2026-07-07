import RevenueCard from '@/components/seller/analytics/RevenueCard'
import TopProductsList from '@/components/seller/analytics/TopProductsList'
import MiniBarChart from '@/components/seller/analytics/MiniBarChart'

export default function SellerAnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">التحليلات</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RevenueCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MiniBarChart />
        <TopProductsList />
      </div>
    </div>
  )
}
