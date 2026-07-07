import { useParams } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/customer/product/ProductCard'
import Spinner from '@/components/common/Spinner'
import Pagination from '@/components/common/Pagination'

export default function CategoryPage() {
  const { slug } = useParams()
  const { data, isLoading } = useProducts({ category: slug })

  if (isLoading) return <Spinner />

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">{slug}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.products?.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      <Pagination total={data?.total} />
    </div>
  )
}
