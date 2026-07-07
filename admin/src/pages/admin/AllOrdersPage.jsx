import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, ShoppingBag } from 'lucide-react'
import { getAdminOrders } from '@/api/admin.api'
import StatusPill from '@/components/common/StatusPill'
import EmptyState from '@/components/common/EmptyState'
import Pagination from '@/components/common/Pagination'
import PageBanner from '@/components/admin/layout/PageBanner'
import { formatPrice } from '@/utils/formatPrice'
import { formatDate } from '@/utils/formatDate'

const STATUS_TABS = [
  { key: '',          label: 'الكل' },
  { key: 'pending',   label: 'قيد الانتظار' },
  { key: 'preparing', label: 'جاري التحضير' },
  { key: 'shipped',   label: 'في الطريق' },
  { key: 'delivered', label: 'تم التوصيل' },
  { key: 'cancelled', label: 'ملغي' },
]

function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm divide-y">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
          <div className="h-4 bg-gray-100 rounded w-16" />
          <div className="h-4 bg-gray-100 rounded flex-1" />
          <div className="h-4 bg-gray-100 rounded w-24" />
          <div className="h-4 bg-gray-100 rounded w-20" />
          <div className="h-6 bg-gray-100 rounded w-20" />
        </div>
      ))}
    </div>
  )
}

export default function AdminAllOrdersPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page,   setPage]   = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', { search, status, page }],
    queryFn:  () => getAdminOrders({ search, status, page, limit: 20 }),
    keepPreviousData: true,
  })

  const orders     = data?.orders ?? []
  const totalPages = data?.totalPages ?? 1
  const total      = data?.total ?? 0

  return (
    <div className="space-y-5" dir="rtl">
      <PageBanner
        title="جميع الطلبات"
        subtitle={!isLoading ? `${total} طلب على المنصة` : 'متابعة جميع طلبات المنصة'}
        icon={ShoppingBag}
        gradient="linear-gradient(135deg, #064E3B 0%, #047857 50%, #10B981 100%)"
        glow="rgba(16,185,129,0.4)"
      />

      {/* Status tabs */}
      <div className="flex gap-1.5 overflow-x-auto">
        {STATUS_TABS.map(t => (
          <button
            key={t.key}
            onClick={() => { setStatus(t.key); setPage(1) }}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
              status === t.key ? 'bg-admin text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-admin hover:text-admin'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="بحث برقم الطلب أو العميل أو المتجر..."
          className="w-full pr-9 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-admin focus:outline-none bg-white"
        />
      </div>

      {/* Table */}
      {isLoading ? <TableSkeleton /> : !orders.length ? (
        <EmptyState icon={ShoppingBag} title="لا توجد طلبات" message="لا توجد نتائج تطابق البحث" />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" dir="rtl">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  {['#', 'العميل', 'المتجر', 'المبلغ', 'التاريخ', 'الحالة'].map(h => (
                    <th key={h} className="px-5 py-3 text-right font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-gray-600">#{String(o.id).slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-3 text-gray-800">{o.customerName}</td>
                    <td className="px-5 py-3 text-gray-600">{o.storeName}</td>
                    <td className="px-5 py-3 font-bold text-gray-900">{formatPrice(o.total)}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{formatDate(o.createdAt)}</td>
                    <td className="px-5 py-3"><StatusPill status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
    </div>
  )
}
