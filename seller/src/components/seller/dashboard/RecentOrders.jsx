import { Link } from 'react-router-dom'
import StatusPill from '@/components/common/StatusPill'
import EmptyState from '@/components/common/EmptyState'
import { formatPrice } from '@/utils/formatPrice'
import { formatDate } from '@/utils/formatDate'
import { ArrowLeft } from 'lucide-react'

export default function RecentOrders({ orders = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="font-extrabold text-gray-900">آخر الطلبات</h3>
          <p className="text-xs text-gray-400 mt-0.5">{orders.length} طلب حديث</p>
        </div>
        <Link
          to="/seller/orders"
          className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
          style={{ color: '#00C896' }}
        >
          عرض الكل
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {!orders.length ? (
        <EmptyState message="لا توجد طلبات بعد" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" dir="rtl">
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">رقم</th>
                <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">العميل</th>
                <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">المبلغ</th>
                <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">التاريخ</th>
                <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, idx) => (
                <tr
                  key={o.id}
                  className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">
                      #{String(o.id).slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: `hsl(${(o.customerName?.charCodeAt(0) ?? 0) * 137}deg 50% 45%)` }}
                      >
                        {o.customerName?.[0] ?? '?'}
                      </div>
                      <span className="font-medium text-gray-800">{o.customerName ?? '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-gray-900">{formatPrice(o.total)}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate(o.createdAt)}</td>
                  <td className="px-5 py-3.5"><StatusPill status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
