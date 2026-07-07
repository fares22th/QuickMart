import { PackageOpen } from 'lucide-react'

export default function EmptyState({ message = 'لا توجد بيانات', title, icon: Icon = PackageOpen }) {
  const isEmoji = typeof Icon === 'string'

  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      {isEmoji
        ? <span className="text-5xl mb-3 opacity-70">{Icon}</span>
        : <Icon className="w-14 h-14 mb-3 opacity-50" />
      }
      {title && <p className="text-base font-semibold text-gray-600 mb-1">{title}</p>}
      <p className="text-sm">{message}</p>
    </div>
  )
}
