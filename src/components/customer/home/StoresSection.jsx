import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { getStores } from '@/api/stores.api'
import StoreCard from '../store/StoreCard'

const MOCK = [
  { id: 1, name: 'مطعم البيت السعودي', category: 'مطاعم',       rating: 4.9, delivery_time: 25, delivery_fee: 0,  min_order: 30, is_open: true  },
  { id: 2, name: 'سوق الخضار الطازج',  category: 'خضروات',      rating: 4.7, delivery_time: 30, delivery_fee: 5,  min_order: 20, is_open: true  },
  { id: 3, name: 'متجر الإلكترونيات',  category: 'إلكترونيات',  rating: 4.8, delivery_time: 45, delivery_fee: 10, min_order: 50, is_open: true  },
  { id: 4, name: 'مخبز الفرن الحجري',  category: 'مخبوزات',     rating: 4.6, delivery_time: 20, delivery_fee: 0,  min_order: 15, is_open: false },
  { id: 5, name: 'صيدلية الرعاية',     category: 'صحة وجمال',   rating: 4.9, delivery_time: 35, delivery_fee: 0,  min_order: 0,  is_open: true  },
  { id: 6, name: 'بقالة النجمة',       category: 'بقالة',       rating: 4.5, delivery_time: 20, delivery_fee: 5,  min_order: 25, is_open: true  },
]

export default function StoresSection({ title = 'متاجر مميزة' }) {
  const { data: stores = [] } = useQuery({
    queryKey: ['stores', 'featured'],
    queryFn:  () => getStores({ featured: true, limit: 8 }),
  })

  const list = stores.length ? stores : MOCK

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
          عرض الكل <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3 -mx-4 px-4">
        {list.map((store, i) => <StoreCard key={store.id} store={store} index={i} />)}
      </div>
    </section>
  )
}
