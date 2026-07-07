import { Link } from 'react-router-dom'
import { Star, Clock, ChevronLeft } from 'lucide-react'

const GRADIENTS = [
  'linear-gradient(135deg,#00C896,#007A58)',
  'linear-gradient(135deg,#FF6B35,#cc4d1f)',
  'linear-gradient(135deg,#6366F1,#4338CA)',
  'linear-gradient(135deg,#F59E0B,#B45309)',
  'linear-gradient(135deg,#EC4899,#BE185D)',
  'linear-gradient(135deg,#14B8A6,#0F766E)',
]

export default function StoreCard({ store, index = 0 }) {
  const grad = GRADIENTS[index % GRADIENTS.length]
  const isOpen = store.isOpen ?? true

  return (
    <Link to={`/store/${store.id}`}
      className="group shrink-0 w-56 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

      {/* Image / Gradient header */}
      <div className="h-32 relative overflow-hidden" style={{ background: grad }}>
        {store.image
          ? <img src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-40">🏪</span>
            </div>
          )
        }
        {/* Open/Closed badge */}
        <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${isOpen ? 'bg-green-500 text-white' : 'bg-gray-800/70 text-gray-200'}`}>
          {isOpen ? 'مفتوح' : 'مغلق'}
        </div>
        {/* Min order badge */}
        {store.minOrder && (
          <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur text-white text-xs px-2 py-1 rounded-lg">
            حد أدنى {store.minOrder} ر.س
          </div>
        )}
      </div>

      {/* Logo */}
      <div className="px-4 pt-0 relative">
        <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg -mt-6 bg-white flex items-center justify-center overflow-hidden">
          {store.logo
            ? <img src={store.logo} alt="" className="w-full h-full object-cover" />
            : <span className="text-xl">🏪</span>
          }
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pb-4 pt-2">
        <p className="font-bold text-gray-900 text-sm truncate">{store.name || 'متجر QuickMart'}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">{store.category || 'متنوع'}</p>
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-700">{store.rating ?? '4.8'}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {store.deliveryTime ?? '25'} د
          </span>
          <span className="flex items-center gap-1">
            🛵 {store.deliveryFee ? `${store.deliveryFee} ر.س` : 'مجاني'}
          </span>
        </div>
      </div>
    </Link>
  )
}
