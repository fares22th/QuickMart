import { useParams } from 'react-router-dom'
import { useStores } from '@/hooks/useStores'
import { useProducts } from '@/hooks/useProducts'
import StoreHeader from '@/components/customer/store/StoreHeader'
import StoreInfo from '@/components/customer/store/StoreInfo'
import ProductCard from '@/components/customer/product/ProductCard'
import Spinner from '@/components/common/Spinner'

export default function StorePage() {
  const { id } = useParams()
  const { data: store, isLoading: storeLoading } = useStores(id)
  const { data, isLoading: productsLoading } = useProducts({ storeId: id })

  if (storeLoading) return <Spinner />

  return (
    <div>
      <StoreHeader store={store} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <StoreInfo store={store} />
        <h3 className="text-xl font-bold mt-8 mb-4">منتجات المتجر</h3>
        {productsLoading
          ? <Spinner />
          : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data?.products?.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )
        }
      </div>
    </div>
  )
}
