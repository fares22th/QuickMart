import { useState, useRef, useEffect } from 'react'
import { Bell, ChevronDown, TrendingUp, LogOut, User, Settings, Store } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { getSellerStats } from '@/api/seller.api'
import { Link, useNavigate } from 'react-router-dom'

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
        className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ background: 'linear-gradient(135deg, #00C896, #00A878)' }}
        >
          {user?.name?.[0] ?? 'B'}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          dir="rtl"
        >
          {/* User info card */}
          <div className="px-4 py-3 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold shrink-0"
                style={{ background: 'linear-gradient(135deg, #00C896, #00A878)' }}
              >
                {user?.name?.[0] ?? 'B'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.name ?? 'البائع'}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <p className="text-xs text-gray-400">بائع نشط</p>
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="py-1.5">
            <Link
              to="/seller/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4 text-gray-400" />
              الملف الشخصي
            </Link>
            <Link
              to="/seller/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Store className="w-4 h-4 text-gray-400" />
              إعدادات المتجر
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

export default function SellerTopbar() {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { data: stats } = useQuery({ queryKey: ['seller-stats'], queryFn: getSellerStats })

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور'

  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <header className="h-16 bg-white/80 backdrop-blur border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: greeting */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs text-gray-400 leading-none">{greeting}،</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5">{user?.name ?? 'البائع'}</p>
        </div>
        {stats?.pendingOrders > 0 && (
          <div
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{ background: 'rgba(0,200,150,0.1)', color: '#00A878' }}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            {stats.pendingOrders} طلب جديد
          </div>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          {stats?.pendingOrders > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: '#00C896' }} />
          )}
        </button>

        <UserDropdown user={user} onLogout={handleLogout} />
      </div>
    </header>
  )
}
