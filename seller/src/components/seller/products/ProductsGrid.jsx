import EmptyState from '@/components/common/EmptyState'
import ProductManageCard from './ProductManageCard'

export default function ProductsGrid({ products = [] }) {
  if (!products.length) return <EmptyState message="لا توجد منتجات بعد" />

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map(p => <ProductManageCard key={p.id} product={p} />)}
    </div>
  )
}
