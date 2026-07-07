import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, User, Search, MapPin, ChevronDown, Bell, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useLocationStore } from '@/store/useLocationStore'

export default function Navbar() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { items } = useCartStore()
  const { user } = useAuthStore()
  const { address } = useLocationStore()
  const totalItems = items.reduce((s, i) => s + i.qty, 0)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className={`sticky top-0 z-40 bg-white transition-all duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      {/* ── Top bar ── */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#00C896,#00A878)' }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 5h13M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold hidden sm:block" style={{ color: '#00C896' }}>QuickMart</span>
          </Link>

          {/* Location picker — desktop */}
          <button className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors shrink-0 border border-gray-100">
            <MapPin className="w-4 h-4 shrink-0" style={{ color: '#00C896' }} />
            <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{address || 'الرياض'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="ابحث عن منتجات، متاجر، أو فئات..."
                className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-800 placeholder:text-gray-400 transition-all duration-200 outline-none focus:bg-white focus:border-[#00C896] focus:shadow-[0_0_0_3px_rgba(0,200,150,0.1)]"
              />
            </div>
          </form>

          {/* Actions — desktop */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            <Link to="/wishlist" className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
              <Heart className="w-5 h-5 text-gray-500 group-hover:text-red-400 transition-colors" />
            </Link>

            <Link to={user ? '/profile' : '/login'}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                {user?.avatar
                  ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                  : <User className="w-4 h-4 text-gray-500" />
                }
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user ? user.name?.split(' ')[0] : 'دخول'}
              </span>
            </Link>

            <Link to="/cart" className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors"
              style={{ background: totalItems > 0 ? 'rgba(0,200,150,0.08)' : undefined }}>
              <div className="relative">
                <ShoppingCart className="w-5 h-5" style={{ color: '#00C896' }} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -left-2 w-4 h-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    style={{ background: '#00C896' }}>
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold" style={{ color: '#00C896' }}>السلة</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2 shrink-0">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -left-0.5 w-4 h-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{ background: '#00C896' }}>{totalItems}</span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(v => !v)} className="p-2">
              {menuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <button className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm text-gray-700">
            <MapPin className="w-4 h-4" style={{ color: '#00C896' }} />
            {address || 'تحديد الموقع'}
          </button>
          <Link to={user ? '/profile' : '/login'} className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm text-gray-700">
            <User className="w-4 h-4 text-gray-500" />
            {user ? user.name : 'تسجيل الدخول'}
          </Link>
          <Link to="/wishlist" className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm text-gray-700">
            <Heart className="w-4 h-4 text-gray-500" />
            المفضلة
          </Link>
        </div>
      )}

      {/* ── Category strip ── */}
      <CategoryStrip />
    </header>
  )
}

const QUICK_CATS = [
  { emoji: '🍕', name: 'مطاعم', slug: 'restaurants' },
  { emoji: '🥦', name: 'خضروات', slug: 'vegetables' },
  { emoji: '🍗', name: 'لحوم', slug: 'meat' },
  { emoji: '🥛', name: 'ألبان', slug: 'dairy' },
  { emoji: '🥤', name: 'مشروبات', slug: 'drinks' },
  { emoji: '🍰', name: 'حلويات', slug: 'sweets' },
  { emoji: '🧴', name: 'عناية', slug: 'care' },
  { emoji: '📱', name: 'إلكترونيات', slug: 'electronics' },
  { emoji: '🏠', name: 'منزل', slug: 'home' },
  { emoji: '👗', name: 'ملابس', slug: 'fashion' },
  { emoji: '🌿', name: 'عضوي', slug: 'organic' },
  { emoji: '🐾', name: 'حيوانات', slug: 'pets' },
]

function CategoryStrip() {
  return (
    <div className="border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide py-2">
          {QUICK_CATS.map(c => (
            <Link key={c.slug} to={`/category/${c.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-600 hover:bg-[#E6FAF5] hover:text-[#00C896] transition-all shrink-0 whitespace-nowrap">
              <span className="text-base leading-none">{c.emoji}</span>
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
