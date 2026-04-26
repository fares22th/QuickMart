import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/utils/formatPrice'

export default function FloatingCartBtn() {
  const { items, open } = useCartStore()
  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  if (!totalItems) return null

  return (
    <button
      onClick={open}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-30 hover:bg-primary-dark transition-colors"
    >
      <span className="bg-white text-primary text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
        {totalItems}
      </span>
      <span className="font-semibold">عرض السلة</span>
      <span className="font-bold">{formatPrice(subtotal)}</span>
    </button>
  )
}
