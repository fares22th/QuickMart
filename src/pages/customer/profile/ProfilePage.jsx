import { Link } from 'react-router-dom'
import { ShoppingBag, MapPin, Settings, LogOut, Heart, ChevronLeft } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useAuth } from '@/hooks/useAuth'
import Avatar from '@/components/common/Avatar'

const MENU_ITEMS = [
  { icon: ShoppingBag, label: 'طلباتي',       to: '/profile/orders',    badge: null },
  { icon: Heart,       label: 'قائمة المفضلة', to: '/wishlist',          badge: null },
  { icon: MapPin,      label: 'عناويني',       to: '/profile/addresses', badge: null },
  { icon: Settings,    label: 'الإعدادات',     to: '/profile/settings',  badge: null },
]

export default function ProfilePage() {
  const { profile } = useAuthStore()
  const { logout } = useAuth()

  const name  = profile?.name  ?? 'مستخدم QuickMart'
  const phone = profile?.phone ?? profile?.email ?? ''
  const email = profile?.email ?? ''

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* User card */}
      <div className="flex items-center gap-4 mb-6 p-5 bg-white rounded-2xl shadow-sm">
        <Avatar name={name} src={profile?.avatar_url} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-lg truncate">{name}</p>
          {phone && <p className="text-gray-500 text-sm">{phone}</p>}
          {email && email !== phone && <p className="text-gray-400 text-xs" dir="ltr">{email}</p>}
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {MENU_ITEMS.map(({ icon: Icon, label, to, badge }) => (
          <Link key={to} to={to}
            className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
              <Icon className="w-4.5 h-4.5 text-green-600" />
            </div>
            <span className="font-medium flex-1">{label}</span>
            {badge && (
              <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>
            )}
            <ChevronLeft className="w-4 h-4 text-gray-300" />
          </Link>
        ))}

        <button
          onClick={logout}
          className="flex items-center gap-3 px-5 py-4 w-full text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors">
          <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
            <LogOut className="w-4.5 h-4.5 text-red-500" />
          </div>
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  )
}
