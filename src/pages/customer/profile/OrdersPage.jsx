import { useOrders } from '@/hooks/useOrders'
import StatusPill from '@/components/common/StatusPill'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { formatDate } from '@/utils/formatDate'
import { formatPrice } from '@/utils/formatPrice'

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders()

  if (isLoading) return <Spinner />

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">طلباتي</h1>
      {!orders?.length
        ? <EmptyState message="لا توجد طلبات بعد" />
        : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold">طلب #{order.id}</p>
                  <StatusPill status={order.status} />
                </div>
                <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                <p className="font-bold text-primary mt-2">{formatPrice(order.total)}</p>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}
