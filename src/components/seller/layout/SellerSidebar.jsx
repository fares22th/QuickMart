import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Package, BarChart2, Tag, Star, CreditCard, Settings, Warehouse } from 'lucide-react'
import { cn } from '@/utils/cn'

const NAV = [
  { to: '/seller',            icon: LayoutDashboard, label: 'لوحة التحكم', end: true },
  { to: '/seller/orders',     icon: ShoppingBag,     label: 'الطلبات' },
  { to: '/seller/products',   icon: Package,         label: 'المنتجات' },
  { to: '/seller/inventory',  icon: Warehouse,       label: 'المخزون' },
  { to: '/seller/analytics',  icon: BarChart2,       label: 'التحليلات' },
  { to: '/seller/offers',     icon: Tag,             label: 'العروض' },
  { to: '/seller/reviews',    icon: Star,            label: 'التقييمات' },
  { to: '/seller/payments',   icon: CreditCard,      label: 'المدفوعات' },
  { to: '/seller/settings',   icon: Settings,        label: 'الإعدادات' },
]

export default function SellerSidebar() {
  return (
    <aside className="w-60 bg-white border-l flex flex-col shrink-0">
      <div className="h-16 flex items-center px-5 border-b">
        <span className="font-bold text-seller text-lg">QuickMart Seller</span>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              isActive ? 'bg-seller/10 text-seller' : 'text-gray-600 hover:bg-gray-100',
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
