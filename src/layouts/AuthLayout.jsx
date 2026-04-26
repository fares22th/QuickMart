import { Outlet, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSwitcher from '@/components/common/LanguageSwitcher'

const LOGO_SVG = (
  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 5h13M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
)

const CART_SVG = (
  <svg viewBox="0 0 200 200" className="w-56 h-56 text-white" fill="none" stroke="currentColor">
    <rect x="40" y="80" width="120" height="80" rx="12" strokeWidth="6" fill="rgba(255,255,255,0.15)" />
    <path d="M 30 55 Q 30 80 40 80" strokeWidth="6" strokeLinecap="round" />
    <path d="M 30 55 L 170 55" strokeWidth="6" strokeLinecap="round" />
    <path d="M 170 55 Q 170 80 160 80" strokeWidth="6" strokeLinecap="round" />
    <circle cx="75" cy="178" r="14" strokeWidth="6" fill="rgba(255,255,255,0.2)" />
    <circle cx="130" cy="178" r="14" strokeWidth="6" fill="rgba(255,255,255,0.2)" />
    <rect x="60" y="95" width="30" height="35" rx="6" strokeWidth="4" fill="rgba(255,255,255,0.25)" />
    <rect x="100" y="90" width="25" height="40" rx="6" strokeWidth="4" fill="rgba(255,255,255,0.25)" />
    <rect x="133" y="98" width="20" height="32" rx="6" strokeWidth="4" fill="rgba(255,255,255,0.25)" />
    <circle cx="155" cy="45" r="18" strokeWidth="4" fill="rgba(255,255,255,0.2)" />
    <text x="155" y="52" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" stroke="none">★</text>
  </svg>
)

export default function AuthLayout() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const isRtl = i18n.language === 'ar'

  const stats = [
    { value: t('stats.stores'),       label: t('stats.stores_label')       },
    { value: t('stats.customers'),     label: t('stats.customers_label')     },
    { value: t('stats.satisfaction'),  label: t('stats.satisfaction_label')  },
  ]

  return (
    <div className="min-h-screen flex font-cairo" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 40%, #14532d 100%)' }}>

        {/* Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
          <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
            <defs>
              <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-grid)" />
          </svg>
        </div>

        {/* Logo + language switcher */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg">
              {LOGO_SVG}
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">{t('brand')}</span>
          </Link>
          <LanguageSwitcher />
        </div>

        {/* Illustration + text */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8 py-16">
          <motion.div
            className="w-72 h-72 mb-10 relative"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
              {CART_SVG}
            </div>
            {/* Floating badges */}
            <motion.div
              className="absolute -top-2 -right-4 bg-white rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2"
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-xl">🚀</span>
              <div>
                <p className="text-xs font-bold text-gray-800 whitespace-nowrap">{t('features.delivery')}</p>
                <p className="text-xs text-gray-500">{t('features.delivery_sub')}</p>
              </div>
            </motion.div>
            <motion.div
              className="absolute -bottom-2 -left-4 bg-white rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2"
              animate={{ rotate: [2, -2, 2] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-xl">💳</span>
              <div>
                <p className="text-xs font-bold text-gray-800 whitespace-nowrap">{t('features.payment')}</p>
                <p className="text-xs text-gray-500">{t('features.payment_sub')}</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-4xl font-bold text-white mb-4 leading-tight"
            key={i18n.language + '-tagline'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {t('tagline')}
          </motion.h2>
          <motion.p
            className="text-white/75 text-lg leading-relaxed max-w-sm"
            key={i18n.language + '-sub'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {t('tagline_sub')}
          </motion.p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {stats.map(s => (
            <div key={s.label} className="text-center bg-white/10 backdrop-blur rounded-2xl py-4 px-2">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-white/70 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">

        {/* Mobile header */}
        <div className="lg:hidden px-6 pt-8 pb-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-600">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 5h13M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-green-600">{t('brand')}</span>
          </Link>
          <LanguageSwitcherMobile />
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-6 px-4">
          © {new Date().getFullYear()} {t('brand')} — {t('copyright')}
        </p>
      </div>
    </div>
  )
}

function LanguageSwitcherMobile() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  return (
    <button
      onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold transition-all active:scale-95"
    >
      <span>{isAr ? '🇺🇸' : '🇸🇦'}</span>
      <span className="text-xs">{isAr ? 'EN' : 'ع'}</span>
    </button>
  )
}
