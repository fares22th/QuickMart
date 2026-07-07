import { Outlet, Link } from 'react-router-dom'
import { ShoppingBag, Zap, Star, Shield } from 'lucide-react'

const FLOATERS = [
  { icon: '🚀', title: 'توصيل سريع', sub: 'خلال ساعات', top: '12%', right: '-5%' },
  { icon: '💳', title: 'دفع آمن', sub: '١٠٠٪ مضمون', bottom: '20%', right: '-4%' },
  { icon: '⭐', title: '٤.٩ تقييم', sub: '+٥٠ ألف مراجعة', bottom: '38%', left: '-4%' },
]

const STATS = [
  { value: '+٢٠٠', label: 'متجر', icon: ShoppingBag },
  { value: '٩٨٪',  label: 'رضا',  icon: Star        },
  { value: '٢٤/٧', label: 'دعم',  icon: Shield      },
]

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex font-cairo" dir="rtl">

      {/* ━━ Left branding panel ━━ */}
      <div
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col"
        style={{ background: 'linear-gradient(150deg, #022c22 0%, #064E3B 35%, #065F46 65%, #047857 100%)' }}
      >
        {/* Mesh pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }}>
          <defs>
            <pattern id="cust-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#6EE7B7" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cust-grid)" />
        </svg>

        {/* Glow orbs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,200,150,0.22) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-16 left-1/4 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,200,150,0.12) 0%, transparent 70%)' }} />

        {/* Floating cards */}
        {FLOATERS.map((f) => (
          <div
            key={f.title}
            className="absolute flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-3.5 py-2.5 shadow-xl"
            style={{ top: f.top, bottom: f.bottom, right: f.right, left: f.left, zIndex: 20 }}
          >
            <span className="text-xl leading-none">{f.icon}</span>
            <div>
              <p className="text-white text-xs font-bold leading-none">{f.title}</p>
              <p className="text-white/60 text-[10px] mt-0.5">{f.sub}</p>
            </div>
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3 mb-auto">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'rgba(0,200,150,0.25)', border: '1px solid rgba(0,200,150,0.3)' }}
            >
              <ShoppingBag className="w-5 h-5 text-green-300" />
            </div>
            <div>
              <p className="text-white font-extrabold text-xl leading-none">QuickMart</p>
              <p className="text-green-400/60 text-xs mt-0.5">تسوّق بذكاء</p>
            </div>
          </Link>

          {/* Center */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Big cart illustration */}
            <div className="relative w-64 h-64 mx-auto mb-10">
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,200,150,0.12)', border: '1px solid rgba(0,200,150,0.2)' }}
              >
                <svg viewBox="0 0 160 160" className="w-48 h-48" fill="none">
                  <rect x="25" y="60" width="110" height="70" rx="14" fill="rgba(0,200,150,0.18)" stroke="rgba(110,231,183,0.5)" strokeWidth="2"/>
                  <path d="M20 42 L140 42" stroke="rgba(110,231,183,0.6)" strokeWidth="5" strokeLinecap="round"/>
                  <path d="M20 42 Q18 62 25 62" stroke="rgba(110,231,183,0.6)" strokeWidth="5" strokeLinecap="round"/>
                  <path d="M140 42 Q142 62 135 62" stroke="rgba(110,231,183,0.6)" strokeWidth="5" strokeLinecap="round"/>
                  <circle cx="58" cy="146" r="10" fill="rgba(0,200,150,0.3)" stroke="rgba(110,231,183,0.5)" strokeWidth="2"/>
                  <circle cx="102" cy="146" r="10" fill="rgba(0,200,150,0.3)" stroke="rgba(110,231,183,0.5)" strokeWidth="2"/>
                  <rect x="42" y="76" width="24" height="30" rx="6" fill="rgba(110,231,183,0.25)" stroke="rgba(110,231,183,0.4)" strokeWidth="1.5"/>
                  <rect x="75" y="72" width="20" height="34" rx="6" fill="rgba(110,231,183,0.25)" stroke="rgba(110,231,183,0.4)" strokeWidth="1.5"/>
                  <rect x="103" y="80" width="18" height="26" rx="6" fill="rgba(110,231,183,0.25)" stroke="rgba(110,231,183,0.4)" strokeWidth="1.5"/>
                  <circle cx="118" cy="38" r="14" fill="rgba(0,200,150,0.2)" stroke="rgba(110,231,183,0.4)" strokeWidth="1.5"/>
                  <text x="118" y="44" textAnchor="middle" fill="rgba(110,231,183,0.9)" fontSize="16" fontWeight="bold">★</text>
                </svg>
              </div>
            </div>

            <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight text-center">
              تسوّق بذكاء،<br />
              <span style={{ color: '#6EE7B7' }}>وفّر أكثر</span>
            </h2>
            <p className="text-center text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              آلاف المنتجات من أفضل المتاجر<br />في مكان واحد — بأسعار لا تُقاوم
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-10">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="text-center rounded-2xl py-4 px-2"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: '#6EE7B7' }} />
                <p className="text-xl font-extrabold text-white">{value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ━━ Right form panel ━━ */}
      <div
        className="flex-1 flex flex-col overflow-y-auto"
        style={{ background: 'linear-gradient(160deg, #F0FDF4 0%, #ECFDF5 50%, #F0FDFA 100%)' }}
      >
        {/* Mobile logo */}
        <div className="lg:hidden px-6 pt-8 pb-4">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00C896, #00A878)' }}>
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-extrabold" style={{ color: '#00A878' }}>QuickMart</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-sm">
            {/* Form card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-green-100/50 p-8 border border-green-50">
              <Outlet />
            </div>
          </div>
        </div>

        <p className="text-center text-xs pb-6" style={{ color: '#9CA3AF' }}>
          © {new Date().getFullYear()} QuickMart — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  )
}
