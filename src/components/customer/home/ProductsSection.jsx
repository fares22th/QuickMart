import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/api/products.api'
import ProductCard from '../product/ProductCard'
import { ChevronLeft } from 'lucide-react'

const MOCK_PRODUCTS = [
  { id: 1,  name: 'تفاح أحمر طازج كيلو',          price: 12,  discount: 0,  rating: 4.8, reviews: 214, storeName: 'سوق الخضار' },
  { id: 2,  name: 'صدر دجاج مبرد ١ كيلو',         price: 28,  discount: 15, rating: 4.7, reviews: 98,  storeName: 'لحوم الطازجة' },
  { id: 3,  name: 'عصير برتقال طبيعي ١ لتر',       price: 18,  discount: 0,  rating: 4.9, reviews: 342, storeName: 'مشروبات بارد', isNew: true },
  { id: 4,  name: 'خبز توست أبيض كامل',            price: 8,   discount: 0,  rating: 4.5, reviews: 67,  storeName: 'مخبز الفرن' },
  { id: 5,  name: 'حليب كامل الدسم ١ لتر',         price: 6,   discount: 10, rating: 4.6, reviews: 189, storeName: 'ألبان النعيم' },
  { id: 6,  name: 'أرز بسمتي ممتاز ٥ كيلو',       price: 45,  discount: 20, rating: 4.8, reviews: 421, storeName: 'بقالة النجمة' },
  { id: 7,  name: 'زيت زيتون بكر ممتاز ٧٥٠ مل',  price: 65,  discount: 0,  rating: 4.9, reviews: 156, storeName: 'منتجات طبيعية' },
  { id: 8,  name: 'شوكولاتة داكنة فاخرة',         price: 22,  discount: 5,  rating: 4.7, reviews: 88,  storeName: 'حلويات السعادة' },
  { id: 9,  name: 'معكرونة إيطالية ٥٠٠ غ',        price: 10,  discount: 0,  rating: 4.4, reviews: 53,  storeName: 'بقالة النجمة' },
  { id: 10, name: 'طماطم طازجة ١ كيلو',           price: 7,   discount: 0,  rating: 4.6, reviews: 312, storeName: 'سوق الخضار', isNew: true },
]

const TABS = [
  { label: 'مقترحة', key: 'suggested' },
  { label: 'الأكثر مبيعاً', key: 'top' },
  { label: 'عروض اليوم', key: 'deals' },
  { label: 'جديدة', key: 'new' },
]

import { useState } from 'react'

export default function ProductsSection({ title = 'منتجات مقترحة', filters }) {
  const [tab, setTab] = useState('suggested')
  const { data } = useQuery({ queryKey: ['products', 'home', filters, tab], queryFn: () => getProducts(filters) })
  const products = data?.products?.length ? data.products : MOCK_PRODUCTS

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <Link to="/search" className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#E6FAF5] transition-colors"
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}
