import { MapPin, ChevronDown } from 'lucide-react'
import { useLocationStore } from '@/store/useLocationStore'

export default function LocationPicker() {
  const { address } = useLocationStore()

  return (
    <button className="hidden md:flex items-center gap-1 text-sm text-gray-600 hover:text-primary shrink-0">
      <MapPin className="w-4 h-4 text-primary" />
      <span className="max-w-28 truncate">{address || 'تحديد الموقع'}</span>
      <ChevronDown className="w-3 h-3" />
    </button>
  )
}
