import { useState, useRef, useEffect } from 'react'
import { Bell, ChevronDown, ShieldCheck, LogOut, User, Settings } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { getAdminStats } from '@/api/admin.api'
import { useLocation, Link, useNavigate } from 'react-router-dom'

const PAGE_NAMES = {
  '/admin':              { title: 'نظرة عامة',     sub: 'لوحة تحكم المنصة الشاملة' },
  '/admin/analytics':   { title: 'التحليلات',      sub: 'إحصائيات ومخططات المبيعات' },
  '/admin/alerts':      { title: 'التنبيهات',      sub: 'تنبيهات النظام والتقارير' },
  '/admin/sellers':     { title: 'البائعون',        sub: 'مراجعة وإدارة حسابات البائعين' },
  '/admin/customers':   { title: 'العملاء',         sub: 'إدارة ومتابعة حسابات العملاء' },
  '/admin/drivers':     { title: 'المندوبون',       sub: 'إدارة فريق التوصيل' },
  '/admin/orders':      { title: 'الطلبات',         sub: 'متابعة جميع طلبات المنصة' },
  '/admin/commissions': { title: 'العمولات',        sub: 'إدارة العمولات والمدفوعات' },
  '/admin/disputes':    { title: 'النزاعات',        sub: 'حل النزاعات بين الأطراف' },
  '/admin/ads':         { title: 'الإعلانات',       sub: 'إدارة حملات الإعلانات' },
  '/admin/settings':    { title: 'الإعدادات',       sub: 'إعدادات النظام والصلاحيات' },
  '/admin/profile':     { title: 'الملف الشخصي',   sub: 'معلوماتك الشخصية وكلمة المرور' },
}

function UserDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 pr-2 pl-3 py-1.5 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors"
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-extrabold"
          style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}
        >
          {user?.name?.[0] ?? 'A'}
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-gray-800 leading-none">{user?.name ?? 'المشرف'}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">مشرف</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          dir="rtl"
        >
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}
              >
                {user?.name?.[0] ?? 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.name ?? 'المشرف'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.phone ?? user?.email ?? 'مشرف النظام'}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <Link
              to="/admin/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4 text-gray-400" />
              الملف الشخصي
            </Link>
            <Link
              to="/admin/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-400" />
              إعدادات المنصة
            </Link>
          </div>

          <div className="border-t border-gray-100 py-1.5">
            <button
              onClick={() => { setOpen(false); onLogout() }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminTopbar() {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { data: stats } = useQuery({ queryKey: ['admin-stats'], queryFn: getAdminStats })

  const page = PAGE_NAMES[pathname] ?? PAGE_NAMES['/admin']

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30" dir="rtl">
      {/* Left: page title */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-sm font-extrabold text-gray-900 leading-none">{page.title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{page.sub}</p>
        </div>
        {stats?.openDisputes > 0 && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#DC2626' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {stats.openDisputes} نزاع مفتوح
          </div>
        )}
        {stats?.pendingSellers > 0 && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
            style={{ background: 'rgba(251,191,36,0.1)', color: '#D97706' }}>
            {stats.pendingSellers} بائع ينتظر
          </div>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          {(stats?.pendingSellers ?? 0) + (stats?.openDisputes ?? 0) > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          )}
        </button>

        <UserDropdown user={user} onLogout={handleLogout} />
      </div>
    </header>
  )
}
