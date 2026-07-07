import { Bell } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import Avatar from '@/components/common/Avatar'

export default function SellerTopbar() {
  const { user } = useAuthStore()

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-3">
        <button className="relative p-2 hover:bg-gray-100 rounded-xl">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <Avatar name={user?.name} size="sm" />
        <span className="text-sm font-medium text-gray-700">{user?.name}</span>
      </div>
    </header>
  )
}
