import KpiCards from '@/components/seller/dashboard/KpiCards'
import SalesChart from '@/components/seller/dashboard/SalesChart'
import CategoryDonut from '@/components/seller/dashboard/CategoryDonut'
import RecentOrders from '@/components/seller/dashboard/RecentOrders'

export default function SellerDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">لوحة التحكم</h1>
      <KpiCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <CategoryDonut />
      </div>
      <RecentOrders />
    </div>
  )
}
