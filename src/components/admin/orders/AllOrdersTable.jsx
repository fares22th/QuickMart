import EmptyState from '@/components/common/EmptyState'
import StatusPill from '@/components/common/StatusPill'
import { formatPrice } from '@/utils/formatPrice'
import { formatDate } from '@/utils/formatDate'

export default function AllOrdersTable({ orders = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {!orders.length
        ? <EmptyState message="لا توجد طلبات" />
        : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  {['#', 'العميل', 'المتجر', 'المبلغ', 'التاريخ', 'الحالة'].map(h => (
                    <th key={h} className="px-5 py-3 text-right font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-t hover:bg-gray-50">
                    <td className="px-5 py-3">#{o.id}</td>
                    <td className="px-5 py-3">{o.customerName}</td>
                    <td className="px-5 py-3">{o.storeName}</td>
                    <td className="px-5 py-3 font-medium">{formatPrice(o.total)}</td>
                    <td className="px-5 py-3 text-gray-500">{formatDate(o.createdAt)}</td>
                    <td className="px-5 py-3"><StatusPill status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}
