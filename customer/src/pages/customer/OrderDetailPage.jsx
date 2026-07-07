import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight, Package, MapPin, CreditCard, Banknote,
  Clock, CheckCircle, Truck, XCircle, AlertCircle, Home, Phone,
} from 'lucide-react'
import { useOrder, useCancelOrder } from '@/hooks/useOrders'
import { useSingleOrderRealtime } from '@/hooks/useOrderRealtime'
import StatusPill from '@/components/common/StatusPill'
import { formatDate } from '@/utils/formatDate'
import { formatPrice } from '@/utils/formatPrice'

const STATUS_FLOW = [
  { key: 'pending',   label: 'تم الاستلام',    icon: Clock },
  { key: 'confirmed', label: 'تم التأكيد',     icon: CheckCircle },
  { key: 'preparing', label: 'جاري التحضير',   icon: Package },
  { key: 'shipped',   label: 'في الطريق',       icon: Truck },
  { key: 'delivered', label: 'تم التوصيل',     icon: Home },
]

const STATUS_ORDER = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered']

function OrderTimeline({ status }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 bg-red-50 rounded-2xl p-4">
        <XCircle className="w-6 h-6 text-red-500 shrink-0" />
        <div>
          <p className="font-semibold text-red-700">تم إلغاء الطلب</p>
          <p className="text-sm text-red-400">لم يتم شحن هذا الطلب</p>
        </div>
      </div>
    )
  }

  const currentIdx = STATUS_ORDER.indexOf(status)

  return (
    <div className="space-y-1">
      {STATUS_FLOW.map(({ key, label, icon: Icon }, i) => {
        const done    = i <= currentIdx
        const current = i === currentIdx
        return (
          <div key={key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                done
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-300'
              } ${current ? 'ring-4 ring-primary/20' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              {i < STATUS_FLOW.length - 1 && (
                <div className={`w-0.5 h-6 mt-1 ${i < currentIdx ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
            <div className="pt-1.5 pb-4">
              <p className={`text-sm font-semibold ${done ? 'text-gray-800' : 'text-gray-300'}`}>{label}</p>
              {current && <p className="text-xs text-primary mt-0.5">الحالة الحالية</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function CancelDialog({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" dir="rtl">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">إلغاء الطلب؟</h3>
        <p className="text-sm text-center text-gray-500 mb-6">
          هل أنت متأكد من إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            تراجع
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {loading ? 'جاري الإلغاء...' : 'نعم، إلغاء'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function OrderDetailPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [showCancel, setShowCancel] = useState(false)

  const { data: order, isLoading } = useOrder(id)
  const { mutate: cancelOrder, isPending: cancelling } = useCancelOrder()

  // 🔔 Live order status updates
  useSingleOrderRealtime(id)

  const canCancel = order && ['pending', 'confirmed'].includes(order.status)

  const handleCancel = () => {
    cancelOrder(id, {
      onSuccess: () => { setShowCancel(false); navigate('/profile/orders') },
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 animate-pulse" dir="rtl">
        <div className="h-5 bg-gray-100 rounded w-48 mb-6" />
        <div className="space-y-4">
          {[180, 120, 200, 160].map((h, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm" style={{ height: h }} />
          ))}
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center" dir="rtl">
        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <p className="font-bold text-gray-700 text-lg">الطلب غير موجود</p>
        <Link to="/profile/orders" className="text-primary text-sm mt-2 inline-block hover:underline">
          العودة للطلبات
        </Link>
      </div>
    )
  }

  const subtotal = order.items?.reduce((s, i) => s + i.price * i.qty, 0) ?? order.subtotal ?? 0
  const delivery = order.deliveryFee ?? 15

  return (
    <div className="max-w-2xl mx-auto px-4 py-6" dir="rtl">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link to="/profile/orders" className="hover:text-primary transition-colors flex items-center gap-1">
          <ChevronRight className="w-4 h-4" />
          طلباتي
        </Link>
        <span className="text-gray-600 font-medium">
          طلب #{String(id).slice(-8).toUpperCase()}
        </span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-gray-400 mb-1">{formatDate(order.createdAt)}</p>
          <p className="font-bold text-gray-900 text-lg">
            طلب <span className="font-mono">#{String(id).slice(-8).toUpperCase()}</span>
          </p>
        </div>
        <StatusPill status={order.status} />
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
        <h2 className="font-bold text-gray-900 mb-4">حالة الطلب</h2>
        <OrderTimeline status={order.status} />
        {order.status !== 'cancelled' && order.status !== 'delivered' && (
          <Link
            to={`/track/${id}`}
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors"
          >
            <Truck className="w-4 h-4" />
            تتبع الطلب على الخريطة
          </Link>
        )}
      </div>

      {/* Items */}
      {order.items?.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            المنتجات ({order.items.length})
          </h2>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : <span className="text-xl">📦</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatPrice(item.price)} × {item.qty}
                  </p>
                </div>
                <p className="font-bold text-sm text-gray-900 shrink-0">
                  {formatPrice(item.price * item.qty)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Driver info — appears as soon as driver accepts */}
      {order.driver?.user && ['preparing', 'shipped'].includes(order.status) && (
        <div
          className="rounded-2xl overflow-hidden mb-4 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #022c22 0%, #0a0a0a 100%)', border: '1px solid rgba(0,200,150,0.25)' }}
        >
          {/* Accent bar */}
          <div className="h-1" style={{ background: 'linear-gradient(90deg,#00C896,#059669)' }} />

          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(0,200,150,0.2)' }}
              >
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-emerald-400 text-xs font-bold tracking-wide uppercase">مندوب التوصيل</p>
              <span
                className="mr-auto text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(0,200,150,0.15)', color: '#00C896' }}
              >
                {order.status === 'preparing' ? '🏪 متجه للمتجر' : '🚴 في الطريق إليك'}
              </span>
            </div>

            {/* Driver identity */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: 'rgba(0,200,150,0.15)', border: '1.5px solid rgba(0,200,150,0.3)' }}
              >
                🚴
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-lg leading-tight">
                  {order.driver.user.name ?? 'المندوب'}
                </p>
                {order.driver.user.phone && (
                  <p className="text-white/50 text-sm mt-0.5 font-mono">{order.driver.user.phone}</p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            {order.driver.user.phone && (
              <div className="flex gap-3">
                <a
                  href={`tel:${order.driver.user.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-white text-sm transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #00C896 0%, #059669 100%)',
                    boxShadow: '0 6px 20px rgba(0,200,150,0.4)',
                  }}
                >
                  <Phone className="w-4 h-4" />
                  اتصال بالمندوب
                </a>
                <a
                  href={`https://wa.me/${order.driver.user.phone.replace(/^0/, '966')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
                  style={{ background: 'rgba(37,211,102,0.15)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)' }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  واتساب
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Address */}
      {order.address && (
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            عنوان التوصيل
          </h2>
          <p className="text-sm text-gray-700">
            {[order.address.city, order.address.district, order.address.street]
              .filter(Boolean).join(' - ')}
          </p>
          {order.address.details && (
            <p className="text-xs text-gray-400 mt-1">{order.address.details}</p>
          )}
        </div>
      )}

      {/* Payment + Totals */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-4 space-y-3">
        <h2 className="font-bold text-gray-900">ملخص الدفع</h2>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          {order.paymentMethod === 'cash'
            ? <Banknote className="w-4 h-4 text-green-500" />
            : <CreditCard className="w-4 h-4 text-blue-500" />
          }
          <span>{order.paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان'}</span>
        </div>

        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>المجموع الفرعي</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>الخصم</span>
              <span>- {formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-600">
            <span>التوصيل</span>
            <span>{formatPrice(delivery)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t">
            <span>الإجمالي</span>
            <span className="text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Cancel button */}
      {canCancel && (
        <button
          onClick={() => setShowCancel(true)}
          className="w-full py-3.5 rounded-2xl border border-red-200 bg-red-50 text-red-500 font-semibold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          إلغاء الطلب
        </button>
      )}

      {showCancel && (
        <CancelDialog
          onConfirm={handleCancel}
          onCancel={() => setShowCancel(false)}
          loading={cancelling}
        />
      )}
    </div>
  )
}
