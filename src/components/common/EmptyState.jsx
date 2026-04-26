import { PackageOpen } from 'lucide-react'

export default function EmptyState({ message = 'لا توجد بيانات', icon: Icon = PackageOpen }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <Icon className="w-14 h-14 mb-3 opacity-50" />
      <p className="text-base">{message}</p>
    </div>
  )
}
