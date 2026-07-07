import { Outlet, Link } from 'react-router-dom'
import { ShieldCheck, BarChart2, Users, Settings, AlertTriangle, Lock } from 'lucide-react'

const FEATURES = [
  { icon: ShieldCheck, label: 'وصول كامل للوحة التحكم',    color: '#A5B4FC' },
  { icon: BarChart2,   label: 'تقارير المنصة الشاملة',      color: '#6EE7B7' },
  { icon: Users,       label: 'إدارة البائعين والعملاء',     color: '#93C5FD' },
  { icon: Settings,    label: 'إعدادات النظام والصلاحيات',   color: '#FDE68A' },
]

export default function AdminAuthLayout() {
  return (
    <div className="min-h-screen flex font-cairo" dir="rtl">

      {/* ━━ Left branding panel ━━ */}
      <div
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col"
        style={{ background: 'linear-gradient(150deg, #0F0C29 0%, #1e1b4b 40%, #24215a 70%, #2d2b75 100%)' }}
      >
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }}>
          <defs>
            <pattern id="admin-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#818CF8" strokeWidth="0.7"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#admin-grid)" />
        </svg>

        {/* Glow orbs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.18) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />

        {/* Floating badge - top right */}
        <div
          className="absolute top-[13%] right-[-5%] flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(14px)', border: '1px solid rgba(165,180,252,0.2)', zIndex: 20 }}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,0.3)' }}>
            <ShieldCheck className="w-4 h-4 text-indigo-300" />
          </div>
          <div>
            <p className="text-white font-extrabold text-sm leading-none">منطقة آمنة</p>
            <p className="text-indigo-300/60 text-[10px] mt-0.5">تشفير SSL 256-bit</p>
          </div>
        </div>

        {/* Floating badge - bottom left */}
        <div
          className="absolute bottom-[22%] left-[-5%] flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(14px)', border: '1px solid rgba(165,180,252,0.2)', zIndex: 20 }}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(52,211,153,0.2)' }}>
            <BarChart2 className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-white font-extrabold text-sm leading-none">تحليلات حية</p>
            <p className="text-indigo-300/60 text-[10px] mt-0.5">بيانات محدّثة كل دقيقة</p>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3 mb-auto">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
            >
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-extrabold text-xl leading-none">QuickMart</p>
              <p className="text-indigo-400/50 text-xs mt-0.5">لوحة الإدارة</p>
            </div>
          </Link>

          {/* Center */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Shield big icon */}
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-2xl"
              style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(165,180,252,0.2)' }}
            >
              <Lock className="w-12 h-12" style={{ color: '#A5B4FC' }} />
            </div>

            <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
              وصول آمن<br />
              <span style={{ color: '#A5B4FC' }}>للإدارة</span>
            </h2>
            <p className="text-base mb-10 leading-relaxed" style={{ color: 'rgba(199,210,254,0.55)' }}>
              منطقة مقيّدة — يتطلب الوصول<br />صلاحيات مشرف النظام
            </p>

            {/* Feature list */}
            <div className="space-y-3">
              {FEATURES.map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <span className="text-sm" style={{ color: 'rgba(199,210,254,0.7)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div
            className="flex items-center gap-3 rounded-2xl p-4 mt-8"
            style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.18)' }}
          >
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(253,230,138,0.75)' }}>
              تواصل مع مدير النظام للحصول على صلاحية الوصول
            </p>
          </div>
        </div>
      </div>

      {/* ━━ Right form panel ━━ */}
      <div
        className="flex-1 flex flex-col overflow-y-auto"
        style={{ background: 'linear-gradient(160deg, #EEF2FF 0%, #E0E7FF 40%, #EEF2FF 100%)' }}
      >
        {/* Mobile logo */}
        <div className="lg:hidden px-6 pt-8 pb-4">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}>
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold" style={{ color: '#4F46E5' }}>QuickMart Admin</p>
              <p className="text-xs text-gray-400 -mt-0.5">لوحة الإدارة</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/70 p-8 border border-indigo-50">
              <Outlet />
            </div>
          </div>
        </div>

        <p className="text-center text-xs pb-6" style={{ color: '#6366F1', opacity: 0.4 }}>
          © {new Date().getFullYear()} QuickMart — وصول مقيّد للمشرفين فقط
        </p>
      </div>
    </div>
  )
}
