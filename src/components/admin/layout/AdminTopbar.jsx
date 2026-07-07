import { Bell } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import Avatar from '@/components/common/Avatar'

export default function AdminTopbar() {
  const { user } = useAuthStore()

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-gray-100 rounded-xl relative">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <Avatar name={user?.name} size="sm" />
        <span className="text-sm font-medium">{user?.name}</span>
      </div>
    </header>
  )
}
