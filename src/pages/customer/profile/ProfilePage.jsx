import { Link } from 'react-router-dom'
import { ShoppingBag, MapPin, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import Avatar from '@/components/common/Avatar'

const MENU_ITEMS = [
  { icon: ShoppingBag, label: 'طلباتي',   to: '/profile/orders' },
  { icon: MapPin,      label: 'عناويني',  to: '/profile/addresses' },
  { icon: Settings,    label: 'الإعدادات', to: '/profile/settings' },
]

export default function ProfilePage() {
  const { user, logout } = useAuthStore()

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-8 p-4 bg-white rounded-2xl shadow-sm">
        <Avatar name={user?.name} size="lg" />
        <div>
          <p className="font-bold text-lg">{user?.name}</p>
          <p className="text-gray-500 text-sm">{user?.phone}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {MENU_ITEMS.map(({ icon: Icon, label, to }) => (
          <Link key={to} to={to} className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 hover:bg-gray-50">
            <Icon className="w-5 h-5 text-primary" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
        <button onClick={logout} className="flex items-center gap-3 px-5 py-4 w-full text-red-500 hover:bg-red-50">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  )
}
