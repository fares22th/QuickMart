import { useNavigate } from 'react-router-dom'
import ProductForm from '@/components/seller/products/ProductForm'

export default function AddProductPage() {
  const navigate = useNavigate()

  const handleSuccess = () => navigate('/seller/products')

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">إضافة منتج جديد</h1>
      <ProductForm onSuccess={handleSuccess} />
    </div>
  )
}
