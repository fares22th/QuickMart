import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2, Eye, EyeOff, Star, Package } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateProduct, deleteProduct } from '@/api/products.api'
import { formatPrice } from '@/utils/formatPrice'

export default function ProductManageCard({ product }) {
  const qc = useQueryClient()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const toggleMutation = useMutation({
    mutationFn: () => updateProduct(product.id, { is_available: !product.is_available }),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['seller-products'] }); toast.success(product.is_available ? 'تم إخفاء المنتج' : 'تم تفعيل المنتج') },
    onError:    (e) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(product.id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['seller-products'] }); toast.success('تم حذف المنتج') },
    onError:    (e) => toast.error(e.message),
  })

  const image = product.images?.[0]
  const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-44 bg-gray-50 overflow-hidden">
        {image
          ? <img src={image} alt={product.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-200" />
            </div>
        }

        {/* Availability toggle */}
        <button
          onClick={() => toggleMutation.mutate()}
          disabled={toggleMutation.isPending}
          title={product.is_available ? 'إخفاء المنتج' : 'إظهار المنتج'}
          className={`absolute top-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center shadow transition-all
            ${product.is_available ? 'bg-white text-gray-600 hover:text-[#00C896]' : 'bg-gray-800/70 text-white'}`}>
          {product.is_available
            ? <Eye className="w-4 h-4" />
            : <EyeOff className="w-4 h-4" />}
        </button>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">
              -{product.discount}%
            </span>
          )}
          {product.is_new && (
            <span className="text-white text-[11px] font-bold px-2 py-0.5 rounded-lg"
              style={{ background: '#00C896' }}>جديد</span>
          )}
          {!product.is_available && (
            <span className="bg-gray-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">
              مخفي
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Name */}
        <p className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </p>

        {/* Price + Rating */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="font-bold text-base" style={{ color: '#00C896' }}>
              {formatPrice(discountedPrice ?? product.price)}
            </span>
            {discountedPrice && (
              <span className="text-xs text-gray-400 line-through mr-1.5">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-gray-600">{product.rating}</span>
            </div>
          )}
        </div>

        {/* Stock */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-400' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-400'}`} />
          <span className="text-xs text-gray-500">
            {product.stock === 0 ? 'نفدت الكمية' : `المخزون: ${product.stock} ${product.unit}`}
          </span>
        </div>

        {/* Actions */}
        {confirmDelete ? (
          <div className="mt-3 flex gap-2">
            <button onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}
              className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-60">
              {deleteMutation.isPending ? '...' : 'تأكيد الحذف'}
            </button>
            <button onClick={() => setConfirmDelete(false)}
              className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              إلغاء
            </button>
          </div>
        ) : (
          <div className="flex gap-2 mt-3">
            <Link to={`/seller/products/${product.id}/edit`}
              className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:border-[#00C896] hover:text-[#00C896] transition-colors">
              <Edit className="w-3.5 h-3.5" /> تعديل
            </Link>
            <button onClick={() => setConfirmDelete(true)}
              className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:border-red-400 hover:text-red-500 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> حذف
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
