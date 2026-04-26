import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Trash2 } from 'lucide-react'
import { useWishlistStore } from '@/store/useWishlistStore'
import { getProducts } from '@/api/products.api'
import ProductCard from '@/components/customer/product/ProductCard'

export default function WishlistPage() {
  const { productIds, remove } = useWishlistStore()
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    if (!productIds.length) { setProducts([]); return }
    setLoading(true)

    // Fetch all products in wishlist by search (fallback strategy since
    // products.api.getProducts doesn't have a byIds filter yet)
    Promise.all(
      productIds.map(id =>
        import('@/api/products.api')
          .then(m => m.getProduct(id))
          .catch(() => null)
      )
    )
      .then(results => setProducts(results.filter(Boolean)))
      .finally(() => setLoading(false))
  }, [productIds.length])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        <h1 className="text-2xl font-bold">قائمة المفضلة</h1>
        {productIds.length > 0 && (
          <span className="bg-red-100 text-red-600 text-sm font-bold px-2.5 py-0.5 rounded-full">
            {productIds.length}
          </span>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productIds.map(id => (
            <div key={id} className="bg-white rounded-3xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-100" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !productIds.length && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Heart className="w-10 h-10 text-red-200" />
          </div>
          <h3 className="font-bold text-gray-700 text-lg mb-2">لا يوجد منتجات في المفضلة</h3>
          <p className="text-gray-400 text-sm">أضف المنتجات التي تعجبك بالضغط على أيقونة القلب</p>
        </motion.div>
      )}

      {!loading && products.length > 0 && (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        >
          <AnimatePresence>
            {products.map(p => (
              <motion.div
                key={p.id}
                layout
                variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="relative"
              >
                <ProductCard product={p} />
                <button
                  onClick={() => { remove(p.id); setProducts(prev => prev.filter(x => x.id !== p.id)) }}
                  className="absolute top-2.5 right-2.5 w-7 h-7 bg-white shadow rounded-full flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors z-10"
                  title="إزالة من المفضلة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
