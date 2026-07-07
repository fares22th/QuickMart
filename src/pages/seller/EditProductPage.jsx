import { useNavigate, useParams } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import ProductForm from '@/components/seller/products/ProductForm'
import Spinner from '@/components/common/Spinner'

export default function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProducts(id)

  if (isLoading) return <Spinner />

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">تعديل المنتج</h1>
      <ProductForm product={product} onSuccess={() => navigate('/seller/products')} />
    </div>
  )
}
