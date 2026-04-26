import { Link } from 'react-router-dom'
import EmptyState from '@/components/common/EmptyState'
import StatusPill from '@/components/common/StatusPill'
import Avatar from '@/components/common/Avatar'

export default function SellersTable({ sellers = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {!sellers.length
        ? <EmptyState message="لا يوجد بائعون" />
        : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  {['البائع', 'المتجر', 'الطلبات', 'الحالة', 'إجراءات'].map(h => (
                    <th key={h} className="px-5 py-3 text-right font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sellers.map(s => (
                  <tr key={s.id} className="border-t hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={s.name} size="sm" />
                        <span>{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">{s.storeName}</td>
                    <td className="px-5 py-3">{s.ordersCount}</td>
                    <td className="px-5 py-3"><StatusPill status={s.status} /></td>
                    <td className="px-5 py-3">
                      <Link to={`/admin/sellers/${s.id}`} className="text-admin text-xs hover:underline">عرض</Link>
                    </td>
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
