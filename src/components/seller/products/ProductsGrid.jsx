import { useQuery } from '@tanstack/react-query'
import { Package, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getMyStore } from '@/api/stores.api'
import { getProducts } from '@/api/products.api'
import ProductManageCard from './ProductManageCard'
import Spinner from '@/components/common/Spinner'

export default function ProductsGrid() {
  const { data: store } = useQuery({ queryKey: ['my-store'], queryFn: getMyStore })

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['seller-products', store?.id],
    queryFn:  () => getProducts({ storeId: store.id, limit: 100 }),
    enabled:  !!store?.id,
  })

  if (isLoading) return <Spinner />

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
          style={{ background: '#E6FAF5' }}>
          <Package className="w-10 h-10" style={{ color: '#00C896' }} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد منتجات بعد</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-xs">
          أضف أول منتج لمتجرك وابدأ في البيع الآن
        </p>
        <Link to="/seller/products/add"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold text-sm transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg,#00C896,#00A878)', boxShadow: '0 8px 20px rgba(0,200,150,.3)' }}>
          <Plus className="w-4 h-4" /> إضافة منتج
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map(p => <ProductManageCard key={p.id} product={p} />)}
    </div>
  )
}
