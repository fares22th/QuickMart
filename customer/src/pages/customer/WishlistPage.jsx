import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { useWishlistStore } from '@/store/useWishlistStore'
import ProductCard from '@/components/customer/product/ProductCard'
import Button from '@/components/common/Button'

export default function WishlistPage() {
  const { items, clear } = useWishlistStore()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-400 fill-red-400" />
          <h1 className="text-2xl font-bold">قائمة المفضلة</h1>
          {items.length > 0 && (
            <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {items.length} منتج
            </span>
          )}
        </div>
        {items.length > 0 && (
          <button
            onClick={clear}
            className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors"
          >
            مسح الكل
          </button>
        )}
      </div>

      {!items.length ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-red-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">قائمة المفضلة فارغة</h2>
          <p className="text-gray-400 mb-6 max-w-xs">
            أضف المنتجات التي تعجبك بالضغط على ❤️ وستظهر هنا
          </p>
          <Link to="/">
            <Button className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              تصفح المنتجات
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
