import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CreditCard, Banknote, Package, Tag, CheckCircle, X, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useCreateOrder } from '@/hooks/useOrders'
import { formatPrice } from '@/utils/formatPrice'

const DELIVERY_FEE = 15

/* ── Mock coupon validation (replace with real API call) ── */
const VALID_COUPONS = {
  'WELCOME10': { discount: 10, type: 'percent', label: 'خصم 10%' },
  'SAVE20':    { discount: 20, type: 'fixed',   label: 'خصم ٢٠ ريال' },
  'FREESHIP':  { discount: DELIVERY_FEE, type: 'shipping', label: 'توصيل مجاني' },
}

function CouponInput({ subtotal, onApply, applied }) {
  const [code,   setCode]   = useState(applied?.code ?? '')
  const [error,  setError]  = useState('')
  const [loading, setLoading] = useState(false)

  const handleApply = () => {
    if (!code.trim()) return
    setLoading(true)
    setTimeout(() => {
      const coupon = VALID_COUPONS[code.trim().toUpperCase()]
      if (coupon) {
        onApply({ code: code.trim().toUpperCase(), ...coupon })
        setError('')
      } else {
        setError('الكوبون غير صحيح أو منتهي الصلاحية')
      }
      setLoading(false)
    }, 600)
  }

  if (applied) {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-green-700">{applied.label}</p>
          <p className="text-xs text-green-500 font-mono">{applied.code}</p>
        </div>
        <button onClick={() => onApply(null)} className="text-green-400 hover:text-green-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-primary transition-colors">
          <Tag className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="أدخل كود الخصم"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleApply()}
            className="flex-1 py-2.5 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent"
            dir="ltr"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
          style={{ background: '#00C896' }}
        >
          {loading ? '...' : 'تطبيق'}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  )
}

export default function OrderSummaryStep({ onBack, address, paymentMethod }) {
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  const { mutate: createOrder, isPending } = useCreateOrder()
  const [coupon, setCoupon] = useState(null)

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  const discountAmt = coupon
    ? coupon.type === 'percent'  ? Math.round(subtotal * coupon.discount / 100)
    : coupon.type === 'fixed'    ? coupon.discount
    : coupon.type === 'shipping' ? DELIVERY_FEE
    : 0
    : 0

  const deliveryFee = coupon?.type === 'shipping' ? 0 : DELIVERY_FEE
  const total       = subtotal + deliveryFee - (coupon?.type !== 'shipping' ? discountAmt : 0)

  const placeOrder = () => {
    // storeId comes from the first cart item (all items should be from one store)
    const storeId = items[0]?.storeId
    const orderData = {
      storeId,
      items: items.map(i => ({ productId: i.id, qty: i.qty })),
      address,          // backend will create address record from this object
      paymentMethod,
      couponCode: coupon?.code ?? undefined,
      notes: address?.details ?? undefined,
    }
    createOrder(orderData, {
      onSuccess: (data) => {
        clearCart()
        navigate('/order-success', { state: { orderId: data?.id ?? null } })
      },
    })
  }

  return (
    <div className="space-y-4" dir="rtl">

      {/* Items */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-primary" />
          الطلب ({items.length} منتج)
        </h2>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                {item.image
                  ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  : <span className="text-xl">📦</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                <p className="text-xs text-gray-400">{formatPrice(item.price)} × {item.qty}</p>
              </div>
              <p className="font-semibold text-sm text-gray-800 shrink-0">
                {formatPrice(item.price * item.qty)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Address */}
      {address && (
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-700">عنوان التوصيل</p>
            <p className="text-sm text-gray-500">
              {[address.city, address.district, address.street].filter(Boolean).join(' - ')}
            </p>
            {address.details && <p className="text-xs text-gray-400 mt-0.5">{address.details}</p>}
          </div>
        </div>
      )}

      {/* Payment */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
        {paymentMethod === 'cash'
          ? <Banknote className="w-5 h-5 text-green-500 shrink-0" />
          : <CreditCard className="w-5 h-5 text-blue-500 shrink-0" />
        }
        <div>
          <p className="text-sm font-semibold text-gray-700">طريقة الدفع</p>
          <p className="text-sm text-gray-500">
            {paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان'}
          </p>
        </div>
      </div>

      {/* Coupon */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          كود الخصم
        </p>
        <CouponInput subtotal={subtotal} onApply={setCoupon} applied={coupon} />
      </div>

      {/* Totals */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>المجموع الفرعي</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>التوصيل</span>
          <span className={coupon?.type === 'shipping' ? 'line-through text-gray-400' : ''}>
            {formatPrice(DELIVERY_FEE)}
          </span>
        </div>
        {coupon && discountAmt > 0 && (
          <div className="flex justify-between text-sm text-green-600 font-medium">
            <span>الخصم ({coupon.label})</span>
            <span>- {formatPrice(discountAmt)}</span>
          </div>
        )}
        {coupon?.type === 'shipping' && (
          <div className="flex justify-between text-sm text-green-600 font-medium">
            <span>توصيل مجاني</span>
            <span>- {formatPrice(DELIVERY_FEE)}</span>
          </div>
        )}
        <div className="border-t pt-3 flex justify-between font-bold text-xl">
          <span>الإجمالي</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">

        {/* ── MAIN CTA: CONFIRM ORDER ── */}
        <button
          onClick={placeOrder}
          disabled={isPending}
          className="w-full rounded-2xl text-white font-extrabold flex items-center justify-center gap-3 transition-all active:scale-[0.97] disabled:opacity-60"
          style={{
            padding: '18px 24px',
            fontSize: '18px',
            background: isPending
              ? 'linear-gradient(135deg, #059669, #047857)'
              : 'linear-gradient(135deg, #00C896 0%, #059669 100%)',
            boxShadow: isPending ? 'none' : '0 10px 35px rgba(0,200,150,0.55)',
            letterSpacing: '0.02em',
          }}
        >
          {isPending ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
              جاري تأكيد الطلب...
            </>
          ) : (
            <>
              <CheckCircle className="w-6 h-6 shrink-0" />
              تأكيد الطلب
              <span className="bg-white/20 px-3 py-1 rounded-xl text-base font-extrabold">
                {formatPrice(total)}
              </span>
            </>
          )}
        </button>

        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          className="w-full py-3.5 rounded-2xl text-sm font-bold border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <ChevronRight className="w-4 h-4" />
          السابق — تعديل طريقة الدفع
        </button>
      </div>
    </div>
  )
}
