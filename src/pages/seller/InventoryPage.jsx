import EmptyState from '@/components/common/EmptyState'

export default function InventoryPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">إدارة المخزون</h1>
      <EmptyState message="لا توجد بيانات مخزون" />
    </div>
  )
}
