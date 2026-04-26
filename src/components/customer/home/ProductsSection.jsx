import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { getProducts } from '@/api/products.api'
import ProductCard from '../product/ProductCard'

const TABS = [
  { label: 'مقترحة',       key: 'suggested', params: { featured: true } },
  { label: 'الأكثر مبيعاً', key: 'top',       params: {} },
  { label: 'عروض اليوم',   key: 'deals',     params: {} },
  { label: 'جديدة',        key: 'new',       params: { isNew: true } },
]

const MOCK = [
  { id: 'm1', name: 'تفاح أحمر طازج ١ كيلو',       price: 12, discount: 0,  rating: 4.8, reviews_count: 214, stores: { name: 'سوق الخضار' }, images: [] },
  { id: 'm2', name: 'صدر دجاج مبرد ١ كيلو',        price: 28, discount: 15, rating: 4.7, reviews_count: 98,  stores: { name: 'لحوم الطازجة' }, images: [] },
  { id: 'm3', name: 'عصير برتقال طبيعي ١ لتر',      price: 18, discount: 0,  rating: 4.9, reviews_count: 342, stores: { name: 'مشروبات بارد' }, images: [], is_new: true },
  { id: 'm4', name: 'خبز توست أبيض',                price: 8,  discount: 0,  rating: 4.5, reviews_count: 67,  stores: { name: 'مخبز الفرن' }, images: [] },
  { id: 'm5', name: 'حليب كامل الدسم ١ لتر',        price: 6,  discount: 10, rating: 4.6, reviews_count: 189, stores: { name: 'ألبان النعيم' }, images: [] },
  { id: 'm6', name: 'أرز بسمتي ممتاز ٥ كيلو',      price: 45, discount: 20, rating: 4.8, reviews_count: 421, stores: { name: 'بقالة النجمة' }, images: [] },
  { id: 'm7', name: 'زيت زيتون بكر ممتاز ٧٥٠ مل', price: 65, discount: 0,  rating: 4.9, reviews_count: 156, stores: { name: 'منتجات طبيعية' }, images: [] },
  { id: 'm8', name: 'شوكولاتة داكنة فاخرة',        price: 22, discount: 5,  rating: 4.7, reviews_count: 88,  stores: { name: 'حلويات السعادة' }, images: [] },
  { id: 'm9', name: 'معكرونة إيطالية ٥٠٠ غ',       price: 10, discount: 0,  rating: 4.4, reviews_count: 53,  stores: { name: 'بقالة النجمة' }, images: [] },
  { id:'m10', name: 'طماطم طازجة ١ كيلو',          price: 7,  discount: 0,  rating: 4.6, reviews_count: 312, stores: { name: 'سوق الخضار' }, images: [], is_new: true },
]

export default function ProductsSection({ title = 'منتجات مقترحة' }) {
  const [tab, setTab] = useState('suggested')
  const activeTab = TABS.find(t => t.key === tab)

  const { data = [], isLoading } = useQuery({
    queryKey: ['products', 'home', tab],
    queryFn:  () => getProducts({ ...activeTab.params, limit: 10 }),
  })

  const products = (data.length ? data : MOCK).map(p => ({
    ...p,
    storeName: p.stores?.name,
    isNew:     p.is_new,
  }))

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <Link to="/search"
          className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#E6FAF5] transition-colors"
          style={{ color: '#00C896' }}>
          كل المنتجات <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-5 pb-1">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="shrink-0 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
            style={tab === t.key
              ? { background: '#00C896', color: '#fff', boxShadow: '0 4px 12px rgba(0,200,150,.35)' }
              : { background: '#f1f5f9', color: '#64748b' }}>
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  )
}
