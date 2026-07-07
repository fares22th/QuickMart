import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Home } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useRecentlyViewedStore } from '@/store/useRecentlyViewedStore'
import ProductDetail from '@/components/customer/product/ProductDetail'
import ProductReviews from '@/components/customer/product/ProductReviews'
import ProductCard from '@/components/customer/product/ProductCard'

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      <div className="aspect-square bg-gray-100 rounded-3xl" />
      <div className="space-y-4 pt-2">
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        <div className="h-7 bg-gray-100 rounded w-4/5" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="h-9 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-12 bg-gray-100 rounded-2xl w-full mt-4" />
      </div>
    </div>
  )
}

function HorizontalProductList({ title, products }) {
  if (!products?.length) return null
  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {products.map(p => (
          <div key={p.id} className="shrink-0 w-44">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProductPage() {
  const { id } = useParams()
  const { addItem: addToRecent, items: recentItems } = useRecentlyViewedStore()

  const { data: product, isLoading } = useProducts(id)

  const { data: related } = useProducts({
    category: product?.category,
    limit: 8,
  })

  // Register in recently viewed when product loads
  useEffect(() => {
    if (product?.id) addToRecent(product)
  }, [product?.id])

  const relatedProducts = (related?.products ?? []).filter(p => String(p.id) !== String(id)).slice(0, 6)
  const recentFiltered  = recentItems.filter(p => String(p.id) !== String(id)).slice(0, 8)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6" dir="rtl">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          الرئيسية
        </Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        {product?.category && (
          <>
            <Link to={`/category/${product.category}`} className="hover:text-primary transition-colors capitalize">
              {product.category}
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-gray-600 font-medium truncate max-w-[200px]">
          {isLoading ? '...' : product?.name}
        </span>
      </nav>

      {/* Product */}
      {isLoading ? <ProductSkeleton /> : <ProductDetail product={product} />}

      {/* Reviews */}
      <ProductReviews productId={id} />

      {/* Related products */}
      <HorizontalProductList title="منتجات مشابهة" products={relatedProducts} />

      {/* Recently viewed */}
      <HorizontalProductList title="شاهدت مؤخراً" products={recentFiltered} />
    </div>
  )
}
