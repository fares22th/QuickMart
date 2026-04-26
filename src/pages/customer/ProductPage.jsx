import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Star, Clock, Truck, ChevronRight, Heart, Plus, Minus, ShoppingCart, Package } from 'lucide-react'
import { getProduct } from '@/api/products.api'
import { formatPrice } from '@/utils/formatPrice'
import { useCartStore } from '@/store/useCartStore'
import { toast } from 'sonner'
import Spinner from '@/components/common/Spinner'

export default function ProductPage() {
  const { id }       = useParams()
  const { addItem }  = useCartStore()
  const [qty, setQty]     = useState(1)
  const [imgIdx, setImgIdx] = useState(0)
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn:  () => getProduct(id),
  })

  if (isLoading) return <Spinner size="lg" />

  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <p className="text-gray-500 text-lg">المنتج غير موجود</p>
      <Link to="/" className="mt-4 text-[#00C896] font-bold">العودة للرئيسية</Link>
    </div>
  )

  const images          = product.images?.length ? product.images : []
  const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : null
  const finalPrice      = discountedPrice ?? product.price
  const store           = product.stores
  const inStock         = product.stock > 0

  const handleAdd = () => {
    addItem({ ...product, image: images[0] }, qty)
    setAdded(true)
    toast.success('تمت الإضافة إلى السلة')
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6" dir="rtl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-[#00C896] transition-colors">الرئيسية</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {store && (
          <>
            <Link to={`/store/${store.id}`} className="hover:text-[#00C896] transition-colors">{store.name}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-gray-600 truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
            {images[imgIdx]
              ? <img src={images[imgIdx]} alt={product.name}
                  className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-200" />
                </div>
            }
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {images.map((url, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`shrink-0 w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all
                    ${i === imgIdx ? 'border-[#00C896]' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          {/* Category + Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {product.categories && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                style={{ background: product.categories.color ?? '#00C896' }}>
                {product.categories.emoji} {product.categories.name}
              </span>
            )}
            {product.discount > 0 && (
              <span className="text-xs font-bold bg-red-500 text-white px-3 py-1 rounded-full">
                خصم {product.discount}%
              </span>
            )}
            {product.is_new && (
              <span className="text-xs font-bold text-white px-3 py-1 rounded-full"
                style={{ background: '#00C896' }}>جديد</span>
            )}
          </div>

          {/* Name */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
            {product.name}
          </h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="font-bold text-sm text-gray-700">{product.rating}</span>
              <span className="text-sm text-gray-400">({product.reviews_count} تقييم)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold" style={{ color: '#00C896' }}>
              {formatPrice(finalPrice)}
            </span>
            {discountedPrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-sm text-gray-500">/ {product.unit}</span>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${inStock ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-500'}`}>
              {inStock ? `متوفر — ${product.stock} ${product.unit}` : 'نفدت الكمية'}
            </span>
          </div>

          {/* Qty + Add to cart */}
          {inStock && (
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-lg">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: added ? '#22C55E' : 'linear-gradient(135deg,#00C896,#00A878)',
                  boxShadow: added ? '0 8px 20px rgba(34,197,94,.4)' : '0 8px 20px rgba(0,200,150,.3)',
                }}>
                {added
                  ? <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> تمت الإضافة</>
                  : <><ShoppingCart className="w-4 h-4" /> أضف إلى السلة</>
                }
              </button>

              <button onClick={() => setLiked(v => !v)}
                className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center hover:border-red-300 transition-colors">
                <Heart className={`w-5 h-5 transition-colors ${liked ? 'fill-red-400 text-red-400' : 'text-gray-400'}`} />
              </button>
            </div>
          )}

          {/* Total */}
          {inStock && qty > 1 && (
            <p className="text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-2.5">
              الإجمالي: <span className="font-bold text-gray-800">{formatPrice(finalPrice * qty)}</span>
            </p>
          )}

          {/* Store info */}
          {store && (
            <Link to={`/store/${store.id}`}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-[#E6FAF5] transition-colors group">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-100 shrink-0">
                {store.logo_url
                  ? <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-xl">🏪</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm group-hover:text-[#00C896] transition-colors">{store.name}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                  {store.rating > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {store.rating}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {store.delivery_time} د
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    {store.delivery_fee === 0 ? 'توصيل مجاني' : formatPrice(store.delivery_fee)}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#00C896] transition-colors" />
            </Link>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">وصف المنتج</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
          </div>
        </div>
      )}

      {/* Tags */}
      {product.tags?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {product.tags.map(tag => (
            <Link key={tag} to={`/search?q=${tag}`}
              className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-[#E6FAF5] text-gray-600 hover:text-[#00C896] rounded-full transition-colors">
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
