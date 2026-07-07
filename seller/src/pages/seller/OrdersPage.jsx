import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Search, ChevronDown, Eye, Bike } from 'lucide-react'
import { getMyOrders, updateMyOrderStatus } from '@/api/seller.api'
import StatusPill from '@/components/common/StatusPill'
import EmptyState from '@/components/common/EmptyState'
import Pagination from '@/components/common/Pagination'
import Modal from '@/components/common/Modal'
import { formatPrice } from '@/utils/formatPrice'
import { formatDate } from '@/utils/formatDate'

const STATUS_TABS = [
  { key: '',           label: 'الكل' },
  { key: 'pending',    label: 'قيد الانتظار' },
  { key: 'confirmed',  label: 'مؤكد' },
  { key: 'preparing',  label: 'جاري التحضير' },
  { key: 'shipped',    label: 'في الطريق' },
  { key: 'delivered',  label: 'تم التوصيل' },
  { key: 'cancelled',  label: 'ملغي' },
]

const NEXT_STATUS = {
  pending:   { key: 'confirmed',  label: 'تأكيد الطلب' },
  confirmed: { key: 'preparing',  label: 'بدء التحضير' },
  preparing: { key: 'shipped',    label: 'تسليم للشحن' },
  shipped:   { key: 'delivered',  label: 'تأكيد التوصيل' },
}

// If order has a driver, seller can't advance beyond preparing
function getNextStatus(order) {
  if (order.driverId && ['preparing', 'shipped'].includes(order.status)) return null
  return NEXT_STATUS[order.status] ?? null
}

function OrderDetailModal({ order, onClose, onStatusUpdate, isUpdating }) {
  if (!order) return null
  const next = getNextStatus(order)

  const shortId = String(order.id).slice(-8).toUpperCase()
  return (
    <Modal open={!!order} onClose={onClose} title={`تفاصيل الطلب #${shortId}`}>
      <div className="space-y-4 text-sm" dir="rtl">
        {/* Customer */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="font-semibold text-gray-800 mb-1">بيانات العميل</p>
          <p className="text-gray-600">{order.customerName}</p>
          {order.customerPhone && <p className="text-gray-500 mt-0.5">{order.customerPhone}</p>}
          {order.addressText && <p className="text-gray-500 mt-0.5">{order.addressText}</p>}
        </div>

        {/* Items */}
        <div>
          <p className="font-semibold text-gray-800 mb-2">المنتجات</p>
          <div className="space-y-2">
            {(order.items ?? []).map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.image && (
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-400 text-xs">× {item.qty}</p>
                  </div>
                </div>
                <p className="font-medium">{formatPrice(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
          <span>الإجمالي</span>
          <span>{formatPrice(order.total)}</span>
        </div>

        {/* Driver info */}
        {order.driverName && (
          <div className="flex items-center gap-3 bg-orange-50 rounded-xl p-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
              <Bike className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-orange-600 font-medium">مندوب التوصيل</p>
              <p className="text-sm font-semibold text-gray-800">{order.driverName}</p>
            </div>
            {order.driverPhone && (
              <a
                href={`tel:${order.driverPhone}`}
                className="text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                اتصال
              </a>
            )}
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">الحالة:</span>
            <StatusPill status={order.status} />
          </div>
          {next ? (
            <button
              onClick={() => onStatusUpdate(order.id, next.key)}
              disabled={isUpdating}
              className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isUpdating ? 'جاري التحديث...' : next.label}
            </button>
          ) : order.driverId && order.status === 'preparing' ? (
            <span className="text-xs text-orange-500 font-medium bg-orange-50 px-3 py-1.5 rounded-lg">
              بانتظار المندوب
            </span>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}

function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm divide-y">
      {Array.from({ length: 7 }).map((_, i) => (
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

export default function SellerOrdersPage() {
  const qc = useQueryClient()
  const [status, setStatus]   = useState('')
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const [selected, setSelected] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['seller-orders', { status, search, page }],
    queryFn:  () => getMyOrders({ status, search, page, limit: 15 }),
    keepPreviousData: true,
  })

  const updateMut = useMutation({
    mutationFn: ({ id, newStatus }) => updateMyOrderStatus(id, newStatus),
    onSuccess: (_, { id, newStatus }) => {
      qc.invalidateQueries({ queryKey: ['seller-orders'] })
      qc.invalidateQueries({ queryKey: ['seller-stats'] })
      toast.success('تم تحديث حالة الطلب')
      setSelected(prev => prev ? { ...prev, status: newStatus } : null)
    },
    onError: () => toast.error('تعذّر تحديث الحالة'),
  })

  const orders     = data?.orders ?? []
  const totalPages = data?.totalPages ?? 1
  const counts     = data?.counts ?? {}

  return (
    <div className="space-y-5" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>

      {/* Status tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {STATUS_TABS.map(t => (
          <button
            key={t.key}
            onClick={() => { setStatus(t.key); setPage(1) }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
              status === t.key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
            }`}
          >
            {t.label}
            {counts[t.key] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                status === t.key ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="بحث برقم الطلب أو اسم العميل..."
          className="w-full pr-9 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none bg-white"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : !orders.length ? (
        <EmptyState icon="📦" title="لا توجد طلبات" message="لم يتم العثور على طلبات بهذا الفلتر" />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" dir="rtl">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  {['رقم الطلب', 'العميل', 'المبلغ', 'التاريخ', 'الحالة', 'المندوب', 'إجراء'].map(h => (
                    <th key={h} className="px-5 py-3 text-right font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(o => {
                  const next = getNextStatus(o)
                  return (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-mono text-gray-700">#{String(o.id).slice(-8).toUpperCase()}</td>
                      <td className="px-5 py-3 text-gray-800">{o.customerName}</td>
                      <td className="px-5 py-3 font-bold text-gray-900">{formatPrice(o.total)}</td>
                      <td className="px-5 py-3 text-gray-500">{formatDate(o.createdAt)}</td>
                      <td className="px-5 py-3">
                        <StatusPill status={o.status} />
                      </td>
                      <td className="px-5 py-3">
                        {o.driverName ? (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-orange-600">
                            <Bike className="w-3.5 h-3.5" />
                            {o.driverName}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelected(o)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {next && (
                            <button
                              onClick={() => updateMut.mutate({ id: o.id, newStatus: next.key })}
                              disabled={updateMut.isPending}
                              className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary hover:text-white transition-colors"
                            >
                              <ChevronDown className="w-3 h-3" />
                              {next.label}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      <OrderDetailModal
        order={selected}
        onClose={() => setSelected(null)}
        onStatusUpdate={(id, newStatus) => updateMut.mutate({ id, newStatus })}
        isUpdating={updateMut.isPending}
      />
    </div>
  )
}
