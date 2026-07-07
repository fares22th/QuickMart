import { Link } from 'react-router-dom'
import { Package, Truck, Clock, CheckCircle, ChevronLeft, X, Phone } from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import { useAuthStore } from '@/store/useAuthStore'
import { useOrderRealtime } from '@/hooks/useOrderRealtime'
import { useState } from 'react'

const ACTIVE = ['pending', 'confirmed', 'preparing', 'shipped']

const STATUS = {
  pending:   { label: 'تم استلام طلبك',       icon: Clock,        color: '#F59E0B', bg: '#451A03', step: 1 },
  confirmed: { label: 'تم تأكيد طلبك',        icon: CheckCircle,  color: '#3B82F6', bg: '#1E3A5F', step: 2 },
  preparing: { label: 'جاري تحضير طلبك',      icon: Package,      color: '#A855F7', bg: '#2E1065', step: 3 },
  shipped:   { label: '🚴 طلبك في الطريق!',   icon: Truck,        color: '#00C896', bg: '#022c22', step: 4 },
}

const STEPS = ['تم الاستلام', 'تم التأكيد', 'جاري التحضير', 'في الطريق', 'تم التوصيل']

export default function FloatingOrderStatus() {
  const { user } = useAuthStore()
  const { data: orders } = useOrders()
  const [dismissed, setDismissed] = useState(false)

  const active = (orders ?? []).filter(o => ACTIVE.includes(o.status))

  // 🔔 Real-time: join socket rooms for all active orders
  useOrderRealtime(active.map(o => o.id))

  if (!user || dismissed) return null
  if (!active.length) return null

  const order      = active[0]
  const info       = STATUS[order.status]
  const Icon       = info.icon
  const pct        = (info.step / 5) * 100
  const driverName = order.driver?.user?.name
  const driverPhone= order.driver?.user?.phone
  const hasDriver  = !!(driverName && ['preparing', 'shipped'].includes(order.status))

  return (
    <div
      className="fixed bottom-24 right-4 z-50 w-72 rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: `linear-gradient(135deg, ${info.bg} 0%, #0a0a0a 100%)` }}
      dir="rtl"
    >
      {/* Top color accent */}
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${info.color}, ${info.color}88)` }} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            {/* Pulsing icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative"
              style={{ background: `${info.color}20`, border: `1.5px solid ${info.color}40` }}
            >
              <Icon style={{ width: 18, height: 18, color: info.color }} />
              {(order.status === 'preparing' || order.status === 'shipped') && (
                <span
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping"
                  style={{ background: info.color, opacity: 0.6 }}
                />
              )}
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-snug">{info.label}</p>
              {hasDriver ? (
                <p className="text-white/70 text-xs mt-0.5 font-medium">
                  🚴 {driverName}
                </p>
              ) : (
                <p className="text-white/40 text-xs mt-0.5 font-mono">
                  #{String(order.id).slice(-8).toUpperCase()}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="text-white/30 hover:text-white/60 transition-colors shrink-0 mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Driver contact banner — appears immediately when driver accepts */}
        {hasDriver && driverPhone && (
          <a
            href={`tel:${driverPhone}`}
            className="flex items-center gap-2.5 w-full mb-3 px-3 py-2.5 rounded-xl transition-all active:scale-95"
            style={{ background: 'rgba(0,200,150,0.15)', border: '1px solid rgba(0,200,150,0.3)' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'rgba(0,200,150,0.25)' }}
            >
              <Phone className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-emerald-400 text-xs font-bold">اتصل بالمندوب</p>
              <p className="text-white/50 text-xs truncate">{driverPhone}</p>
            </div>
            <div
              className="text-xs font-black px-2.5 py-1 rounded-lg text-white"
              style={{ background: 'linear-gradient(135deg,#00C896,#059669)', boxShadow: '0 2px 8px rgba(0,200,150,0.4)' }}
            >
              اتصال
            </div>
          </a>
        )}

        {/* Progress bar */}
        <div className="mb-2">
          <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${info.color}, ${info.color}bb)` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            {STEPS.map((s, i) => {
              const done = i < info.step
              return (
                <span
                  key={s}
                  className="text-[9px] font-medium"
                  style={{ color: done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)' }}
                >
                  {s}
                </span>
              )
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <Link
            to={`/order/${order.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{ background: `${info.color}25`, color: info.color, border: `1px solid ${info.color}40` }}
          >
            تفاصيل الطلب
            <ChevronLeft className="w-3.5 h-3.5" />
          </Link>

          {order.status === 'shipped' && (
            <Link
              to={`/track/${order.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
              style={{ background: info.color }}
            >
              <Truck className="w-3.5 h-3.5" />
              تتبع
            </Link>
          )}
        </div>

        {/* More active orders */}
        {active.length > 1 && (
          <Link
            to="/profile/orders"
            className="flex items-center justify-center mt-2 text-xs font-medium"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            + {active.length - 1} طلبات أخرى نشطة
          </Link>
        )}
      </div>
    </div>
  )
}
