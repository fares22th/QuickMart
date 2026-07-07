import OrdersTable from '@/components/seller/orders/OrdersTable'
import OrderFilters from '@/components/seller/orders/OrderFilters'

export default function SellerOrdersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
      <OrderFilters />
      <OrdersTable />
    </div>
  )
}
