import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ShoppingBag, DollarSign, MapPin, Phone, Mail } from 'lucide-react'
import { getAdminCustomer } from '@/api/admin.api'
import Avatar from '@/components/common/Avatar'
import StatusPill from '@/components/common/StatusPill'
import Spinner from '@/components/common/Spinner'
import { formatPrice } from '@/utils/formatPrice'
import { formatDate } from '@/utils/formatDate'

export default function CustomerDetailPage() {
  const { id } = useParams()

  const { data: customer, isLoading } = useQuery({
    queryKey: ['admin-customer', id],
    queryFn:  () => getAdminCustomer(id),
    enabled:  !!id,
  })

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner /></div>
  if (!customer)  return <div className="text-center py-16 text-gray-400">العميل غير موجود</div>

  return (
    <div className="space-y-6 max-w-4xl" dir="rtl">
      <Link to="/admin/customers" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-admin transition-colors">
        <ArrowRight className="w-4 h-4" />
        العودة إلى العملاء
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={customer.name} size="lg" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">{customer.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-400">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{customer.phone}</span>
              {customer.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{customer.email}</span>}
            </div>
            <p className="text-xs text-gray-400 mt-1">انضم {formatDate(customer.createdAt)}</p>
          </div>
        </div>
        <StatusPill status={customer.status ?? 'active'} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'إجمالي الطلبات',  value: customer.ordersCount ?? 0,            icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
          { label: 'إجمالي الإنفاق',   value: formatPrice(customer.totalSpent ?? 0), icon: DollarSign,  color: 'bg-green-50 text-green-600' },
          { label: 'المناطق',          value: customer.addresses?.length ?? 0,       icon: MapPin,      color: 'bg-purple-50 text-purple-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
            <div>
              <p className="font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      {customer.recentOrders?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <h3 className="font-bold text-gray-800">آخر الطلبات</h3>
          </div>
          <table className="w-full text-sm" dir="rtl">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                {['#', 'المتجر', 'المبلغ', 'التاريخ', 'الحالة'].map(h => (
                  <th key={h} className="px-4 py-3 text-right font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customer.recentOrders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-gray-600">#{String(o.id).slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-gray-700">{o.storeName}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
