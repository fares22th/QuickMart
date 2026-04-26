import { Outlet, Link } from 'react-router-dom'

const stats = [
  { value: '+٢٠٠', label: 'متجر شريك' },
  { value: '+٥٠ألف', label: 'عميل نشط' },
  { value: '٩٨٪', label: 'رضا العملاء' },
]

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex font-cairo" dir="rtl">

      {/* ── Left Branding Panel ────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #00C896 0%, #00A878 40%, #007A58 100%)' }}>

        {/* Background decoration circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
          <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
          {/* Subtle grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 5h13M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"/>
              </svg>
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">QuickMart</span>
          </Link>
        </div>

        {/* Central illustration / content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8 py-16">
          {/* Shopping illustration */}
          <div className="w-72 h-72 mb-10 relative">
            <div className="absolute inset-0 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-56 h-56 text-white" fill="none" stroke="currentColor">
                {/* Cart body */}
                <rect x="40" y="80" width="120" height="80" rx="12" strokeWidth="6" fill="rgba(255,255,255,0.15)"/>
                {/* Cart handle */}
                <path d="M 30 55 Q 30 80 40 80" strokeWidth="6" strokeLinecap="round"/>
                <path d="M 30 55 L 170 55" strokeWidth="6" strokeLinecap="round"/>
                <path d="M 170 55 Q 170 80 160 80" strokeWidth="6" strokeLinecap="round"/>
                {/* Wheels */}
                <circle cx="75" cy="178" r="14" strokeWidth="6" fill="rgba(255,255,255,0.2)"/>
                <circle cx="130" cy="178" r="14" strokeWidth="6" fill="rgba(255,255,255,0.2)"/>
                {/* Items in cart */}
                <rect x="60" y="95" width="30" height="35" rx="6" strokeWidth="4" fill="rgba(255,255,255,0.25)"/>
                <rect x="100" y="90" width="25" height="40" rx="6" strokeWidth="4" fill="rgba(255,255,255,0.25)"/>
                <rect x="133" y="98" width="20" height="32" rx="6" strokeWidth="4" fill="rgba(255,255,255,0.25)"/>
                {/* Star badge */}
                <circle cx="155" cy="45" r="18" strokeWidth="4" fill="rgba(255,255,255,0.2)"/>
                <text x="155" y="52" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" stroke="none">★</text>
              </svg>
            </div>
            {/* Floating badges */}
            <div className="absolute -top-2 -right-4 bg-white rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2">
              <span className="text-lg">🚀</span>
              <div>
                <p className="text-xs font-bold text-gray-800">توصيل سريع</p>
                <p className="text-xs text-gray-500">خلال ساعات</p>
              </div>
            </div>
            <div className="absolute -bottom-2 -left-4 bg-white rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2">
              <span className="text-lg">💳</span>
              <div>
                <p className="text-xs font-bold text-gray-800">دفع آمن</p>
                <p className="text-xs text-gray-500">١٠٠٪ مضمون</p>
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            تسوّق بذكاء،<br />وفّر أكثر
          </h2>
          <p className="text-white/75 text-lg leading-relaxed max-w-sm">
            آلاف المنتجات من أفضل المتاجر في مكان واحد — بأسعار لا تُقاوم
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center bg-white/10 backdrop-blur rounded-2xl py-4 px-2">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-white/70 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Form Panel ──────────────────────── */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden px-6 pt-8 pb-4">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#00C896' }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 5h13M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"/>
              </svg>
            </div>
            <span className="text-xl font-bold" style={{ color: '#00C896' }}>QuickMart</span>
          </Link>
        </div>

        {/* Form centered */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pb-6 px-4">
          © {new Date().getFullYear()} QuickMart — جميع الحقوق محفوظة
        </p>
      </div>

    </div>
  )
}
