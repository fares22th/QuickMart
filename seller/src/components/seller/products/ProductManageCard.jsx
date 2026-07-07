import { Link } from 'react-router-dom'
import { Edit, Trash2, AlertTriangle, Package } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'

export default function ProductManageCard({ product, onDelete }) {
  const imgSrc      = product.images?.[0] ?? product.image ?? null
  const hasDiscount = product.comparePrice && product.comparePrice > product.price
  const discount    = hasDiscount
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0
  const isLowStock  = product.stock <= 5
  const isOutOfStock = product.stock === 0

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative h-40" style={{ background: '#F8FAFC' }}>
        {imgSrc
          ? <img src={imgSrc} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#EFF6FF' }}>
                <Package className="w-6 h-6" style={{ color: '#93C5FD' }} />
              </div>
              <span className="text-xs text-gray-400">لا توجد صورة</span>
            </div>
          )
        }
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">نفذت الكمية</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="font-medium text-gray-800 truncate text-sm">{product.name}</p>

        <div className="flex items-baseline gap-2 mt-1">
          <p className="font-bold text-primary">{formatPrice(product.price)}</p>
          {hasDiscount && (
            <p className="text-xs text-gray-400 line-through">{formatPrice(product.comparePrice)}</p>
          )}
        </div>

        <div className={`flex items-center gap-1 mt-1.5 text-xs ${
          isOutOfStock ? 'text-red-500' : isLowStock ? 'text-orange-500' : 'text-gray-400'
        }`}>
          {(isLowStock || isOutOfStock) && <AlertTriangle className="w-3 h-3" />}
          المخزون: {product.stock} {product.unit ?? 'وحدة'}
        </div>

        <div className="flex gap-2 mt-3">
          <Link
            to={`/seller/products/${product.id}/edit`}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-xl text-sm hover:border-primary hover:text-primary transition-colors"
          >
            <Edit className="w-3.5 h-3.5" /> تعديل
          </Link>
          <button
            onClick={() => onDelete?.(product.id)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-xl text-sm hover:border-red-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> حذف
          </button>
        </div>
      </div>
    </div>
  )
}
