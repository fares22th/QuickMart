import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/utils/formatPrice'
import Button from '@/components/common/Button'

export default function OrderSummaryStep({ onBack }) {
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  const placeOrder = () => {
    clearCart()
    navigate('/order-success')
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="font-bold text-lg">مراجعة الطلب</h2>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.name} x{item.qty}</span>
            <span className="font-medium">{formatPrice(item.price * item.qty)}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-3 flex justify-between font-bold">
        <span>الإجمالي</span>
        <span className="text-primary">{formatPrice(subtotal + 15)}</span>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">السابق</Button>
        <Button onClick={placeOrder} className="flex-1">تأكيد الطلب</Button>
      </div>
    </div>
  )
}
