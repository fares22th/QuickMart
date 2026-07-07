import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Package, Clock, MapPin, CheckCircle, Zap, ChevronLeft, Phone, Store } from 'lucide-react'
import { toast } from 'sonner'
import { getAvailableOrders, getMe, acceptOrder, setAvailability } from '@/api/driver.api'
import { useDriverStore } from '@/store/useDriverStore'
import { useDriverSocket } from '@/hooks/useDriverSocket'

const STATUS_LABELS = {
  preparing: { label: 'جاهز للاستلام', color: '#F97316' },
  shipped:   { label: 'في الطريق',      color: '#22C55E' },
}

function formatPrice(n) {
  return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(n ?? 0)
}

function OrderCard({ order, onAccept, accepting }) {
  const items = order.items?.slice(0, 2) ?? []
  const more  = (order.items?.length ?? 0) - 2

  return (
    <div
      className="rounded-3xl overflow-hidden slide-up"
      style={{ background: '#1C1009', border: '1px solid #2E1A00' }}
    >
      {/* Top accent */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #F97316, #EA580C)' }} />

      <div className="p-4">
        {/* Store info */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: '#2E1A00' }}
            >
              {order.store?.logo
                ? <img src={order.store.logo} alt="" className="w-full h-full object-cover rounded-2xl" />
                : <Store className="w-5 h-5 text-orange-400" />
              }
            </div>
            <div>
              <p className="font-bold text-white text-sm">{order.store?.storeName}</p>
              <p className="text-gray-500 text-xs mt-0.5">{order.store?.city ?? order.store?.address ?? '—'}</p>
            </div>
          </div>
          <span className="text-orange-400 font-black text-base">{formatPrice(order.total)}</span>
        </div>

        {/* Items */}
        {items.length > 0 && (
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {items.map((item, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-xl text-gray-300"
                style={{ background: '#2E1A00' }}
              >
                {item.name} ×{item.qty}
              </span>
            ))}
            {more > 0 && <span className="text-xs text-gray-500">+{more} أخرى</span>}
          </div>
        )}

        {/* Address */}
        {order.address && (
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="text-gray-400 text-xs">
              {[order.address.city, order.address.district, order.address.street].filter(Boolean).join(' - ')}
            </span>
          </div>
        )}

        {/* Accept button */}
        <button
          onClick={() => onAccept(order.id)}
          disabled={accepting}
          className="w-full py-3.5 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
          style={{
            background: accepting ? '#7C3D00' : 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
            boxShadow: accepting ? 'none' : '0 8px 24px rgba(249,115,22,0.45)',
          }}
        >
          <Zap className="w-4 h-4" />
          {accepting ? 'جاري القبول...' : 'قبول الطلب'}
        </button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const navigate   = useNavigate()
  const qc         = useQueryClient()
  const user       = useDriverStore(s => s.user)
  const [acceptingId, setAcceptingId] = useState(null)

  useDriverSocket()

  const { data: me } = useQuery({ queryKey: ['driver-me'], queryFn: getMe, refetchInterval: 30_000 })

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['available-orders'],
    queryFn:  getAvailableOrders,
    refetchInterval: me?.isAvailable ? 15_000 : false,
    enabled: !!me?.isAvailable,
  })

  const availMut = useMutation({
    mutationFn: setAvailability,
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['driver-me'] }),
  })

  const acceptMut = useMutation({
    mutationFn: acceptOrder,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['available-orders'] })
      qc.invalidateQueries({ queryKey: ['active-order'] })
      qc.invalidateQueries({ queryKey: ['driver-me'] })
      toast('✅ تم قبول الطلب!', { style: { color: '#22C55E' } })
      navigate('/active-order')
    },
    onError: (err) => {
      toast(err.response?.data?.error ?? 'تعذر قبول الطلب', { style: { color: '#EF4444' } })
    },
    onSettled: () => setAcceptingId(null),
  })

  const handleAccept = (id) => {
    setAcceptingId(id)
    acceptMut.mutate(id)
  }

  const isOnline = me?.isAvailable ?? false

  return (
    <div className="flex flex-col min-h-dvh pb-24" dir="rtl" style={{ background: '#0F0800' }}>
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{ background: 'linear-gradient(160deg, #1A0900 0%, #0F0800 100%)' }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-gray-400 text-sm">مرحباً،</p>
            <h1 className="text-xl font-black text-white">{user?.name ?? 'المندوب'}</h1>
          </div>

          {/* Online toggle */}
          <button
            onClick={() => availMut.mutate(!isOnline)}
            disabled={availMut.isPending}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
            style={{
              background: isOnline ? '#062E1A' : '#1C1009',
              border: `1px solid ${isOnline ? '#22C55E40' : '#2E1A00'}`,
              color: isOnline ? '#22C55E' : '#6B7280',
              boxShadow: isOnline ? '0 4px 16px rgba(34,197,94,0.2)' : 'none',
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: isOnline ? '#22C55E' : '#6B7280', boxShadow: isOnline ? '0 0 8px #22C55E' : 'none' }}
            />
            {isOnline ? 'أنت متاح' : 'غير متاح'}
          </button>
        </div>

        {/* Active order alert */}
        {me?.activeOrder && (
          <button
            onClick={() => navigate('/active-order')}
            className="w-full rounded-2xl p-4 flex items-center justify-between mb-2 transition-all active:scale-98"
            style={{ background: '#062E1A', border: '1px solid #22C55E40' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#0A4D2A' }}>
                <Package className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-right">
                <p className="font-bold text-green-400 text-sm">لديك طلب نشط</p>
                <p className="text-gray-400 text-xs">
                  {me.activeOrder.store?.storeName} — {STATUS_LABELS[me.activeOrder.status]?.label}
                </p>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-green-400" />
          </button>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            { label: 'التوصيلات الكلية', value: me?.deliveriesCount ?? 0, icon: CheckCircle, color: '#22C55E' },
            { label: 'طلبات متاحة',      value: orders.length,            icon: Package,     color: '#F97316' },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: '#1C1009', border: '1px solid #2E1A00' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${s.color}20` }}
              >
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-gray-500 text-xs">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders section */}
      <div className="flex-1 px-5 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-white text-base">الطلبات المتاحة</h2>
          {orders.length > 0 && (
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: '#F9731620', color: '#F97316' }}
            >
              {orders.length} طلب
            </span>
          )}
        </div>

        {!isOnline ? (
          <div className="text-center py-16">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-4"
              style={{ background: '#1C1009', border: '1px solid #2E1A00' }}
            >
              <Zap className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 font-bold">أنت غير متاح</p>
            <p className="text-gray-600 text-sm mt-1">فعّل حالة التوفر لاستقبال الطلبات</p>
            <button
              onClick={() => availMut.mutate(true)}
              className="mt-4 px-6 py-3 rounded-2xl font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)', boxShadow: '0 8px 24px rgba(249,115,22,0.4)' }}
            >
              تفعيل الآن
            </button>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="rounded-3xl p-4 animate-pulse" style={{ background: '#1C1009', height: 160 }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-4"
              style={{ background: '#1C1009', border: '1px solid #2E1A00' }}
            >
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 font-bold">لا توجد طلبات الآن</p>
            <p className="text-gray-600 text-sm mt-1">ستظهر الطلبات هنا عند توفرها</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(o => (
              <OrderCard
                key={o.id}
                order={o}
                onAccept={handleAccept}
                accepting={acceptingId === o.id && acceptMut.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
