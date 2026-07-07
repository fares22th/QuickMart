import { useParams } from 'react-router-dom'
import TrackingMap from '@/components/customer/tracking/TrackingMap'
import OrderSteps from '@/components/customer/tracking/OrderSteps'
import DriverCard from '@/components/customer/tracking/DriverCard'
import EtaCard from '@/components/customer/tracking/EtaCard'

export default function TrackingPage() {
  const { orderId } = useParams()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">تتبع الطلب #{orderId}</h1>
      <EtaCard />
      <TrackingMap />
      <DriverCard />
      <OrderSteps />
    </div>
  )
}
