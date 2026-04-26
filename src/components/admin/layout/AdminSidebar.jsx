import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BarChart3, Bell, Users, Store, Car, Package,
  DollarSign, Scale, Megaphone, Settings, Shield, LogOut,
  ChevronLeft, ChevronRight, Zap,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const NAV = [
  {
    section: 'عام',
    items: [
      { to: '/admin',           icon: LayoutDashboard, label: 'لوحة التحكم',        end: true },
      { to: '/admin/analytics', icon: BarChart3,       label: 'التحليلات' },
      { to: '/admin/alerts',    icon: Bell,            label: 'التنبيهات' },
    ],
  },
  {
    section: 'المستخدمون',
    items: [
      { to: '/admin/customers', icon: Users,  label: 'العملاء' },
      { to: '/admin/sellers',   icon: Store,  label: 'البائعون' },
      { to: '/admin/drivers',   icon: Car,    label: 'السائقون' },
    ],
  },
  {
    section: 'التجارة',
    items: [
      { to: '/admin/orders',      icon: Package,    label: 'الطلبات' },
      { to: '/admin/commissions', icon: DollarSign, label: 'المالية' },
      { to: '/admin/disputes',    icon: Scale,      label: 'النزاعات' },
    ],
  },
  {
    section: 'التسويق',
    items: [
      { to: '/admin/ads', icon: Megaphone, label: 'التسويق والإعلانات' },
    ],
  },
  {
    section: 'النظام',
    items: [
      { to: '/admin/settings', icon: Settings, label: 'الإعدادات' },
      { to: '/admin/security', icon: Shield,   label: 'مركز الأمان' },
    ],
  },
]

export default function AdminSidebar({ collapsed, setCollapsed, onClose }) {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="h-full flex flex-col bg-[#0F172A]">

      {/* Logo */}
      <div className={`h-16 flex items-center shrink-0 border-b border-white/5 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-900/40">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <p className="text-white font-bold text-sm">QuickMart</p>
              <p className="text-[10px] text-green-400/60 mt-0.5">Admin Panel</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
        )}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/5 transition-all"
        >
          {collapsed
            ? <ChevronRight className="w-3.5 h-3.5" />
            : <ChevronLeft  className="w-3.5 h-3.5" />
          }
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
        {NAV.map(sec => (
          <div key={sec.section}>
            {!collapsed
              ? <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-3 mb-1">{sec.section}</p>
              : <div className="h-px bg-white/5 my-2" />
            }
            <div className="space-y-0.5">
              {sec.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  title={collapsed ? item.label : undefined}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150
                    ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'}
                    ${isActive
                      ? 'bg-green-500/15 text-green-400 ring-1 ring-inset ring-green-500/20'
                      : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                    }
                  `}
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/5 shrink-0">
        {!collapsed ? (
          <div className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {profile?.name?.[0] ?? 'م'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-xs font-semibold truncate">{profile?.name ?? 'مدير النظام'}</p>
              <p className="text-[10px] text-white/30">Super Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center py-2.5 rounded-xl text-white/20 hover:text-red-400 hover:bg-white/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
