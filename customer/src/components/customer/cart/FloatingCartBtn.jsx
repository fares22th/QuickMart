import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '@/utils/formatPrice'

export default function FloatingCartBtn() {
  const { items, open } = useCartStore()
  const navigate = useNavigate()
  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const subtotal   = items.reduce((s, i) => s + i.price * i.qty, 0)

  if (!totalItems) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
      {/* View cart */}
      <button
        onClick={open}
        className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white font-bold text-sm transition-all active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #00C896 0%, #00A878 100%)',
          boxShadow: '0 10px 30px rgba(0,200,150,0.5)',
        }}
      >
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0"
          style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}
        >
          {totalItems}
        </span>
        <ShoppingCart className="w-4 h-4" />
        <span>سلتي</span>
        <span className="font-extrabold">{formatPrice(subtotal)}</span>
      </button>

      {/* Go to checkout */}
      <button
        onClick={() => navigate('/checkout')}
        className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl text-white font-extrabold text-sm transition-all active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          boxShadow: '0 10px 30px rgba(5,150,105,0.45)',
        }}
      >
        اشتر الآن
        <ArrowLeft className="w-4 h-4" />
      </button>
    </div>
  )
}
