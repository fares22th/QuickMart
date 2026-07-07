import { Link } from 'react-router-dom'
import StatusPill from '@/components/common/StatusPill'
import EmptyState from '@/components/common/EmptyState'
import { formatPrice } from '@/utils/formatPrice'
import { formatDate } from '@/utils/formatDate'

export default function RecentOrders({ orders = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-5 border-b">
        <h3 className="font-bold">آخر الطلبات</h3>
        <Link to="/seller/orders" className="text-sm text-primary hover:underline">عرض الكل</Link>
      </div>
      {!orders.length
        ? <EmptyState message="لا توجد طلبات بعد" />
        : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-3 text-right font-medium">رقم الطلب</th>
                <th className="px-5 py-3 text-right font-medium">العميل</th>
                <th className="px-5 py-3 text-right font-medium">المبلغ</th>
                <th className="px-5 py-3 text-right font-medium">التاريخ</th>
                <th className="px-5 py-3 text-right font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-3">#{o.id}</td>
                  <td className="px-5 py-3">{o.customerName}</td>
                  <td className="px-5 py-3 font-medium">{formatPrice(o.total)}</td>
                  <td className="px-5 py-3 text-gray-500">{formatDate(o.createdAt)}</td>
                  <td className="px-5 py-3"><StatusPill status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </div>
  )
}
