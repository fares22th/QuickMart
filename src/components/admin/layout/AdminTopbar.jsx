import { useState } from 'react'
import { Bell, Search, Menu, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function AdminTopbar({ onMenuOpen }) {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const [userMenu, setUserMenu] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-5 gap-4 shrink-0 z-20">
      {/* Mobile menu button */}
      <button
        onClick={onMenuOpen}
        className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="بحث في النظام..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pr-9 pl-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 mr-auto">

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="w-px h-5 bg-gray-200" />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenu(v => !v)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-bold">
              {profile?.name?.[0] ?? 'م'}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-gray-800 leading-none">{profile?.name ?? 'مدير'}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Super Admin</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userMenu ? 'rotate-180' : ''}`} />
          </button>

          {userMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
              <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-20 overflow-hidden">
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <User className="w-4 h-4 text-gray-400" />
                  الملف الشخصي
                </button>
                <button
                  onClick={() => { navigate('/admin/settings'); setUserMenu(false) }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  الإعدادات
                </button>
                <div className="h-px bg-gray-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
