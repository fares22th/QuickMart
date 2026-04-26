import { Tag, Trash2 } from 'lucide-react'
import { formatDate } from '@/utils/formatDate'

export default function CouponCard({ coupon, onDelete }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border-dashed border-2 border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-seller" />
          <span className="font-bold text-lg tracking-widest">{coupon.code}</span>
        </div>
        <button onClick={() => onDelete?.(coupon.id)} className="text-red-400 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        خصم {coupon.type === 'percent' ? `${coupon.value}%` : `${coupon.value} ر.س`}
      </p>
      {coupon.expiresAt && (
        <p className="text-xs text-gray-400 mt-1">ينتهي: {formatDate(coupon.expiresAt)}</p>
      )}
    </div>
  )
}
