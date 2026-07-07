import { Outlet, Link } from 'react-router-dom'
import { Zap, TrendingUp, Package, DollarSign, Users } from 'lucide-react'

const PERKS = [
  { icon: Package,    title: 'إدارة المنتجات',  desc: 'أضف وعدّل منتجاتك بسهولة',         color: '#FCD34D' },
  { icon: TrendingUp, title: 'تقارير مفصّلة',   desc: 'تابع مبيعاتك لحظة بلحظة',           color: '#FCA5A5' },
  { icon: Users,      title: 'وصول واسع',        desc: 'آلاف العملاء ينتظرون منتجاتك',      color: '#93C5FD' },
  { icon: DollarSign, title: 'دفع أسبوعي',       desc: 'استلم أرباحك بدون تعقيد',           color: '#86EFAC' },
]

export default function SellerAuthLayout() {
  return (
    <div className="min-h-screen flex font-cairo" dir="rtl">

      {/* ━━ Left branding panel ━━ */}
      <div
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col"
        style={{ background: 'linear-gradient(150deg, #451A03 0%, #78350F 35%, #92400E 65%, #B45309 100%)' }}
      >
        {/* Dots pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.07 }}>
          <defs>
            <pattern id="seller-dots" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="2" fill="#FCD34D"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#seller-dots)" />
        </svg>

        {/* Glow orbs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.28) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)' }} />

        {/* Floating revenue card */}
        <div
          className="absolute top-[14%] right-[-5%] flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', zIndex: 20 }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(252,211,77,0.2)' }}>
            <DollarSign className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <p className="text-white font-extrabold text-sm leading-none">+٨٥٠٠ ريال</p>
            <p className="text-white/50 text-[10px] mt-0.5">متوسط دخل شهري</p>
          </div>
        </div>

        <div
          className="absolute bottom-[24%] left-[-5%] flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', zIndex: 20 }}
        >
          <span className="text-2xl">⭐</span>
          <div>
            <p className="text-white font-extrabold text-sm leading-none">٤.٩ تقييم</p>
            <p className="text-white/50 text-[10px] mt-0.5">متوسط تقييم البائعين</p>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3 mb-auto">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'rgba(245,158,11,0.25)', border: '1px solid rgba(252,211,77,0.3)' }}
            >
              <Zap className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <p className="text-white font-extrabold text-xl leading-none">QuickMart</p>
              <p className="text-yellow-400/60 text-xs mt-0.5">بوابة البائعين</p>
            </div>
          </Link>

          {/* Center */}
          <div className="flex-1 flex flex-col justify-center">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-2xl"
              style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(252,211,77,0.25)' }}
            >
              <Zap className="w-10 h-10 text-yellow-300" />
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
              ابدأ رحلة<br />
              <span style={{ color: '#FCD34D' }}>البيع اليوم</span>
            </h2>
            <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
              انضم لآلاف البائعين الناجحين وحقّق<br />دخلاً إضافياً من منزلك
            </p>

            {/* Perks grid */}
            <div className="grid grid-cols-2 gap-3">
              {PERKS.map(({ icon: Icon, title, desc, color }) => (
                <div
                  key={title}
                  className="rounded-2xl p-4"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <p className="text-white font-bold text-sm leading-none mb-1">{title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ━━ Right form panel ━━ */}
      <div
        className="flex-1 flex flex-col overflow-y-auto"
        style={{ background: 'linear-gradient(160deg, #FFFBEB 0%, #FEF3C7 30%, #FFFBEB 100%)' }}
      >
        {/* Mobile logo */}
        <div className="lg:hidden px-6 pt-8 pb-4">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-amber-700">QuickMart</p>
              <p className="text-xs text-amber-400/70 -mt-0.5">بوابة البائعين</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/60 p-8 border border-amber-50">
              <Outlet />
            </div>
          </div>
        </div>

        <p className="text-center text-xs pb-6" style={{ color: '#D97706', opacity: 0.5 }}>
          © {new Date().getFullYear()} QuickMart — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  )
}
