import { Bell } from 'lucide-react'
import EmptyState from '@/components/common/EmptyState'

export default function AlertsPage() {
  const alerts = []

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">التنبيهات</h1>
      {!alerts.length
        ? <EmptyState message="لا توجد تنبيهات" />
        : alerts.map(a => (
          <div key={a.id} className={`bg-white rounded-2xl p-4 shadow-sm border-r-4 ${a.level === 'warning' ? 'border-yellow-400' : 'border-red-500'}`}>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <p className="font-medium">{a.message}</p>
            </div>
            <p className="text-sm text-gray-400 mt-1">{a.time}</p>
          </div>
        ))
      }
    </div>
  )
}
