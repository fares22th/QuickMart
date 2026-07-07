import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getStores } from '@/api/stores.api'
import StoreCard from '../store/StoreCard'
import { ChevronLeft } from 'lucide-react'

const MOCK_STORES = [
  { id: 1, name: 'مطعم البيت السعودي', category: 'مطاعم', rating: 4.9, deliveryTime: 25, deliveryFee: 0,   minOrder: 30, isOpen: true },
  { id: 2, name: 'سوق الخضار الطازج',  category: 'خضروات وفواكه', rating: 4.7, deliveryTime: 30, deliveryFee: 5,   minOrder: 20, isOpen: true },
  { id: 3, name: 'متجر الإلكترونيات',  category: 'إلكترونيات',  rating: 4.8, deliveryTime: 45, deliveryFee: 10,  minOrder: 50, isOpen: true },
  { id: 4, name: 'مخبز الفرن الحجري',  category: 'مخبوزات',    rating: 4.6, deliveryTime: 20, deliveryFee: 0,   minOrder: 15, isOpen: false },
  { id: 5, name: 'صيدلية الرعاية',     category: 'صحة وجمال',  rating: 4.9, deliveryTime: 35, deliveryFee: 0,   minOrder: 0,  isOpen: true },
  { id: 6, name: 'بقالة النجمة',       category: 'بقالة',      rating: 4.5, deliveryTime: 20, deliveryFee: 5,   minOrder: 25, isOpen: true },
]

export default function StoresSection({ title = 'متاجر مميزة' }) {
  const { data } = useQuery({ queryKey: ['stores', 'featured'], queryFn: () => getStores({ limit: 10 }) })
  const list = data?.stores?.length ? data.stores : MOCK_STORES

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">الأقرب إليك • الأعلى تقييماً</p>
        </div>
        <Link to="/search?type=stores"
          className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-xl transition-colors hover:bg-[#E6FAF5]"
          style={{ color: '#00C896' }}>
          عرض الكل
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3 -mx-4 px-4">
        {list.map((store, i) => <StoreCard key={store.id} store={store} index={i} />)}
      </div>
    </section>
  )
}
