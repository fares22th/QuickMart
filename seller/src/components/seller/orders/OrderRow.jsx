import StatusPill from '@/components/common/StatusPill'
import { formatPrice } from '@/utils/formatPrice'
import { formatDate } from '@/utils/formatDate'

export default function OrderRow({ order, onView }) {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="px-4 py-3 font-medium">#{order.id}</td>
      <td className="px-4 py-3">{order.customerName}</td>
      <td className="px-4 py-3">{formatPrice(order.total)}</td>
      <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
      <td className="px-4 py-3"><StatusPill status={order.status} /></td>
      <td className="px-4 py-3">
        <button onClick={() => onView?.(order)} className="text-primary text-xs hover:underline">عرض التفاصيل</button>
      </td>
    </tr>
  )
}
