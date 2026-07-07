import { formatDate } from '@/utils/formatDate'

export default function ActivityFeed({ activities = [] }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold mb-4">آخر الأنشطة</h3>
      {!activities.length
        ? <p className="text-gray-400 text-sm text-center py-8">لا توجد أنشطة</p>
        : (
          <div className="space-y-3">
            {activities.map((a, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                <div>
                  <p>{a.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(a.time)}</p>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}
