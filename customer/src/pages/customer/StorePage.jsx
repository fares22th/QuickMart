import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Search, Star, Clock, MapPin, Package, ChevronDown } from 'lucide-react'
import { useStores } from '@/hooks/useStores'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/customer/product/ProductCard'
import EmptyState from '@/components/common/EmptyState'

const SORT_OPTIONS = [
  { value: '',                  label: 'الأكثر صلة' },
  { value: 'price:asc',        label: 'السعر: الأقل' },
  { value: 'price:desc',       label: 'السعر: الأعلى' },
  { value: 'rating:desc',      label: 'الأعلى تقييماً' },
  { value: 'created_at:desc',  label: 'الأحدث' },
]

function StoreSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="max-w-7xl mx-auto px-4 -mt-10 pb-4 relative">
        <div className="w-20 h-20 bg-gray-300 rounded-2xl" />
        <div className="h-6 bg-gray-200 rounded w-40 mt-3" />
        <div className="h-4 bg-gray-100 rounded w-56 mt-2" />
      </div>
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-5 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  )
}

export default function StorePage() {
  const { id } = useParams()
  const [search, setSearch] = useState('')
  const [sort, setSort]     = useState('')

  const { data: store, isLoading: storeLoading } = useStores(id)
  const { data, isLoading: productsLoading } = useProducts({
    storeId: id,
    search:  search || undefined,
    sort:    sort   || undefined,
    limit:   40,
  })

  const products = data?.products ?? []
  const total    = data?.total ?? 0

  return (
    <div dir="rtl">
      {/* Store header */}
      {storeLoading ? <StoreSkeleton /> : (
        <div className="bg-white border-b">
          {/* Cover */}
          <div className="h-44 bg-gradient-to-l from-primary to-emerald-300 relative overflow-hidden">
            {store?.cover && <img src={store.cover} alt="" className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 pb-5 -mt-10 relative">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-white shadow-lg overflow-hidden border-2 border-white flex items-center justify-center">
              {store?.logo
                ? <img src={store.logo} alt={store?.storeName || store?.name} className="w-full h-full object-cover" />
                : <span className="text-3xl">🏪</span>
              }
            </div>

            <div className="mt-3 flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{store?.storeName || store?.name}</h1>
                {store?.description && (
                  <p className="text-sm text-gray-500 mt-1 max-w-lg">{store.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2 flex-wrap">
                  {store?.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <strong className="text-gray-700">{store.rating}</strong>
                    </span>
                  )}
                  {store?.deliveryTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {store.deliveryTime} دقيقة
                    </span>
                  )}
                  {store?.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {store.city}
                    </span>
                  )}
                  {total > 0 && (
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {total} منتج
                    </span>
                  )}
                </div>
              </div>

              {/* Status badge */}
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                store?.isOpen !== false
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'
              }`}>
                {store?.isOpen !== false ? '● مفتوح الآن' : '● مغلق'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Products section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search + Sort bar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Search within store */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث في المتجر..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pr-9 pl-4 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:border-primary"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-5">
          منتجات المتجر
          {!productsLoading && total > 0 && (
            <span className="text-base font-normal text-gray-400 mr-2">({total})</span>
          )}
        </h3>

        {productsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon="🏪"
            title="لا توجد منتجات"
            message={search ? `لم يتم العثور على نتائج لـ "${search}"` : 'لا توجد منتجات في هذا المتجر حالياً'}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
