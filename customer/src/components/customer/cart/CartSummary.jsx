import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/utils/formatPrice'
import { ShoppingBag, Truck, ArrowLeft, Tag, Lock } from 'lucide-react'

const DELIVERY_FEE = 15

export default function CartSummary() {
  const { items, close } = useCartStore()
  const navigate = useNavigate()

  const subtotal  = items.reduce((s, i) => s + i.price * i.qty, 0)
  const total     = subtotal + DELIVERY_FEE
  const totalQty  = items.reduce((s, i) => s + i.qty, 0)

  const handleCheckout = () => {
    close()
    navigate('/checkout')
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">

      {/* Top accent */}
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #00C896, #00A878, #00C896)' }} />

      <div className="p-5 space-y-4">
        <h3 className="font-extrabold text-base flex items-center gap-2 text-gray-900">
          <ShoppingBag className="w-4 h-4" style={{ color: '#00C896' }} />
          ملخص الطلب
        </h3>

        <div className="space-y-2.5">
          <div className="flex justify-between text-sm text-gray-500">
            <span>المجموع الفرعي ({totalQty} منتج)</span>
            <span className="font-semibold text-gray-800">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 shrink-0" />
              رسوم التوصيل
            </span>
            <span className="font-semibold text-gray-800">{formatPrice(DELIVERY_FEE)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
          <Tag className="w-3.5 h-3.5 shrink-0" />
          يمكنك إضافة كود خصم في صفحة المراجعة
        </div>

        <div className="flex justify-between items-center pt-1 border-t border-gray-100">
          <span className="font-bold text-gray-900">الإجمالي</span>
          <span className="text-2xl font-extrabold" style={{ color: '#00C896' }}>{formatPrice(total)}</span>
        </div>

        {/* MAIN CTA */}
        <button
          onClick={handleCheckout}
          className="w-full py-4 rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-2.5 transition-all active:scale-[0.97] hover:opacity-95"
          style={{
            background: 'linear-gradient(135deg, #00C896 0%, #059669 100%)',
            boxShadow: '0 8px 28px rgba(0,200,150,0.5)',
            letterSpacing: '0.02em',
          }}
        >
          <ShoppingBag className="w-5 h-5" />
          إتمام الطلب
          <ArrowLeft className="w-4 h-4" />
        </button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <Lock className="w-3 h-3" />
          دفع آمن ومشفّر
        </p>
      </div>
    </div>
  )
}
