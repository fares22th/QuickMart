import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/api/products.api'
import { getCategories } from '@/api/categories.api'
import ProductCard from '@/components/customer/product/ProductCard'
import Spinner from '@/components/common/Spinner'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const MOCK_NAMES = {
  restaurants: 'مطاعم', supermarket: 'سوبرماركت', bakery: 'مخبوزات',
  sweets: 'حلويات', coffee: 'قهوة ومشروبات', pharmacy: 'صيدليات',
  electronics: 'إلكترونيات', fashion: 'ملابس', flowers: 'زهور وهدايا',
  home: 'منزل ومطبخ', sports: 'رياضة', other: 'أخرى',
}

export default function CategoryPage() {
  const { slug } = useParams()
  const isUUID   = UUID_RE.test(slug)

  const { data: cats = [] } = useQuery({
    queryKey: ['categories'],
    queryFn:  getCategories,
    enabled:  isUUID,
  })

  const categoryId  = isUUID ? slug : null
  const categoryName = isUUID
    ? (cats.find(c => String(c.id) === slug)?.name ?? '...')
    : (MOCK_NAMES[slug] ?? slug)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'category', slug],
    queryFn:  () => getProducts({ categoryId, limit: 40 }),
  })

  if (isLoading) return <Spinner size="lg" />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{categoryName}</h1>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-6xl mb-4">🛍️</span>
          <p className="text-gray-500 text-lg font-medium">لا توجد منتجات في هذه الفئة بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
