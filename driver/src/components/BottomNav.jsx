import { NavLink, useLocation } from 'react-router-dom'
import { Home, Package, History, TrendingUp, User } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getActiveOrder } from '@/api/driver.api'
import { useDriverStore } from '@/store/useDriverStore'

const LINKS = [
  { to: '/',             icon: Home,       label: 'الرئيسية' },
  { to: '/active-order', icon: Package,    label: 'الطلب الحالي' },
  { to: '/history',      icon: History,    label: 'السجل' },
  { to: '/earnings',     icon: TrendingUp, label: 'الأرباح' },
  { to: '/profile',      icon: User,       label: 'الملف' },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  const user         = useDriverStore(s => s.user)

  const { data: activeOrder } = useQuery({
    queryKey: ['active-order'],
    queryFn:  getActiveOrder,
    enabled:  !!user,
    staleTime: 10_000,
  })

  const hasActive = !!activeOrder

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center"
      style={{
        background: '#0F0800',
        borderTop: '1px solid #2E1A00',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {LINKS.map(({ to, icon: Icon, label }) => {
        const isActive  = pathname === to || (to !== '/' && pathname.startsWith(to))
        const showBadge = to === '/active-order' && hasActive

        return (
          <NavLink
            key={to}
            to={to}
            className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all active:scale-90"
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all relative"
              style={{ background: isActive ? '#F9731620' : 'transparent' }}
            >
              <Icon
                className="w-5 h-5 transition-colors"
                style={{ color: isActive ? '#F97316' : '#4B5563' }}
              />
              {/* Active order badge */}
              {showBadge && (
                <span
                  className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full border-2 animate-pulse"
                  style={{ background: '#EF4444', borderColor: '#0F0800' }}
                />
              )}
            </div>
            <span
              className="text-xs font-bold transition-colors"
              style={{ color: isActive ? '#F97316' : '#6B7280' }}
            >
              {label}
            </span>
          </NavLink>
        )
      })}
    </nav>
  )
}
