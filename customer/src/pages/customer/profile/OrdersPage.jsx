import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronLeft, MapPin, Clock } from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import { useOrderRealtime } from '@/hooks/useOrderRealtime'
import StatusPill from '@/components/common/StatusPill'
import EmptyState from '@/components/common/EmptyState'
import { formatDate } from '@/utils/formatDate'
import { formatPrice } from '@/utils/formatPrice'

const STATUS_TABS = [
  { key: 'all',       label: 'الكل' },
  { key: 'pending',   label: 'قيد الانتظار' },
  { key: 'preparing', label: 'جاري التحضير' },
  { key: 'shipped',   label: 'في الطريق' },
  { key: 'delivered', label: 'مُسلَّم' },
  { key: 'cancelled', label: 'ملغي' },
]

function OrderSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="h-6 bg-gray-100 rounded-full w-20" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-36 mb-3" />
      <div className="flex justify-between items-center pt-3 border-t border-gray-50">
        <div className="h-5 bg-gray-100 rounded w-16" />
        <div className="h-8 bg-gray-100 rounded-xl w-24" />
      </div>
    </div>
  )
}

function OrderCard({ order }) {
  const isActive = ['pending', 'confirmed', 'preparing', 'shipped'].includes(order.status)

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50">
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-3">
        <div>
          <p className="font-bold text-gray-900">
            طلب <span className="font-mono">#{String(order.id).slice(-8).toUpperCase()}</span>
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-gray-400 text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(order.createdAt)}</span>
          </div>
        </div>
        <StatusPill status={order.status} />
      </div>

      {/* Items preview */}
      {order.items?.length > 0 && (
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {order.items.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-2.5 py-1.5">
                {item.image
                  ? <img src={item.image} alt={item.name} className="w-5 h-5 object-cover rounded-lg" />
                  : <Package className="w-4 h-4 text-gray-300" />
                }
                <span className="text-xs text-gray-600 max-w-[80px] truncate">{item.name}</span>
                <span className="text-xs text-gray-400">×{item.qty}</span>
              </div>
            ))}
            {order.items.length > 3 && (
              <span className="text-xs text-gray-400 px-2">+{order.items.length - 3} أخرى</span>
            )}
          </div>
        </div>
      )}

      {/* Address */}
      {order.address && (
        <div className="px-5 pb-3 flex items-center gap-1.5 text-xs text-gray-400">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {[order.address.city, order.address.district].filter(Boolean).join(' - ')}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50 bg-gray-50/50">
        <span className="font-bold text-primary text-lg">{formatPrice(order.total)}</span>
        <div className="flex items-center gap-2">
          {isActive && (
            <Link
              to={`/track/${order.id}`}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl text-primary hover:bg-primary/10 transition-colors"
            >
              تتبع
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          )}
          <Link
            to={`/order/${order.id}`}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors px-2 py-1.5"
          >
            التفاصيل
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all')
  const { data: orders, isLoading } = useOrders()

  // 🔔 Real-time: join rooms for all active orders
  const activeIds = (orders ?? [])
    .filter(o => ['pending','confirmed','preparing','shipped'].includes(o.status))
    .map(o => o.id)
  useOrderRealtime(activeIds)

  const filtered = activeTab === 'all'
    ? (orders ?? [])
    : (orders ?? []).filter(o => o.status === activeTab)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-5">طلباتي</h1>

      {/* Status tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
        {STATUS_TABS.map(tab => {
          const count = tab.key === 'all'
            ? (orders?.length ?? 0)
            : (orders ?? []).filter(o => o.status === tab.key).length
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="shrink-0 flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
              style={activeTab === tab.key
                ? { background: '#00C896', color: '#fff', boxShadow: '0 4px 12px rgba(0,200,150,.3)' }
                : { background: '#f1f5f9', color: '#64748b' }}
            >
              {tab.label}
              {count > 0 && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
                  activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-white text-gray-500'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Orders list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <OrderSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📦"
          title="لا توجد طلبات"
          message={activeTab === 'all' ? 'لم تقم بأي طلب بعد' : 'لا توجد طلبات بهذا الحالة'}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(order => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </div>
  )
}
