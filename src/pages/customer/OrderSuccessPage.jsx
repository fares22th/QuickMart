import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import Button from '@/components/common/Button'

export default function OrderSuccessPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <CheckCircle className="w-20 h-20 text-primary mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">تم تأكيد طلبك!</h1>
      <p className="text-gray-500 mb-8">سيتم توصيل طلبك خلال 30-60 دقيقة</p>
      <div className="flex flex-col gap-3">
        <Link to="/profile/orders">
          <Button className="w-full">تتبع الطلب</Button>
        </Link>
        <Link to="/">
          <Button variant="outline" className="w-full">العودة للرئيسية</Button>
        </Link>
      </div>
    </div>
  )
}
