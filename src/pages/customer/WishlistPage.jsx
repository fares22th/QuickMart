import ProductCard from '@/components/customer/product/ProductCard'
import EmptyState from '@/components/common/EmptyState'

export default function WishlistPage() {
  const wishlist = []

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">قائمة المفضلة</h1>
      {!wishlist.length
        ? <EmptyState message="لا يوجد منتجات في المفضلة" />
        : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlist.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )
      }
    </div>
  )
}
