import { Link } from 'react-router-dom'
import { Edit, Trash2 } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'

export default function ProductManageCard({ product, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="h-40 bg-gray-100">
        {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
      </div>
      <div className="p-4">
        <p className="font-medium truncate">{product.name}</p>
        <p className="font-bold text-primary mt-1">{formatPrice(product.price)}</p>
        <p className="text-xs text-gray-400 mt-1">المخزون: {product.stock}</p>
        <div className="flex gap-2 mt-3">
          <Link to={`/seller/products/${product.id}/edit`} className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-xl text-sm hover:border-primary hover:text-primary transition-colors">
            <Edit className="w-3.5 h-3.5" /> تعديل
          </Link>
          <button onClick={() => onDelete?.(product.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-xl text-sm hover:border-red-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> حذف
          </button>
        </div>
      </div>
    </div>
  )
}
