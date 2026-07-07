import { Clock } from 'lucide-react'

export default function EtaCard({ eta = 25 }) {
  return (
    <div className="bg-primary text-white rounded-2xl p-5 flex items-center gap-4">
      <Clock className="w-10 h-10 opacity-80" />
      <div>
        <p className="text-primary-light text-sm">الوقت المتوقع للوصول</p>
        <p className="text-3xl font-bold">{eta} دقيقة</p>
      </div>
    </div>
  )
}
