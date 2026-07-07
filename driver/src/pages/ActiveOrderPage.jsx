import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  MapPin, Phone, Package, CheckCircle,
  Navigation, Store, User, AlertTriangle, X,
} from 'lucide-react'
import { toast } from 'sonner'
import { getActiveOrder, updateOrderStatus } from '@/api/driver.api'
import { useLocationBroadcast } from '@/hooks/useLocationBroadcast'

function fmt(n) {
  return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(n ?? 0)
}

/* ── Confirmation bottom-sheet ─────────────────────────── */
function ConfirmSheet({ config, onConfirm, onCancel, loading }) {
  if (!config) return null
  return (
    <div
      className="fixed inset-0 flex flex-col justify-end"
      style={{ zIndex: 200, background: 'rgba(0,0,0,0.7)' }}
      onClick={onCancel}
    >
      <div
        className="rounded-t-3xl p-6 pb-10"
        style={{ background: '#1C1009', border: '1px solid #2E1A00' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{ background: `${config.color}20`, border: `2px solid ${config.color}40` }}
          >
            {config.emoji}
          </div>
        </div>

        <h2 className="text-white font-black text-xl text-center mb-2">{config.title}</h2>
        <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">{config.desc}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-4 rounded-2xl font-bold text-gray-400 text-sm"
            style={{ background: '#2E1A00', border: '1px solid #3D2200' }}
          >
            تراجع
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-4 rounded-2xl font-black text-white text-sm transition-all active:scale-95 disabled:opacity-60"
            style={{
              background: loading ? '#2E1A00' : `linear-gradient(135deg, ${config.color}, ${config.colorEnd})`,
              boxShadow: loading ? 'none' : `0 8px 24px ${config.color}55`,
            }}
          >
            {loading ? 'جاري التحديث...' : config.btnLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Step indicator bar ────────────────────────────────── */
const STEPS = [
  { label: 'قبول الطلب', emoji: '✅' },
  { label: 'استلام من المتجر', emoji: '📦' },
  { label: 'تسليم للزبون', emoji: '🏠' },
]

function StepBar({ status }) {
  // 0 = accepted (preparing), 1 = picked up (shipped), 2 = delivered
  const step = status === 'delivered' ? 2 : status === 'shipped' ? 1 : 0

  return (
    <div className="flex items-start px-4 pt-4 pb-2 gap-0">
      {STEPS.map((s, i) => {
        const done    = i < step
        const current = i === step
        return (
          <div key={s.label} className="flex items-start" style={{ flex: i < 2 ? 1 : 'initial' }}>
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300"
                style={{
                  background: done
                    ? 'linear-gradient(135deg,#22C55E,#16A34A)'
                    : current
                      ? 'linear-gradient(135deg,#F97316,#EA580C)'
                      : '#1C1009',
                  border: done
                    ? '2px solid #22C55E60'
                    : current
                      ? '2px solid #F9731660'
                      : '2px solid #2E1A00',
                  boxShadow: current ? '0 0 14px rgba(249,115,22,0.5)' : 'none',
                  color: done || current ? '#fff' : '#4B5563',
                }}
              >
                {done ? '✓' : s.emoji}
              </div>
              <span
                className="text-center leading-tight"
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: done ? '#22C55E' : current ? '#F97316' : '#4B5563',
                  maxWidth: 64,
                }}
              >
                {s.label}
              </span>
            </div>
            {i < 2 && (
              <div
                className="flex-1 h-0.5 mt-4 mx-1 transition-all duration-500"
                style={{ background: done ? '#22C55E' : '#2E1A00' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Main page ─────────────────────────────────────────── */
const CONFIRM_CONFIGS = {
  shipped: {
    emoji:    '📦',
    color:    '#F97316',
    colorEnd: '#EA580C',
    title:    'استلمت الطلب؟',
    desc:     'تأكيد أنك استلمت الطلب من المتجر وأنت الآن في طريقك للزبون',
    btnLabel: 'نعم، استلمت الطلب',
  },
  delivered: {
    emoji:    '🏠',
    color:    '#22C55E',
    colorEnd: '#16A34A',
    title:    'تم التسليم للزبون؟',
    desc:     'تأكيد أنك سلّمت الطلب للزبون بنجاح وأن الطلب مكتمل',
    btnLabel: 'نعم، تم التسليم',
  },
}

export default function ActiveOrderPage() {
  const navigate = useNavigate()
  const qc       = useQueryClient()
  const [confirmFor, setConfirmFor] = useState(null) // 'shipped' | 'delivered'

  const { data: order, isLoading } = useQuery({
    queryKey:      ['active-order'],
    queryFn:       getActiveOrder,
    refetchInterval: 20_000,
  })

  // Broadcast GPS to customer in real-time
  useLocationBroadcast(order?.id)

  const statusMut = useMutation({
    mutationFn: (status) => updateOrderStatus(order.id, status),
    onSuccess: (_, status) => {
      setConfirmFor(null)
      qc.invalidateQueries({ queryKey: ['active-order'] })
      qc.invalidateQueries({ queryKey: ['driver-me'] })

      if (status === 'delivered') {
        qc.invalidateQueries({ queryKey: ['order-history'] })
        qc.invalidateQueries({ queryKey: ['available-orders'] })
        toast('🎉 تم تسليم الطلب! +10 ر.س', {
          duration: 5000,
          style: { background: '#022c22', color: '#22C55E', border: '1px solid #22C55E40', borderRadius: 16, fontWeight: 700, direction: 'rtl' },
        })
        navigate('/', { replace: true })
      } else {
        toast('🚴 الطلب معك — توجّه للزبون الآن', {
          style: { background: '#022c22', color: '#22C55E', border: '1px solid #22C55E40', borderRadius: 16, fontWeight: 700, direction: 'rtl' },
        })
      }
    },
    onError: (err) => {
      setConfirmFor(null)
      toast(err.response?.data?.error ?? 'حدث خطأ، حاول مجدداً', {
        style: { background: '#1a0000', color: '#EF4444', borderRadius: 16, direction: 'rtl' },
      })
    },
  })

  const openMap = (addr) => {
    if (!addr) return
    const q = encodeURIComponent([addr.street, addr.district, addr.city].filter(Boolean).join(' '))
    window.open(`https://maps.google.com?q=${q}`, '_blank')
  }

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: '#0F0800' }}>
        <div className="w-12 h-12 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  /* ── No active order ── */
  if (!order) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-5 text-center" dir="rtl" style={{ background: '#0F0800' }}>
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 text-4xl" style={{ background: '#1C1009', border: '1px solid #2E1A00' }}>
          📦
        </div>
        <h2 className="text-white font-black text-xl mb-2">لا يوجد طلب نشط</h2>
        <p className="text-gray-500 text-sm mb-6">اقبل طلباً من الشاشة الرئيسية</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 rounded-2xl font-bold text-white"
          style={{ background: 'linear-gradient(135deg,#F97316,#EA580C)', boxShadow: '0 8px 24px rgba(249,115,22,0.4)' }}
        >
          العودة للرئيسية
        </button>
      </div>
    )
  }

  const isPrep = order.status === 'preparing'
  const isShip = order.status === 'shipped'

  /* ── Main UI ── */
  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#0F0800', paddingBottom: 'calc(160px + env(safe-area-inset-bottom))' }} dir="rtl">

      {/* ── Header ── */}
      <div style={{ background: 'linear-gradient(160deg,#1A0900 0%,#0F0800 100%)', borderBottom: '1px solid #2E1A00' }}>
        {/* Title row */}
        <div className="flex items-center gap-3 px-5 pt-12 pb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
            style={{ background: isShip ? '#06201A' : '#2E1A00' }}
          >
            {isShip ? '🚴' : '📦'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-white text-base">طلب #{order.id.slice(-6).toUpperCase()}</p>
            <p className="text-sm font-bold" style={{ color: isShip ? '#22C55E' : '#F97316' }}>
              {isShip ? 'في الطريق إلى الزبون' : 'في انتظار الاستلام من المتجر'}
            </p>
          </div>
          <span
            className="font-black text-base shrink-0"
            style={{ color: isShip ? '#22C55E' : '#F97316' }}
          >
            {fmt(order.total)}
          </span>
        </div>

        {/* Step progress */}
        <StepBar status={order.status} />
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-5 pt-4 space-y-3">

        {/* Store card — highlighted when preparing */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: '#1C1009',
            border: `1px solid ${isPrep ? '#F9731640' : '#2E1A00'}`,
            boxShadow: isPrep ? '0 0 20px rgba(249,115,22,0.15)' : 'none',
          }}
        >
          <div className="h-0.5" style={{ background: isPrep ? 'linear-gradient(90deg,#F97316,#EA580C)' : '#2E1A00' }} />
          <div className="p-4">
            {isPrep && (
              <div
                className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}
              >
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <p className="text-orange-400 text-xs font-bold">توجّه للمتجر واستلم الطلب</p>
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center" style={{ background: '#2E1A00' }}>
                  {order.store?.logo
                    ? <img src={order.store.logo} alt="" className="w-full h-full object-cover" />
                    : <Store className="w-5 h-5 text-orange-400" />
                  }
                </div>
                <div>
                  <p className="font-bold text-white">{order.store?.storeName}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{order.store?.address ?? order.store?.city ?? '—'}</p>
                </div>
              </div>
              {order.store?.phone && (
                <a
                  href={`tel:${order.store.phone}`}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: '#2E1A00' }}
                >
                  <Phone className="w-4 h-4 text-orange-400" />
                </a>
              )}
            </div>

            <button
              onClick={() => openMap({ city: order.store?.city, street: order.store?.address })}
              className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-95"
              style={{ background: '#2E1A00', color: '#F97316' }}
            >
              <Navigation className="w-4 h-4" />
              الاتجاه للمتجر
            </button>
          </div>
        </div>

        {/* Customer card — highlighted when shipped */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: '#1C1009',
            border: `1px solid ${isShip ? '#22C55E40' : '#2E1A00'}`,
            boxShadow: isShip ? '0 0 20px rgba(34,197,94,0.15)' : 'none',
          }}
        >
          <div className="h-0.5" style={{ background: isShip ? 'linear-gradient(90deg,#22C55E,#16A34A)' : '#2E1A00' }} />
          <div className="p-4">
            {isShip && (
              <div
                className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-green-400 text-xs font-bold">توجّه للزبون وسلّم الطلب</p>
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#06201A' }}>
                  <User className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-bold text-white">{order.customer?.name ?? 'الزبون'}</p>
                  {order.address && (
                    <p className="text-gray-500 text-xs mt-0.5">
                      {[order.address.city, order.address.district, order.address.street].filter(Boolean).join(' - ')}
                    </p>
                  )}
                </div>
              </div>
              {order.customer?.phone && (
                <a
                  href={`tel:${order.customer.phone}`}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: '#06201A' }}
                >
                  <Phone className="w-4 h-4 text-green-400" />
                </a>
              )}
            </div>

            <button
              onClick={() => openMap(order.address)}
              className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-95"
              style={{ background: '#06201A', color: '#22C55E' }}
            >
              <MapPin className="w-4 h-4" />
              الاتجاه للزبون
            </button>
          </div>
        </div>

        {/* Order items */}
        {order.items?.length > 0 && (
          <div className="rounded-3xl p-4" style={{ background: '#1C1009', border: '1px solid #2E1A00' }}>
            <p className="font-bold text-white mb-3 flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-orange-400" />
              محتويات الطلب ({order.items.length} منتجات)
            </p>
            <div className="space-y-2.5">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                      style={{ background: '#2E1A00', color: '#F97316' }}
                    >
                      {item.qty}
                    </span>
                    <span className="text-gray-300 text-sm">{item.name}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{fmt(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-3 mt-3 border-t border-gray-800/60">
              <span className="text-gray-400 text-sm">الإجمالي</span>
              <span className="font-black text-orange-400">{fmt(order.total)}</span>
            </div>
          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════
          MAIN ACTION BUTTONS — fixed at bottom
          Two states only: preparing → shipped → delivered
          ══════════════════════════════════════════ */}
      <div
        className="fixed left-0 right-0 px-5 pt-4 pb-4"
        style={{
          bottom: 'calc(72px + env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top,#0F0800 60%,transparent)',
          zIndex: 50,
        }}
      >
        {/* ── preparing: استلمت الطلب من المتجر ── */}
        {isPrep && (
          <button
            onClick={() => setConfirmFor('shipped')}
            className="w-full py-5 rounded-2xl font-black text-white text-lg flex items-center justify-center gap-3 transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg,#F97316 0%,#EA580C 100%)',
              boxShadow: '0 12px 35px rgba(249,115,22,0.55)',
            }}
          >
            <span className="text-2xl">📦</span>
            استلمت الطلب من المتجر
          </button>
        )}

        {/* ── shipped: تم التسليم للزبون ── */}
        {isShip && (
          <button
            onClick={() => setConfirmFor('delivered')}
            className="w-full py-5 rounded-2xl font-black text-white text-lg flex items-center justify-center gap-3 transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg,#22C55E 0%,#16A34A 100%)',
              boxShadow: '0 12px 35px rgba(34,197,94,0.55)',
            }}
          >
            <span className="text-2xl">🏠</span>
            تم التسليم للزبون
          </button>
        )}
      </div>

      {/* ── Confirmation sheet ── */}
      <ConfirmSheet
        config={confirmFor ? CONFIRM_CONFIGS[confirmFor] : null}
        onConfirm={() => statusMut.mutate(confirmFor)}
        onCancel={() => setConfirmFor(null)}
        loading={statusMut.isPending}
      />

    </div>
  )
}
