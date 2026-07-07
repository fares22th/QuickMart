import { PackageOpen } from 'lucide-react'

export default function EmptyState({
  message = 'لا توجد بيانات',
  title,
  icon,
}) {
  const isEmoji = typeof icon === 'string'
  const Icon    = !isEmoji && icon ? icon : (!icon ? PackageOpen : null)

  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-center">
      {isEmoji
        ? <span className="text-5xl mb-3 block">{icon}</span>
        : Icon
          ? <Icon className="w-14 h-14 mb-3 opacity-40" />
          : null
      }
      {title && <p className="text-base font-semibold text-gray-600 mb-1">{title}</p>}
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  )
}
