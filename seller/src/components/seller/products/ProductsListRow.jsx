import { Link } from 'react-router-dom'
import { Edit, Trash2 } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'

export default function ProductsListRow({ product, onDelete }) {
  const hasDiscount = product.comparePrice && product.comparePrice > product.price
  const isLowStock  = product.stock <= 5

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
        {product.image
          ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">📦</div>
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{product.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
      </div>

      <div className="text-left shrink-0">
        <p className="font-bold text-gray-900">{formatPrice(product.price)}</p>
        {hasDiscount && (
          <p className="text-xs text-gray-400 line-through">{formatPrice(product.comparePrice)}</p>
        )}
      </div>

      <div className="shrink-0">
        <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
          isLowStock ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
        }`}>
          {product.stock} {isLowStock ? '⚠️' : ''} وحدة
        </span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Link
          to={`/seller/products/${product.id}/edit`}
          className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-gray-400 transition-colors"
        >
          <Edit className="w-4 h-4" />
        </Link>
        <button
          onClick={() => onDelete?.(product.id)}
          className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
