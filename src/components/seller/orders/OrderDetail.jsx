import { formatPrice } from '@/utils/formatPrice'
import { formatDate } from '@/utils/formatDate'
import StatusPill from '@/components/common/StatusPill'

export default function OrderDetail({ order }) {
  if (!order) return null

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <p className="font-bold text-lg">طلب #{order.id}</p>
        <StatusPill status={order.status} />
      </div>
      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
      <div className="space-y-2">
        {order.items?.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.name} x{item.qty}</span>
            <span>{formatPrice(item.price * item.qty)}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-3 flex justify-between font-bold">
        <span>الإجمالي</span>
        <span className="text-primary">{formatPrice(order.total)}</span>
      </div>
    </div>
  )
}
