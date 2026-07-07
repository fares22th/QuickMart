import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getMyProduct } from '@/api/seller.api'
import ProductForm from '@/components/seller/products/ProductForm'
import Spinner from '@/components/common/Spinner'

export default function EditProductPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()

  const { data: product, isLoading } = useQuery({
    queryKey: ['seller-product', id],
    queryFn:  () => getMyProduct(id),
    enabled:  !!id,
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner />
    </div>
  )

  return (
    <div className="max-w-3xl" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">تعديل المنتج</h1>
      <ProductForm product={product} onSuccess={() => navigate('/seller/products')} />
    </div>
  )
}
