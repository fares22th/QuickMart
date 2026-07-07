import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/useCartStore'
import CartItem from '@/components/customer/cart/CartItem'
import CartSummary from '@/components/customer/cart/CartSummary'
import EmptyState from '@/components/common/EmptyState'
import { ShoppingBag, Trash2, ChevronRight, ArrowLeft } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'

const DELIVERY_FEE = 15

export default function CartPage() {
  const { items, clearCart } = useCartStore()
  const navigate = useNavigate()
  const totalQty = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const total = subtotal + DELIVERY_FEE

  if (!items.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center" dir="rtl">
        <div className="w-24 h-24 mx-auto mb-5 rounded-3xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(0,200,150,0.1), rgba(0,200,150,0.05))' }}>
          <ShoppingBag className="w-12 h-12" style={{ color: '#00C896', opacity: 0.5 }} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">سلة التسوق فارغة</h2>
        <p className="text-gray-400 text-sm mb-7">لم تُضف أي منتجات بعد، ابدأ التسوق الآن!</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #00C896, #00A878)', boxShadow: '0 8px 20px rgba(0,200,150,0.3)' }}
        >
          <ShoppingBag className="w-4 h-4" />
          تسوق الآن
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-36 lg:pb-8" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">سلة التسوق</h1>
            <p className="text-sm text-gray-400 mt-0.5">{totalQty} منتج</p>
          </div>
        </div>
        <button
          onClick={() => { if (window.confirm('هل تريد إفراغ السلة كاملاً؟')) clearCart() }}
          className="flex items-center gap-1.5 text-sm font-semibold text-red-400 hover:text-red-600 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
          إفراغ السلة
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Items */}
        <div className="flex-1 space-y-3">
          {items.map(item => <CartItem key={item.id} item={item} />)}

          {/* Continue shopping */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-semibold border-2 border-dashed border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-600 transition-all mt-2"
          >
            <ChevronRight className="w-4 h-4" />
            متابعة التسوق
          </Link>
        </div>

        {/* Summary (desktop) */}
        <div className="w-full lg:w-80 shrink-0">
          <CartSummary />
        </div>
      </div>

      {/* ── Sticky mobile checkout bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white p-4"
        style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.12)' }}>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <p className="text-xs text-gray-400">{totalQty} منتج في سلتك</p>
            <p className="font-extrabold text-lg" style={{ color: '#00C896' }}>{formatPrice(total)}</p>
          </div>
          <p className="text-xs text-gray-400 text-left">
            شاملاً التوصيل<br/>
            <span className="font-semibold text-gray-500">{formatPrice(DELIVERY_FEE)}</span>
          </p>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full rounded-2xl text-white font-extrabold text-lg flex items-center justify-center gap-2.5 active:scale-[0.97] transition-all"
          style={{
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #00C896 0%, #059669 100%)',
            boxShadow: '0 10px 30px rgba(0,200,150,0.5)',
          }}
        >
          <ShoppingBag className="w-5 h-5" />
          إتمام الطلب — {formatPrice(total)}
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
