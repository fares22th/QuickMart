import { Link } from 'react-router-dom'
import {
  Package, Truck, Clock, CheckCircle, ChevronLeft,
  MapPin, ShoppingBag,
} from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import { useAuthStore } from '@/store/useAuthStore'
import { useOrderRealtime } from '@/hooks/useOrderRealtime'
import { formatPrice } from '@/utils/formatPrice'

const ACTIVE = ['pending', 'confirmed', 'preparing', 'shipped']

const STATUS = {
  pending:   { label: 'تم استلام طلبك',    sub: 'سيتم تأكيده قريباً',          icon: Clock,       color: '#F59E0B', step: 1 },
  confirmed: { label: 'تم تأكيد طلبك',     sub: 'يُحضَّر الآن في المتجر',       icon: CheckCircle, color: '#3B82F6', step: 2 },
  preparing: { label: 'جاري التحضير',       sub: 'طلبك قيد التجهيز',             icon: Package,     color: '#A855F7', step: 3 },
  shipped:   { label: 'طلبك في الطريق!',   sub: 'المندوب في الطريق إليك 🚴',    icon: Truck,       color: '#00C896', step: 4 },
}

const STEP_LABELS = ['تم الاستلام', 'تم التأكيد', 'جاري التحضير', 'في الطريق', 'تم التوصيل']

function OrderCard({ order }) {
  const info  = STATUS[order.status]
  const Icon  = info.icon
  const pct   = (info.step / 5) * 100

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-lg flex-shrink-0 w-full"
      style={{ background: 'linear-gradient(135deg, #0A2218 0%, #0F3024 60%, #1A4D36 100%)' }}
    >
      {/* Color top bar */}
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${info.color}, ${info.color}66)` }} />

      <div className="p-4">
        {/* Status row */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center relative shrink-0"
              style={{ background: `${info.color}20`, border: `1.5px solid ${info.color}40` }}
            >
              <Icon style={{ width: 20, height: 20, color: info.color }} />
              {(order.status === 'shipped' || order.status === 'preparing') && (
                <span
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping"
                  style={{ background: info.color }}
                />
              )}
            </div>
            <div>
              <p className="text-white font-extrabold text-sm">{info.label}</p>
              <p style={{ color: info.color }} className="text-xs font-medium mt-0.5">{info.sub}</p>
            </div>
          </div>

          <div className="text-left shrink-0">
            <p className="text-white/40 text-[10px]">رقم الطلب</p>
            <p className="text-white font-mono font-bold text-xs">
              #{String(order.id).slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Progress bar + steps */}
        <div className="mb-4">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${info.color}, ${info.color}cc)`,
                boxShadow: `0 0 8px ${info.color}80`,
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {STEP_LABELS.map((s, i) => {
              const done = i < info.step
              return (
                <div key={s} className="flex flex-col items-center gap-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: done ? info.color : 'rgba(255,255,255,0.2)' }}
                  />
                  <span
                    className="text-[9px] font-medium whitespace-nowrap hidden sm:block"
                    style={{ color: done ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.2)' }}
                  >
                    {s}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order details mini */}
        <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2 mb-3">
          <ShoppingBag className="w-4 h-4 text-white/40 shrink-0" />
          <span className="text-xs text-white/50 flex-1 truncate">
            {order.items?.length
              ? order.items.map(i => i.name).join('، ')
              : 'طلبك'}
          </span>
          <span className="text-xs font-bold shrink-0" style={{ color: info.color }}>
            {formatPrice(order.total)}
          </span>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2">
          {order.status === 'shipped' ? (
            <Link
              to={`/track/${order.id}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm"
              style={{ background: info.color, boxShadow: `0 4px 16px ${info.color}50` }}
            >
              <MapPin className="w-4 h-4" />
              تتبع على الخريطة
            </Link>
          ) : (
            <Link
              to={`/order/${order.id}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
              style={{ background: `${info.color}20`, color: info.color, border: `1px solid ${info.color}40` }}
            >
              عرض تفاصيل الطلب
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}

          <Link
            to={`/order/${order.id}`}
            className="px-4 py-3 rounded-xl text-xs font-bold text-white/50 hover:text-white/80 border border-white/10 hover:bg-white/5 transition-all"
          >
            تفاصيل
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ActiveOrdersSection() {
  const { user } = useAuthStore()
  const { data: orders, isLoading } = useOrders()

  const active = (orders ?? []).filter(o => ACTIVE.includes(o.status))

  // 🔔 Real-time updates via Socket.io
  useOrderRealtime(active.map(o => o.id))

  if (!user) return null

  if (isLoading) {
    return (
      <div className="mx-4 mt-4">
        <div className="h-44 rounded-2xl animate-pulse" style={{ background: '#0A2218' }} />
      </div>
    )
  }

  if (!active.length) return null

  return (
    <div className="px-4 py-4" dir="rtl">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#00C896' }}
          />
          <h2 className="font-extrabold text-gray-900 text-base">طلباتك النشطة</h2>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
            style={{ background: '#00C896' }}
          >
            {active.length}
          </span>
        </div>
        <Link
          to="/profile/orders"
          className="flex items-center gap-1 text-sm font-bold"
          style={{ color: '#00C896' }}
        >
          كل الطلبات
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {active.slice(0, 2).map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
        {active.length > 2 && (
          <Link
            to="/profile/orders"
            className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold border-2 border-dashed border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-600 transition-all"
          >
            + {active.length - 2} طلبات أخرى
            <ChevronLeft className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
