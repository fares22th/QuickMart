import EmptyState from '@/components/common/EmptyState'
import StatusPill from '@/components/common/StatusPill'

export default function AdminDriversPage() {
  const drivers = []

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">إدارة المندوبين</h1>
      {!drivers.length
        ? <EmptyState message="لا يوجد مندوبون" />
        : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {drivers.map(d => (
              <div key={d.id} className="flex items-center justify-between p-4 border-b">
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-sm text-gray-500">{d.phone}</p>
                </div>
                <StatusPill status={d.status} />
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}
