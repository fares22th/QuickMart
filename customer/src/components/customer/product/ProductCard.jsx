import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Plus, Star } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { formatPrice } from '@/utils/formatPrice'

export default function ProductCard({ product }) {
  const { addItem, open: openCart } = useCartStore()
  const { toggle, isInWishlist } = useWishlistStore()
  const [added, setAdded] = useState(false)

  const liked = isInWishlist(product.id)

  const handleAdd = (e) => {
    e.preventDefault()
    addItem(product)
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggle(product)
  }

  const imgSrc = product.images?.[0] ?? product.image ?? null

  const comparePrice    = product.comparePrice ?? product.originalPrice
  const discountedPrice = comparePrice > product.price ? product.price : null
  const discountPct     = comparePrice > product.price
    ? Math.round((1 - product.price / comparePrice) * 100)
    : product.discount ?? 0

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="relative block aspect-square bg-gray-50 overflow-hidden">
        {imgSrc
          ? <img src={imgSrc} alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-30">📦</span>
            </div>
          )
        }

        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          className="absolute top-2.5 left-2.5 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <Heart className={`w-4 h-4 transition-colors duration-200 ${liked ? 'fill-red-400 text-red-400' : 'text-gray-400'}`} />
        </button>

        {/* Discount badge */}
        {discountPct > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-xl">
            -{discountPct}%
          </div>
        )}
        {/* New badge */}
        {product.isNew && !discountPct && (
          <div className="absolute top-2.5 right-2.5 text-white text-xs font-bold px-2 py-1 rounded-xl"
            style={{ background: '#00C896' }}>
            جديد
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        {product.storeName && (
          <p className="text-xs text-gray-400 mb-1 truncate">{product.storeName}</p>
        )}
        <Link to={`/product/${product.id}`}>
          <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-[#00C896] transition-colors">
            {product.name || 'منتج QuickMart'}
          </p>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviews ?? 0})</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3">
          {/* Price */}
          <div>
            <p className="font-bold text-base" style={{ color: '#00C896' }}>
              {formatPrice(product.price)}
            </p>
            {discountedPrice && comparePrice && (
              <p className="text-xs text-gray-400 line-through leading-none">
                {formatPrice(comparePrice)}
              </p>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            className="w-9 h-9 rounded-2xl text-white flex items-center justify-center transition-all duration-200 active:scale-90 shadow-md"
            style={{
              background: added ? '#22C55E' : 'linear-gradient(135deg,#00C896,#00A878)',
              boxShadow: added ? '0 4px 12px rgba(34,197,94,.4)' : '0 4px 12px rgba(0,200,150,.35)',
            }}
          >
            {added
              ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              : <Plus className="w-4 h-4" />
            }
          </button>
        </div>
      </div>
    </div>
  )
}
