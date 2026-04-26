import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Plus, Star, Check } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { formatPrice } from '@/utils/formatPrice'

export default function ProductCard({ product }) {
  const { addItem }               = useCartStore()
  const { toggle, isInWishlist }  = useWishlistStore()
  const [added, setAdded]         = useState(false)

  const liked = isInWishlist(product.id)

  const handleAdd = (e) => {
    e.preventDefault()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggle(product.id)
  }

  const discountedPrice = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : null

  const image = Array.isArray(product.images) ? product.images[0] : (product.images ?? product.image ?? null)
  const storeName = product.seller_stores?.name ?? product.storeName ?? null

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="relative block aspect-square bg-gray-50 overflow-hidden">
        {image
          ? <img src={image} alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <span className="text-5xl opacity-20">📦</span>
            </div>
          )
        }

        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 left-2.5 w-8 h-8 rounded-full shadow flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
            liked ? 'bg-red-500' : 'bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-white text-white' : 'text-gray-400'}`} />
        </button>

        {/* Discount badge */}
        {product.discount > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-xl">
            -{product.discount}%
          </div>
        )}

        {/* New / out of stock */}
        {product.is_new && !product.discount && (
          <div className="absolute top-2.5 right-2.5 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-xl">
            جديد
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl">نفدت الكمية</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        {storeName && (
          <p className="text-xs text-gray-400 mb-1 truncate">{storeName}</p>
        )}
        <Link to={`/product/${product.id}`}>
          <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-green-600 transition-colors">
            {product.name || 'منتج QuickMart'}
          </p>
        </Link>

        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-700">{Number(product.rating).toFixed(1)}</span>
            {product.reviews_count > 0 && (
              <span className="text-xs text-gray-400">({product.reviews_count})</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3">
          {/* Price */}
          <div>
            <p className="font-bold text-base text-green-600">
              {formatPrice(discountedPrice ?? product.price)}
            </p>
            {discountedPrice && (
              <p className="text-xs text-gray-400 line-through leading-none">
                {formatPrice(product.price)}
              </p>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`w-9 h-9 rounded-2xl text-white flex items-center justify-center transition-all duration-200 active:scale-90 shadow-md disabled:opacity-40 disabled:cursor-not-allowed ${
              added
                ? 'bg-green-500 shadow-green-200'
                : 'shadow-green-200/60'
            }`}
            style={!added ? { background: 'linear-gradient(135deg,#16a34a,#15803d)', boxShadow: '0 4px 12px rgba(22,163,74,.35)' } : {}}
          >
            {added
              ? <Check className="w-4 h-4" />
              : <Plus className="w-4 h-4" />
            }
          </button>
        </div>
      </div>
    </div>
  )
}
