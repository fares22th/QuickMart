import { useParams } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import ProductDetail from '@/components/customer/product/ProductDetail'
import ProductReviews from '@/components/customer/product/ProductReviews'
import Spinner from '@/components/common/Spinner'

export default function ProductPage() {
  const { id } = useParams()
  const { data: product, isLoading } = useProducts(id)

  if (isLoading) return <Spinner />

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <ProductDetail product={product} />
      <ProductReviews productId={id} />
    </div>
  )
}
