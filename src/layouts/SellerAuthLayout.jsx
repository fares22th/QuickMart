import { Outlet, Link } from 'react-router-dom'

const perks = [
  { icon: '📦', title: 'إدارة المنتجات', desc: 'أضف وعدّل منتجاتك بسهولة' },
  { icon: '📊', title: 'تقارير مفصّلة', desc: 'تابع مبيعاتك وأرباحك لحظة بلحظة' },
  { icon: '🚀', title: 'وصول واسع', desc: 'آلاف العملاء ينتظرون منتجاتك' },
  { icon: '💰', title: 'دفع سريع', desc: 'استلم أرباحك أسبوعياً بدون تعقيد' },
]

export default function SellerAuthLayout() {
  return (
    <div className="min-h-screen flex font-cairo" dir="rtl">

      {/* ── Left Branding Panel ── amber/seller theme */}
      <div
        className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-28 -left-28 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 -right-24 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="2" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏪</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">QuickMart</span>
              <span className="block text-xs text-white/70 -mt-0.5">بوابة البائعين</span>
            </div>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
            ابدأ رحلة<br />البيع اليوم
          </h2>
          <p className="text-white/75 text-lg mb-10 leading-relaxed">
            انضم لآلاف البائعين الناجحين وحقّق دخلاً إضافياً من منزلك
          </p>

          {/* Perks grid */}
          <div className="grid grid-cols-2 gap-4">
            {perks.map((p) => (
              <div key={p.title} className="bg-white/10 backdrop-blur rounded-2xl p-4 flex flex-col gap-2">
                <span className="text-2xl">{p.icon}</span>
                <p className="text-white font-bold text-sm">{p.title}</p>
                <p className="text-white/65 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl p-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <span className="text-xl">⭐</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">متوسط دخل البائع</p>
            <p className="text-white/70 text-xs mt-0.5">+٨٥٠٠ ريال شهرياً للبائع النشط</p>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden px-6 pt-8 pb-4">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-500">
              <span className="text-lg">🏪</span>
            </div>
            <div>
              <span className="text-lg font-bold text-amber-600">QuickMart</span>
              <span className="block text-xs text-gray-400 -mt-0.5">بوابة البائعين</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-6">
          © {new Date().getFullYear()} QuickMart — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  )
}
