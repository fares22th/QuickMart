import { useSearchParams } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/customer/product/ProductCard'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { data, isLoading } = useProducts({ search: query })

  if (isLoading) return <Spinner />

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-lg text-gray-500 mb-6">
        نتائج البحث عن: <span className="font-bold text-gray-800">"{query}"</span>
        {data?.total != null && <span className="mr-2 text-sm">({data.total} نتيجة)</span>}
      </h2>
      {!data?.products?.length
        ? <EmptyState message="لا توجد نتائج" />
        : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )
      }
    </div>
  )
}
