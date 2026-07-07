import { Link } from 'react-router-dom'
import { ShoppingBag, MapPin, Settings, LogOut, ChevronLeft, Heart, Bell } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useOrders } from '@/hooks/useOrders'
import Avatar from '@/components/common/Avatar'
import { formatPrice } from '@/utils/formatPrice'

const MENU_ITEMS = [
  { icon: ShoppingBag, label: 'طلباتي',        sub: 'عرض جميع طلباتك',      to: '/profile/orders',    color: '#00C896' },
  { icon: Heart,       label: 'المفضلة',        sub: 'المنتجات المحفوظة',     to: '/wishlist',          color: '#f43f5e' },
  { icon: MapPin,      label: 'عناويني',        sub: 'إدارة عناوين التوصيل', to: '/profile/addresses', color: '#3b82f6' },
  { icon: Bell,        label: 'الإشعارات',      sub: 'إعدادات التنبيهات',    to: '/profile/settings',  color: '#f59e0b' },
  { icon: Settings,    label: 'الإعدادات',      sub: 'الحساب وكلمة المرور',  to: '/profile/settings',  color: '#8b5cf6' },
]

function StatCard({ value, label, color }) {
  return (
    <div className="flex-1 bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-50">
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-400 mt-1 font-medium">{label}</p>
    </div>
  )
}

export default function ProfilePage() {
  const { user, logout } = useAuthStore()
  const { data: orders } = useOrders()

  const totalOrders    = orders?.length ?? 0
  const totalSpent     = orders?.reduce((s, o) => s + (o.total ?? 0), 0) ?? 0
  const activeOrders   = orders?.filter(o => ['pending','confirmed','preparing','shipped'].includes(o.status)).length ?? 0

  return (
    <div className="max-w-lg mx-auto px-4 py-6" dir="rtl">

      {/* Profile header */}
      <div className="relative bg-gradient-to-l from-primary to-emerald-400 rounded-3xl p-6 mb-5 overflow-hidden">
        <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/10" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold text-white border-2 border-white/30">
            {user?.name?.[0] ?? '؟'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-xl truncate">{user?.name ?? 'المستخدم'}</p>
            <p className="text-white/70 text-sm mt-0.5 truncate">{user?.phone ?? ''}</p>
            {user?.email && <p className="text-white/60 text-xs truncate">{user.email}</p>}
          </div>
          <Link
            to="/profile/settings"
            className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <Settings className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-5">
        <StatCard value={totalOrders}         label="إجمالي الطلبات" color="#00C896" />
        <StatCard value={activeOrders}        label="طلبات نشطة"     color="#f59e0b" />
        <StatCard value={formatPrice(totalSpent)} label="إجمالي الإنفاق" color="#3b82f6" />
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50 mb-4">
        {MENU_ITEMS.map(({ icon: Icon, label, sub, to, color }, i) => (
          <Link
            key={to + label}
            to={to}
            className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${
              i < MENU_ITEMS.length - 1 ? 'border-b border-gray-50' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: color + '18' }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
            <ChevronLeft className="w-4 h-4 text-gray-300 shrink-0" />
          </Link>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-100 bg-red-50 text-red-500 font-semibold text-sm hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        تسجيل الخروج
      </button>
    </div>
  )
}
