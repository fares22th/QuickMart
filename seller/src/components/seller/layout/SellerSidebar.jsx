import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Package, BarChart2,
  Tag, Star, CreditCard, Settings, Warehouse, Zap, User,
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

const NAV = [
  { to: '/seller',           icon: LayoutDashboard, label: 'لوحة التحكم', end: true },
  { to: '/seller/orders',    icon: ShoppingBag,     label: 'الطلبات' },
  { to: '/seller/products',  icon: Package,         label: 'المنتجات' },
  { to: '/seller/inventory', icon: Warehouse,       label: 'المخزون' },
  { to: '/seller/analytics', icon: BarChart2,       label: 'التحليلات' },
  { to: '/seller/offers',    icon: Tag,             label: 'العروض' },
  { to: '/seller/reviews',   icon: Star,            label: 'التقييمات' },
  { to: '/seller/payments',  icon: CreditCard,      label: 'المدفوعات' },
]

const BOTTOM = [
  { to: '/seller/profile',  icon: User,     label: 'ملفي الشخصي' },
  { to: '/seller/settings', icon: Settings, label: 'إعدادات المتجر' },
]

export default function SellerSidebar() {
  const { user } = useAuthStore()

  return (
    <aside
      className="w-64 flex flex-col shrink-0 relative"
      style={{
        background: 'linear-gradient(180deg, #0A2218 0%, #0F3024 40%, #0A2218 100%)',
      }}
    >
      {/* Decorative top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,200,150,0.15) 0%, transparent 70%)' }}
      />

      {/* Logo */}
      <div className="relative z-10 h-16 flex items-center px-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #00C896, #00A878)' }}
          >
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">QuickMart</p>
            <p className="text-white/40 text-[10px] font-medium mt-0.5">لوحة البائع</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest px-3 py-2 mt-1">
          القائمة الرئيسية
        </p>
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
              ${isActive
                ? 'text-white'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, rgba(0,200,150,0.25), rgba(0,200,150,0.1))' }}
                  />
                )}
                {isActive && (
                  <span
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full"
                    style={{ background: '#00C896' }}
                  />
                )}
                <span className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all
                  ${isActive
                    ? 'text-[#00C896]'
                    : 'text-white/40 group-hover:text-white/60'
                  }`}>
                  <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                </span>
                <span className="relative z-10">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        <div className="border-t border-white/5 my-3" />

        {BOTTOM.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
              ${isActive ? 'text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute inset-0 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, rgba(0,200,150,0.25), rgba(0,200,150,0.1))' }} />
                )}
                <span className="relative z-10"><Icon style={{ width: 18, height: 18 }} /></span>
                <span className="relative z-10">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User card at bottom */}
      <div className="relative z-10 p-3 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #00C896, #00A878)' }}
          >
            {user?.name?.[0] ?? 'B'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name ?? 'البائع'}</p>
            <p className="text-white/35 text-[10px] truncate">بائع نشط</p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
        </div>
      </div>
    </aside>
  )
}
