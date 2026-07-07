import AllOrdersTable from '@/components/admin/orders/AllOrdersTable'

export default function AdminAllOrdersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">جميع الطلبات</h1>
      <AllOrdersTable />
    </div>
  )
}
