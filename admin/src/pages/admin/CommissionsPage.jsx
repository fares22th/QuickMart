import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, DollarSign } from 'lucide-react'
import { getCommissions, getCommissionsSummary } from '@/api/admin.api'
import CommissionBars from '@/components/admin/commissions/CommissionBars'
import PaymentsSummary from '@/components/admin/commissions/PaymentsSummary'
import Pagination from '@/components/common/Pagination'
import EmptyState from '@/components/common/EmptyState'
import PageBanner from '@/components/admin/layout/PageBanner'
import { formatPrice } from '@/utils/formatPrice'
import { formatDate } from '@/utils/formatDate'

function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm divide-y">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
          <div className="flex-1 space-y-1.5">
            <div className="h-4 bg-gray-100 rounded w-40" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
          <div className="h-4 bg-gray-100 rounded w-20" />
          <div className="h-4 bg-gray-100 rounded w-20" />
        </div>
      ))}
    </div>
  )
}

export default function AdminCommissionsPage() {
  const [search, setSearch] = useState('')
  const [page,   setPage]   = useState(1)

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['admin-commissions-summary'],
    queryFn:  getCommissionsSummary,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-commissions', { search, page }],
    queryFn:  () => getCommissions({ search, page, limit: 20 }),
    keepPreviousData: true,
  })

  const items      = data?.commissions ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="space-y-6" dir="rtl">
      <PageBanner
        title="العمولات والمدفوعات"
        subtitle="إدارة عمولات البائعين وسجل المدفوعات"
        icon={DollarSign}
        gradient="linear-gradient(135deg, #78350F 0%, #B45309 50%, #F59E0B 100%)"
        glow="rgba(245,158,11,0.4)"
      />

      {summaryLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-24 animate-pulse shadow-sm" />
          ))}
        </div>
      ) : (
        <PaymentsSummary data={summary ?? {}} />
      )}

      <CommissionBars data={data?.topSellers ?? []} />

      {/* Commission table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800">سجل العمولات التفصيلي</h2>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="بحث بالمتجر..."
              className="pr-9 pl-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-admin focus:outline-none bg-white w-56"
            />
          </div>
        </div>

        {isLoading ? <TableSkeleton /> : !items.length ? (
          <EmptyState title="لا توجد عمولات" message="لم يتم تسجيل أي عمولات بعد" />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm" dir="rtl">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  {['المتجر', 'رقم الطلب', 'قيمة الطلب', 'العمولة', 'التاريخ'].map(h => (
                    <th key={h} className="px-5 py-3 text-right font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{c.storeName}</td>
                    <td className="px-5 py-3 font-mono text-gray-500">#{c.orderId}</td>
                    <td className="px-5 py-3 text-gray-700">{formatPrice(c.orderTotal)}</td>
                    <td className="px-5 py-3 font-bold text-admin">{formatPrice(c.commission)}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{formatDate(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>
    </div>
  )
}
