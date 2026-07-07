import { Link, useLocation } from 'react-router-dom'
import { CheckCircle, Package, Home } from 'lucide-react'
import Button from '@/components/common/Button'

export default function OrderSuccessPage() {
  const location = useLocation()
  const orderId = location.state?.orderId

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      {/* Success animation */}
      <div className="relative flex justify-center mb-6">
        <div className="w-28 h-28 rounded-full bg-primary-light flex items-center justify-center">
          <CheckCircle className="w-16 h-16 text-primary" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white text-lg animate-bounce">
          🎉
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">تم تأكيد طلبك!</h1>

      {orderId && (
        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 mb-3">
          <span className="text-xs text-gray-500">رقم الطلب:</span>
          <span className="font-bold text-gray-800 font-mono text-sm">#{String(orderId).slice(-8).toUpperCase()}</span>
        </div>
      )}

      <p className="text-gray-500 mb-2">سيتم توصيل طلبك خلال <span className="font-semibold text-gray-700">30 - 60 دقيقة</span></p>
      <p className="text-gray-400 text-sm mb-8">ستصلك رسالة عند تأكيد الطلب من المتجر</p>

      {/* Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[
          { label: 'تم التأكيد', done: true },
          { label: 'جار التحضير', done: false },
          { label: 'في الطريق', done: false },
          { label: 'تم التوصيل', done: false },
        ].map((s, i, arr) => (
          <div key={s.label} className="flex items-center gap-1">
            <div className={`flex flex-col items-center gap-1`}>
              <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold
                ${s.done ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                {s.done ? '✓' : i + 1}
              </div>
              <span className="text-[10px] text-gray-400 whitespace-nowrap">{s.label}</span>
            </div>
            {i < arr.length - 1 && <div className="w-6 h-px bg-gray-200 mb-3" />}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {orderId && (
          <Link to={`/track/${orderId}`}>
            <Button className="w-full flex items-center justify-center gap-2">
              <Package className="w-4 h-4" />
              تتبع الطلب
            </Button>
          </Link>
        )}
        <Link to="/profile/orders">
          <Button variant="outline" className="w-full">
            سجل الطلبات
          </Button>
        </Link>
        <Link to="/">
          <Button variant="ghost" className="w-full flex items-center justify-center gap-2 text-gray-500">
            <Home className="w-4 h-4" />
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    </div>
  )
}
