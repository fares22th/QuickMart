import { Outlet, Link } from 'react-router-dom'

const features = [
  { icon: '🛡️', label: 'وصول كامل للوحة التحكم' },
  { icon: '📈', label: 'تقارير المنصة الشاملة' },
  { icon: '👥', label: 'إدارة البائعين والعملاء' },
  { icon: '⚙️', label: 'إعدادات النظام والصلاحيات' },
]

export default function AdminAuthLayout() {
  return (
    <div className="min-h-screen flex font-cairo" dir="rtl">

      {/* ── Left Branding Panel ── dark purple/admin theme */}
      <div
        className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)' }}
      >
        {/* Decorative */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #a5b4fc 0%, transparent 70%)' }} />
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="adminGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#a5b4fc" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#adminGrid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-500/30 backdrop-blur border border-indigo-400/30 rounded-2xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">QuickMart</span>
              <span className="block text-xs text-indigo-300 -mt-0.5">لوحة الإدارة</span>
            </div>
          </Link>
        </div>

        {/* Center */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          {/* Shield icon */}
          <div className="w-20 h-20 rounded-3xl bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center mb-8">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
            وصول آمن<br />للإدارة
          </h2>
          <p className="text-indigo-200/70 text-base mb-10 leading-relaxed">
            منطقة مقيّدة — يتطلب الوصول رمز دعوة صادراً من مدير النظام
          </p>

          {/* Feature list */}
          <div className="space-y-3">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center shrink-0 text-base">
                  {f.icon}
                </div>
                <span className="text-indigo-100/80 text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning badge */}
        <div className="relative z-10 flex items-center gap-3 bg-amber-500/10 border border-amber-400/20 rounded-2xl p-4">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p className="text-amber-200/80 text-xs leading-relaxed">
            هذه المنطقة محمية — إذا لم يكن لديك رمز دعوة تواصل مع المسؤول
          </p>
        </div>
      </div>

      {/* ── Right Form Panel ── dark bg */}
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ background: '#0f0e1a' }}>
        {/* Mobile logo */}
        <div className="lg:hidden px-6 pt-8 pb-4">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold text-indigo-400">QuickMart</span>
              <span className="block text-xs text-gray-500 -mt-0.5">لوحة الإدارة</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 pb-6">
          © {new Date().getFullYear()} QuickMart — وصول مقيّد
        </p>
      </div>
    </div>
  )
}
