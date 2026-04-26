import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Star, Clock, Truck, ShoppingBag, MapPin, Package, ChevronRight, Search } from 'lucide-react'
import { getStore } from '@/api/stores.api'
import { getProducts } from '@/api/products.api'
import { getCategories } from '@/api/categories.api'
import { formatPrice } from '@/utils/formatPrice'
import ProductCard from '@/components/customer/product/ProductCard'
import Spinner from '@/components/common/Spinner'

const GRADIENTS = [
  'linear-gradient(135deg,#00C896,#007A58)',
  'linear-gradient(135deg,#FF6B35,#cc4d1f)',
  'linear-gradient(135deg,#6366F1,#4338CA)',
  'linear-gradient(135deg,#F59E0B,#B45309)',
]

export default function StorePage() {
  const { id }         = useParams()
  const [search, setSearch]     = useState('')
  const [catFilter, setCatFilter] = useState(null)

  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['store', id],
    queryFn:  () => getStore(id),
  })

  const { data: products = [], isLoading: prodsLoading } = useQuery({
    queryKey: ['products', 'store', id, catFilter],
    queryFn:  () => getProducts({ storeId: id, categoryId: catFilter, limit: 100 }),
    enabled:  !!id,
  })

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories })

  if (storeLoading) return <Spinner size="lg" />

  if (!store) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <p className="text-gray-500 text-lg">المتجر غير موجود</p>
      <Link to="/" className="mt-4 text-[#00C896] font-bold">العودة للرئيسية</Link>
    </div>
  )

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  )

  const storeCats = categories.filter(c =>
    products.some(p => p.category_id === c.id)
  )

  const grad = GRADIENTS[store.name?.length % GRADIENTS.length] ?? GRADIENTS[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover */}
      <div className="h-48 md:h-64 relative" style={{ background: grad }}>
        {store.image_url && (
          <img src={store.image_url} alt={store.name}
            className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Back */}
        <Link to="/"
          className="absolute top-4 right-4 flex items-center gap-1 bg-white/20 backdrop-blur text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-white/30 transition-colors">
          <ChevronRight className="w-4 h-4" /> رجوع
        </Link>

        {/* Open/Closed badge */}
        <div className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full
          ${store.is_open ? 'bg-green-400 text-white' : 'bg-gray-500 text-white'}`}>
          {store.is_open ? '● مفتوح الآن' : '● مغلق'}
        </div>
      </div>

      {/* Store Info Card */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 -mt-10 relative z-10">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-4 border-white shadow-md overflow-hidden shrink-0"
              style={{ background: grad }}>
              {store.logo_url
                ? <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-3xl">🏪</div>
              }
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">{store.name}</h1>
                  {store.city && (
                    <p className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /> {store.city}
                    </p>
                  )}
                </div>
                {store.rating > 0 && (
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl shrink-0">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-sm text-amber-600">{store.rating}</span>
                    {store.reviews_count > 0 && (
                      <span className="text-xs text-gray-400">({store.reviews_count})</span>
                    )}
                  </div>
                )}
              </div>

              {store.description && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{store.description}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <div className="w-7 h-7 rounded-lg bg-[#E6FAF5] flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-[#00C896]" />
                  </div>
                  {store.delivery_time} دقيقة
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Truck className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  {store.delivery_fee === 0 ? 'توصيل مجاني' : formatPrice(store.delivery_fee)}
                </div>
                {store.min_order > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                      <ShoppingBag className="w-3.5 h-3.5 text-purple-500" />
                    </div>
                    أدنى طلب {formatPrice(store.min_order)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search + Category filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث في منتجات المتجر..."
              className="w-full border border-gray-200 rounded-2xl py-3 pr-10 pl-4 text-sm outline-none focus:border-[#00C896] transition-colors"
            />
          </div>
        </div>

        {/* Category pills */}
        {storeCats.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-4 pb-1">
            <button onClick={() => setCatFilter(null)}
              className="shrink-0 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
              style={!catFilter
                ? { background: '#00C896', color: '#fff', boxShadow: '0 4px 12px rgba(0,200,150,.3)' }
                : { background: '#f1f5f9', color: '#64748b' }}>
              الكل
            </button>
            {storeCats.map(c => (
              <button key={c.id} onClick={() => setCatFilter(c.id === catFilter ? null : c.id)}
                className="shrink-0 flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                style={catFilter === c.id
                  ? { background: '#00C896', color: '#fff', boxShadow: '0 4px 12px rgba(0,200,150,.3)' }
                  : { background: '#f1f5f9', color: '#64748b' }}>
                <span>{c.emoji}</span> {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Products */}
        <div className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              منتجات المتجر
              {filtered.length > 0 && (
                <span className="mr-2 text-sm font-normal text-gray-400">({filtered.length})</span>
              )}
            </h2>
          </div>

          {prodsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl h-64 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">
                {search ? 'لا توجد نتائج للبحث' : 'لا توجد منتجات بعد'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map(p => (
                <ProductCard key={p.id} product={{ ...p, storeName: store.name }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
