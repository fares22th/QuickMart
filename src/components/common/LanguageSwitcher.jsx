import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const toggle = () => i18n.changeLanguage(isAr ? 'en' : 'ar')

  return (
    <button
      onClick={toggle}
      className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-sm transition-all active:scale-95 ${className}`}
      aria-label="Switch language"
    >
      <span className="text-base leading-none">{isAr ? '🇸🇦' : '🇺🇸'}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={i18n.language}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className="text-xs font-bold"
        >
          {isAr ? 'EN' : 'ع'}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export function LanguageSwitcherDark({ className = '' }) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const toggle = () => i18n.changeLanguage(isAr ? 'en' : 'ar')

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold transition-all active:scale-95 ${className}`}
      aria-label="Switch language"
    >
      <span className="text-base leading-none">{isAr ? '🇸🇦' : '🇺🇸'}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={i18n.language}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className="text-xs font-bold"
        >
          {isAr ? 'English' : 'العربية'}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
