import { AlertTriangle } from 'lucide-react'
import Button from '@/components/common/Button'
import { formatDate } from '@/utils/formatDate'

export default function DisputeCard({ dispute }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border-r-4 border-red-400">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">طلب #{dispute.orderId}</p>
            <p className="text-sm text-gray-600 mt-1">{dispute.description}</p>
            <p className="text-xs text-gray-400 mt-1">{formatDate(dispute.createdAt)}</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="outline">رفض</Button>
          <Button size="sm">قبول</Button>
        </div>
      </div>
    </div>
  )
}
