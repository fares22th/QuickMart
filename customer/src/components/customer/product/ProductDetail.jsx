import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Store, Truck, ShieldCheck, Share2, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { formatPrice } from '@/utils/formatPrice'
import ProductImages from './ProductImages'
import QuantitySelector from './QuantitySelector'
import StarRating from '@/components/common/StarRating'

/* ── Variant selector (color or size) ── */
function VariantSelector({ label, options, value, onChange }) {
  if (!options?.length) return null
  const isColor = options.every(o => o.hex)

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-2">
        {label}:{' '}
        <span className="font-normal text-gray-500">{value?.label ?? value ?? ''}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const val  = typeof opt === 'string' ? opt : opt.label
          const sel  = (typeof value === 'string' ? value : value?.label) === val
          if (isColor) {
            return (
              <button
                key={val}
                onClick={() => onChange(opt)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  sel ? 'border-primary scale-110 shadow-md' : 'border-transparent hover:border-gray-300'
                }`}
                style={{ background: opt.hex }}
                title={val}
              />
            )
          }
          return (
            <button
              key={val}
              onClick={() => onChange(opt)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                sel
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              } ${opt.outOfStock ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
              disabled={opt.outOfStock}
            >
              {val}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function ProductDetail({ product }) {
  const [qty, setQty]           = useState(1)
  const [selColor, setSelColor] = useState(null)
  const [selSize, setSelSize]   = useState(null)
  const [added, setAdded]       = useState(false)

  const { addItem, open: openCart } = useCartStore()
  const { toggle, isInWishlist }    = useWishlistStore()
  const navigate = useNavigate()

  if (!product) return null

  const liked       = isInWishlist(product.id)
  const comparePrice = product.comparePrice ?? product.originalPrice
  const discountPct  = comparePrice > product.price
    ? Math.round((1 - product.price / comparePrice) * 100)
    : 0
  const inStock = product.stock == null || product.stock > 0

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product)
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: product.name, url })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('تم نسخ رابط المنتج')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12" dir="rtl">

      {/* Images */}
      <ProductImages images={product.images ?? []} />

      {/* Info */}
      <div className="space-y-4">

        {/* Store link */}
        {(product.store?.storeName ?? product.storeName) && (
          <Link to={`/store/${product.storeId}`}
            className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
            <Store className="w-4 h-4" />
            {product.store?.storeName ?? product.storeName}
          </Link>
        )}

        {/* Name + actions */}
        <div className="flex items-start gap-2">
          <h1 className="text-2xl font-bold text-gray-900 flex-1 leading-snug">{product.name}</h1>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggle(product)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                liked
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Rating */}
        {product.rating != null && (
          <div className="flex items-center gap-2">
            <StarRating value={product.rating} readonly />
            <span className="text-sm text-gray-500">
              {product.rating} ({product.reviewsCount ?? 0} تقييم)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
          {discountPct > 0 && (
            <>
              <span className="text-lg text-gray-400 line-through">{formatPrice(comparePrice)}</span>
              <span className="bg-red-100 text-red-600 text-sm font-bold px-2.5 py-1 rounded-xl">
                خصم {discountPct}%
              </span>
            </>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
        )}

        {/* Variants */}
        {product.colors?.length > 0 && (
          <VariantSelector
            label="اللون"
            options={product.colors}
            value={selColor}
            onChange={setSelColor}
          />
        )}
        {product.sizes?.length > 0 && (
          <VariantSelector
            label="المقاس"
            options={product.sizes}
            value={selSize}
            onChange={setSelSize}
          />
        )}

        {/* Stock */}
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${inStock ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-500'}`}>
            {inStock
              ? product.stock != null ? `متوفر (${product.stock} قطعة)` : 'متوفر'
              : 'غير متوفر'
            }
          </span>
        </div>

        {/* Quantity */}
        {inStock && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">الكمية:</span>
            <QuantitySelector value={qty} onChange={setQty} max={product.stock ?? 99} />
          </div>
        )}

        {/* Buttons: Add to cart + Buy now */}
        <div className="flex gap-3">
          <button
            disabled={!inStock}
            onClick={handleAddToCart}
            className={`flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border-2 ${
              added ? 'scale-[0.98]' : ''
            }`}
            style={inStock
              ? { borderColor: '#00C896', color: '#00C896', background: added ? 'rgba(0,200,150,0.08)' : 'transparent' }
              : { borderColor: '#E5E7EB', color: '#9CA3AF' }
            }
          >
            {added ? (
              <><span>✓</span> تمت الإضافة!</>
            ) : (
              <><ShoppingCart className="w-4 h-4" />{inStock ? 'أضف للسلة' : 'غير متوفر'}</>
            )}
          </button>

          {inStock && (
            <button
              onClick={() => {
                for (let i = 0; i < qty; i++) addItem(product)
                navigate('/checkout')
              }}
              className="flex-1 py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #00C896, #00A878)',
                boxShadow: '0 8px 20px rgba(0,200,150,0.35)',
              }}
            >
              <Zap className="w-4 h-4" />
              اشتر الآن
            </button>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 bg-gray-50 rounded-2xl p-3">
            <Truck className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-700">توصيل سريع</p>
              <p className="text-xs text-gray-400">٣٠ - ٦٠ دقيقة</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-gray-50 rounded-2xl p-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-700">جودة مضمونة</p>
              <p className="text-xs text-gray-400">إرجاع خلال ٧ أيام</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
