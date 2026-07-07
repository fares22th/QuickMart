import { Tag, Trash2, Power, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/utils/formatDate'

export default function CouponCard({ coupon, onDelete, onToggle }) {
  const isActive  = coupon.active !== false
  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date()

  const copyCode = () => {
    navigator.clipboard.writeText(coupon.code)
    toast.success('تم نسخ الكود')
  }

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border-2 border-dashed transition-all ${
      isExpired ? 'border-gray-100 opacity-60' :
      isActive  ? 'border-primary/30' : 'border-gray-100'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isActive ? 'bg-primary/10' : 'bg-gray-100'
          }`}>
            <Tag className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-widest text-gray-900">{coupon.code}</span>
              <button onClick={copyCode} className="text-gray-400 hover:text-gray-600 transition-colors">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            {isExpired && <span className="text-xs text-red-500">منتهي الصلاحية</span>}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onToggle && (
            <button
              onClick={onToggle}
              title={isActive ? 'تعطيل' : 'تفعيل'}
              className={`p-1.5 rounded-lg transition-colors ${
                isActive ? 'hover:bg-orange-50 hover:text-orange-500 text-gray-400' : 'hover:bg-green-50 hover:text-green-600 text-gray-400'
              }`}
            >
              <Power className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-gray-700">
          خصم {coupon.type === 'percent' ? `${coupon.value}%` : `${coupon.value} ر.س`}
        </p>

        {coupon.minOrder > 0 && (
          <p className="text-xs text-gray-400">
            الحد الأدنى للطلب: {coupon.minOrder} ر.س
          </p>
        )}

        {coupon.maxUses && (
          <p className="text-xs text-gray-400">
            الاستخدامات: {coupon.usedCount ?? 0} / {coupon.maxUses}
          </p>
        )}

        {coupon.expiresAt && (
          <p className={`text-xs ${isExpired ? 'text-red-400' : 'text-gray-400'}`}>
            ينتهي: {formatDate(coupon.expiresAt)}
          </p>
        )}
      </div>

      {/* Status badge */}
      <div className="mt-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          isExpired ? 'bg-red-50 text-red-500' :
          isActive  ? 'bg-green-50 text-green-600' :
                      'bg-gray-100 text-gray-500'
        }`}>
          {isExpired ? 'منتهي' : isActive ? 'نشط' : 'معطّل'}
        </span>
      </div>
    </div>
  )
}
