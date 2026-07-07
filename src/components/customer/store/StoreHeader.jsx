import { Star, Clock, MapPin } from 'lucide-react'

export default function StoreHeader({ store }) {
  return (
    <div className="bg-white border-b">
      <div className="h-40 bg-gray-200 relative">
        {store?.cover && <img src={store.cover} alt="" className="w-full h-full object-cover" />}
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-4 -mt-10 relative">
        <div className="w-20 h-20 rounded-2xl bg-white shadow-md overflow-hidden border-2 border-white">
          {store?.logo && <img src={store.logo} alt={store?.name} className="w-full h-full object-cover" />}
        </div>
        <h1 className="text-2xl font-bold mt-2">{store?.name}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
          <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{store?.rating}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{store?.deliveryTime} دقيقة</span>
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{store?.city}</span>
        </div>
      </div>
    </div>
  )
}
