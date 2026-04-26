import { Phone, MessageCircle } from 'lucide-react'
import Avatar from '@/components/common/Avatar'

export default function DriverCard({ driver }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mt-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar name={driver?.name ?? 'مندوب'} />
        <div>
          <p className="font-bold text-sm">{driver?.name ?? 'مندوب التوصيل'}</p>
          <p className="text-xs text-gray-500">{driver?.vehicle ?? 'سيارة توصيل'}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="w-9 h-9 bg-primary-light text-primary rounded-xl flex items-center justify-center">
          <Phone className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 bg-primary-light text-primary rounded-xl flex items-center justify-center">
          <MessageCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
