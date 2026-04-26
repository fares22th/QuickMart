import { Link } from 'react-router-dom'
import { useOrders } from '@/hooks/useOrders'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelOrder } from '@/api/orders.api'
import { toast } from 'sonner'
import { formatDate, fromNow } from '@/utils/formatDate'
import { formatPrice } from '@/utils/formatPrice'
import { Package, ChevronLeft, RotateCcw } from 'lucide-react'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'

const STATUS_META = {
  pending:    { label: 'في الانتظار',    bg: 'bg-yellow-50',  text: 'text-yellow-700',  dot: 'bg-yellow-400' },
  confirmed:  { label: 'مؤكد',           bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500'   },
  preparing:  { label: 'قيد التحضير',   bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-400' },
  shipped:    { label: 'في الطريق',      bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-500' },
  delivered:  { label: 'تم التوصيل',    bg: 'bg-green-50',   text: 'text-green-700',   dot: 'bg-green-500'  },
  cancelled:  { label: 'ملغى',           bg: 'bg-gray-50',    text: 'text-gray-500',    dot: 'bg-gray-400'   },
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.pending
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${m.bg} ${m.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  )
}

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useOrders()
  const qc = useQueryClient()

  const { mutate: doCancel, isPending: cancelling } = useMutation({
    mutationFn: (id) => cancelOrder(id),
    onSuccess: () => {
      toast.success('تم إلغاء الطلب')
      qc.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: () => toast.error('تعذّر إلغاء الطلب'),
  })

  if (isLoading) return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse space-y-3">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-100 rounded w-32" />
            <div className="h-6 bg-gray-100 rounded-full w-20" />
          </div>
          <div className="h-4 bg-gray-100 rounded w-24" />
          <div className="h-5 bg-gray-100 rounded w-28" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">طلباتي</h1>

      {!orders.length ? (
        <EmptyState
          message="لا توجد طلبات بعد"
          description="ابدأ التسوق وستظهر طلباتك هنا"
        />
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const storeLogo = order.seller_stores?.logo_url
            const storeName = order.seller_stores?.name ?? 'متجر'
            const canCancel = ['pending', 'confirmed'].includes(order.status)

            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Status strip */}
                <div className={`h-1 w-full ${STATUS_META[order.status]?.dot.replace('bg-', 'bg-') ?? 'bg-gray-200'}`} />

                <div className="p-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      {storeLogo
                        ? <img src={storeLogo} alt="" className="w-9 h-9 rounded-xl object-cover" />
                        : <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                      }
                      <div>
                        <p className="font-bold text-sm">{storeName}</p>
                        <p className="text-xs text-gray-400">
                          طلب #{order.id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Items summary */}
                  {order.order_items?.length > 0 && (
                    <p className="text-xs text-gray-500 mb-3 truncate">
                      {order.order_items.map(i => `${i.name} ×${i.quantity}`).join(' · ')}
                    </p>
                  )}

                  {/* Footer row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-base text-green-600">{formatPrice(order.total)}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{fromNow(order.created_at)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {canCancel && (
                        <button
                          onClick={() => doCancel(order.id)}
                          disabled={cancelling}
                          className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
                        >
                          <RotateCcw className="w-3 h-3" /> إلغاء
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <Link to={`/track/${order.id}`}
                          className="flex items-center gap-1.5 text-xs text-green-600 font-bold bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-xl transition-colors">
                          تتبع <ChevronLeft className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
