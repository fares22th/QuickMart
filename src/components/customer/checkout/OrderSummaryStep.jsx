import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/useCartStore'
import { useCreateOrder } from '@/hooks/useOrders'
import { formatPrice } from '@/utils/formatPrice'
import { MapPin, CreditCard, Banknote, Package } from 'lucide-react'
import Button from '@/components/common/Button'

const PAYMENT_LABELS = {
  cash:   { label: 'الدفع عند الاستلام', icon: Banknote },
  card:   { label: 'بطاقة ائتمان',        icon: CreditCard },
  apple:  { label: 'Apple Pay',            icon: CreditCard },
  mada:   { label: 'مدى',                  icon: CreditCard },
}

export default function OrderSummaryStep({ address, paymentMethod, onBack }) {
  const navigate = useNavigate()
  const { items, storeId, clearCart } = useCartStore()
  const { mutate: createOrder, isPending } = useCreateOrder()

  const subtotal    = items.reduce((s, i) => s + i.price * i.qty, 0)
  const deliveryFee = 15
  const total       = subtotal + deliveryFee

  const placeOrder = () => {
    createOrder(
      {
        storeId,
        items:         items.map(i => ({ productId: i.id, name: i.name, price: i.price, qty: i.qty })),
        subtotal,
        deliveryFee,
        discount:      0,
        total,
        paymentMethod: paymentMethod ?? 'cash',
        notes:         '',
        address,
      },
      {
        onSuccess: (order) => {
          clearCart()
          navigate(`/order-success?id=${order.id}`)
        },
      }
    )
  }

  const PaymentIcon = PAYMENT_LABELS[paymentMethod]?.icon ?? Banknote
  const paymentLabel = PAYMENT_LABELS[paymentMethod]?.label ?? 'الدفع عند الاستلام'

  return (
    <div className="space-y-4">
      {/* Items */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-green-600" /> مراجعة الطلب
        </h2>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              {item.images?.[0] && (
                <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-gray-500">الكمية: {item.qty}</p>
              </div>
              <p className="font-semibold text-sm shrink-0">{formatPrice(item.price * item.qty)}</p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>المجموع الفرعي</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>رسوم التوصيل</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-1 border-t">
            <span>الإجمالي</span>
            <span className="text-green-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Address */}
      {address && (
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <MapPin className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">عنوان التوصيل</p>
            <p className="text-gray-500 text-sm">
              {[address.city, address.district, address.street, address.details].filter(Boolean).join(' — ')}
            </p>
          </div>
        </div>
      )}

      {/* Payment */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <PaymentIcon className="w-5 h-5 text-green-600 shrink-0" />
        <div>
          <p className="font-semibold text-sm">طريقة الدفع</p>
          <p className="text-gray-500 text-sm">{paymentLabel}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1" disabled={isPending}>
          السابق
        </Button>
        <Button onClick={placeOrder} className="flex-1" loading={isPending} disabled={isPending || !items.length}>
          {isPending ? 'جاري التأكيد...' : 'تأكيد الطلب'}
        </Button>
      </div>
    </div>
  )
}
