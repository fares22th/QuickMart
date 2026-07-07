import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BarChart2, Bell, Store, Users, Truck,
  ShoppingBag, DollarSign, AlertTriangle, Megaphone, Settings, ShieldCheck, User,
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

const NAV_MAIN = [
  { to: '/admin',              icon: LayoutDashboard, label: 'نظرة عامة',    end: true, color: '#818CF8' },
  { to: '/admin/analytics',   icon: BarChart2,       label: 'التحليلات',                color: '#34D399' },
  { to: '/admin/alerts',      icon: Bell,            label: 'التنبيهات',                color: '#FBBF24' },
]

const NAV_PEOPLE = [
  { to: '/admin/sellers',     icon: Store,           label: 'البائعون',                 color: '#A78BFA' },
  { to: '/admin/customers',   icon: Users,           label: 'العملاء',                  color: '#60A5FA' },
  { to: '/admin/drivers',     icon: Truck,           label: 'المندوبون',                color: '#22D3EE' },
]

const NAV_OPS = [
  { to: '/admin/orders',      icon: ShoppingBag,     label: 'الطلبات',                  color: '#34D399' },
  { to: '/admin/commissions', icon: DollarSign,      label: 'العمولات',                 color: '#FBBF24' },
  { to: '/admin/disputes',    icon: AlertTriangle,   label: 'النزاعات',                 color: '#F87171' },
  { to: '/admin/ads',         icon: Megaphone,       label: 'الإعلانات',                color: '#F472B6' },
]

const NAV_BOTTOM = [
  { to: '/admin/profile',     icon: User,            label: 'ملفي الشخصي',             color: '#A5B4FC' },
  { to: '/admin/settings',    icon: Settings,        label: 'إعدادات المنصة',           color: '#94A3B8' },
]

function SectionLabel({ label }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 mt-2"
      style={{ color: 'rgba(165,180,252,0.35)' }}>
      {label}
    </p>
  )
}

function NavItem({ to, icon: Icon, label, color, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
        ${isActive ? 'text-white' : 'hover:bg-white/5'}`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute inset-0 rounded-xl pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(99,102,241,0.15))' }} />
          )}
          {isActive && (
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full"
              style={{ background: '#818CF8' }} />
          )}
          <span
            className="relative z-10 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all"
            style={isActive
              ? { background: 'rgba(255,255,255,0.1)', color }
              : { color: 'rgba(165,180,252,0.45)' }
            }
          >
            <Icon style={{ width: 16, height: 16 }} />
          </span>
          <span className={`relative z-10 transition-colors ${isActive ? 'text-white' : 'text-indigo-200/50 group-hover:text-indigo-100/80'}`}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  )
}

export default function AdminSidebar() {
  const { user } = useAuthStore()

  return (
    <aside
      className="w-60 flex flex-col shrink-0 relative"
      style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #1e1b54 50%, #1a1844 100%)' }}
    >
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 70%)' }} />

      {/* Logo */}
      <div className="relative z-10 h-16 flex items-center px-5 border-b" style={{ borderColor: 'rgba(165,180,252,0.1)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}>
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-extrabold text-sm leading-none">QuickMart</p>
            <p className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(165,180,252,0.5)' }}>لوحة الإدارة</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex-1 p-3 overflow-y-auto space-y-0.5">
        <SectionLabel label="الرئيسية" />
        {NAV_MAIN.map(item => <NavItem key={item.to} {...item} />)}

        <SectionLabel label="المستخدمون" />
        {NAV_PEOPLE.map(item => <NavItem key={item.to} {...item} />)}

        <SectionLabel label="العمليات" />
        {NAV_OPS.map(item => <NavItem key={item.to} {...item} />)}

        <div className="border-t my-2" style={{ borderColor: 'rgba(165,180,252,0.1)' }} />
        {NAV_BOTTOM.map(item => <NavItem key={item.to} {...item} />)}
      </nav>

      {/* User card */}
      <div className="relative z-10 p-3 border-t" style={{ borderColor: 'rgba(165,180,252,0.1)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-extrabold shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}
          >
            {user?.name?.[0] ?? 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-semibold truncate">{user?.name ?? 'المشرف'}</p>
            <p className="text-[10px] truncate" style={{ color: 'rgba(165,180,252,0.4)' }}>مشرف النظام</p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#34D399' }} />
        </div>
      </div>
    </aside>
  )
}
