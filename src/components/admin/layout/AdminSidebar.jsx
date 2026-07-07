import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BarChart2, Bell, Store, Users, Truck, ShoppingBag, DollarSign, AlertTriangle, Megaphone, Settings } from 'lucide-react'
import { cn } from '@/utils/cn'

const NAV = [
  { to: '/admin',              icon: LayoutDashboard, label: 'نظرة عامة',    end: true },
  { to: '/admin/analytics',   icon: BarChart2,       label: 'التحليلات' },
  { to: '/admin/alerts',      icon: Bell,            label: 'التنبيهات' },
  { to: '/admin/sellers',     icon: Store,           label: 'البائعون' },
  { to: '/admin/customers',   icon: Users,           label: 'العملاء' },
  { to: '/admin/drivers',     icon: Truck,           label: 'المندوبون' },
  { to: '/admin/orders',      icon: ShoppingBag,     label: 'الطلبات' },
  { to: '/admin/commissions', icon: DollarSign,      label: 'العمولات' },
  { to: '/admin/disputes',    icon: AlertTriangle,   label: 'النزاعات' },
  { to: '/admin/ads',         icon: Megaphone,       label: 'الإعلانات' },
  { to: '/admin/settings',    icon: Settings,        label: 'الإعدادات' },
]

export default function AdminSidebar() {
  return (
    <aside className="w-60 bg-admin text-white flex flex-col shrink-0">
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <span className="font-bold text-lg">QuickMart Admin</span>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              isActive ? 'bg-white/20' : 'text-white/70 hover:bg-white/10 hover:text-white',
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
