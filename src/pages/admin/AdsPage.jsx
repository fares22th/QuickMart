import { Plus } from 'lucide-react'
import Button from '@/components/common/Button'
import EmptyState from '@/components/common/EmptyState'

export default function AdminAdsPage() {
  const ads = []

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">الإعلانات</h1>
        <Button><Plus className="w-4 h-4 ml-1" /> إعلان جديد</Button>
      </div>
      {!ads.length
        ? <EmptyState message="لا توجد إعلانات" />
        : ads.map(a => (
          <div key={a.id} className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
            <p className="font-medium">{a.title}</p>
            <span className="text-sm text-gray-400">{a.period}</span>
          </div>
        ))
      }
    </div>
  )
}
