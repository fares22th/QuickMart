import { useLocationStore } from '@/store/useLocationStore'
import { toast } from 'sonner'

export function useLocation() {
  const { address, lat, lng, setLocation } = useLocationStore()

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('المتصفح لا يدعم تحديد الموقع')
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setLocation({ lat: coords.latitude, lng: coords.longitude, address: 'تم تحديد الموقع' }),
      () => toast.error('تعذر تحديد الموقع'),
    )
  }

  return { address, lat, lng, setLocation, detectLocation }
}
