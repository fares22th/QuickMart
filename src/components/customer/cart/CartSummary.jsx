import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/utils/formatPrice'
import Button from '@/components/common/Button'

const DELIVERY_FEE = 15

export default function CartSummary() {
  const { items } = useCartStore()
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const total = subtotal + DELIVERY_FEE

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
      <h3 className="font-bold text-lg">ملخص الطلب</h3>
      <div className="flex justify-between text-sm text-gray-600">
        <span>المجموع الفرعي</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>رسوم التوصيل</span>
        <span>{formatPrice(DELIVERY_FEE)}</span>
      </div>
      <div className="border-t pt-3 flex justify-between font-bold text-base">
        <span>الإجمالي</span>
        <span className="text-primary">{formatPrice(total)}</span>
      </div>
      <Link to="/checkout">
        <Button className="w-full mt-1">إتمام الطلب</Button>
      </Link>
    </div>
  )
}
