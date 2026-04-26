import { useState } from 'react'
import { Menu, Bell, Search, ChevronDown, Settings, LogOut, Store, ExternalLink, X, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { getMyStore } from '@/api/stores.api'

const MOCK_NOTIFS = [
  { id: '1', type: 'order',   title: 'طلب جديد #4921',       body: 'أحمد الزبون — ١٢٠ ر.س',        time: 'منذ ٢ د',   read: false },
  { id: '2', type: 'stock',   title: 'مخزون منخفض',           body: 'عصير برتقال — ٣ قطع متبقية',   time: 'منذ ١٥ د',  read: false },
  { id: '3', type: 'review',  title: 'تقييم جديد ⭐⭐⭐⭐⭐',    body: 'نورة القحطاني — ممتاز جداً',   time: 'منذ ٤٠ د',  read: true  },
  { id: '4', type: 'payment', title: 'تم تحويل مبلغ',         body: '٢,٨٤٠ ر.س إلى حسابك',          time: 'منذ ١ س',   read: true  },
]

const TYPE_ICONS = {
  order:   { bg: 'bg-blue-100',   text: 'text-blue-600',   char: '📦' },
  stock:   { bg: 'bg-amber-100',  text: 'text-amber-600',  char: '⚠️' },
  review:  { bg: 'bg-violet-100', text: 'text-violet-600', char: '⭐' },
  payment: { bg: 'bg-green-100',  text: 'text-green-600',  char: '💰' },
}

export default function SellerTopbar({ onMenuOpen }) {
  const [notifOpen,   setNotifOpen]   = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifs,      setNotifs]      = useState(MOCK_NOTIFS)
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  const { data: store } = useQuery({
    queryKey: ['my-store'],
    queryFn:  getMyStore,
    retry: false,
  })

  const unread = notifs.filter(n => !n.read).length
  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })))

  const STATUS_COLORS = {
    active:    'bg-green-500',
    pending:   'bg-amber-500',
    suspended: 'bg-red-500',
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 shrink-0 z-20 sticky top-0">
      {/* Left: mobile menu + store info */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuOpen} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        {store && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
              {store.logo_url
                ? <img src={store.logo_url} alt="" className="w-full h-full object-cover" />
                : <Store className="w-4 h-4 text-gray-400" />}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-800 leading-none">{store.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[store.status] ?? 'bg-gray-400'}`} />
                <span className="text-[10px] text-gray-400">
                  {store.status === 'active' ? 'نشط' : store.status === 'pending' ? 'قيد المراجعة' : 'موقوف'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right: search + bell + avatar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-52">
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input placeholder="بحث سريع..." className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full" />
          <kbd className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute left-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                  <p className="font-bold text-gray-900 text-sm">الإشعارات</p>
                  <div className="flex items-center gap-2">
                    {unread > 0 && (
                      <button onClick={markAllRead} className="text-[10px] text-green-600 font-semibold hover:underline">
                        تعليم الكل كمقروء
                      </button>
                    )}
                    <button onClick={() => setNotifOpen(false)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100">
                      <X className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {notifs.map(n => {
                    const m = TYPE_ICONS[n.type] ?? TYPE_ICONS.order
                    return (
                      <div key={n.id} className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 ${!n.read ? 'bg-blue-50/40' : ''}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${m.bg}`}>
                          {n.type === 'order' ? '📦' : n.type === 'stock' ? '⚠️' : n.type === 'review' ? '⭐' : '💰'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-gray-800">{n.title}</p>
                            {!n.read && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />}
                          </div>
                          <p className="text-[11px] text-gray-500 truncate">{n.body}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
              {profile?.name?.[0] ?? 'ب'}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[80px] truncate">{profile?.name ?? 'البائع'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
              <div className="absolute left-0 top-12 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 py-1.5 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-gray-50">
                  <p className="text-sm font-bold text-gray-800">{profile?.name ?? 'البائع'}</p>
                  <p className="text-xs text-gray-400">{store?.name ?? 'متجري'}</p>
                </div>
                {[
                  { icon: Settings,    label: 'إعدادات المتجر', action: () => { navigate('/seller/settings'); setProfileOpen(false) } },
                  { icon: ExternalLink, label: 'عرض المتجر',   action: () => { navigate('/store/' + store?.id); setProfileOpen(false) } },
                ].map(item => (
                  <button key={item.label} onClick={item.action}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <item.icon className="w-4 h-4 text-gray-400" />
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-gray-50 mt-1">
                  <button onClick={() => { logout(); navigate('/seller/login') }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
