import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const makeSchema = (t) => z.object({
  email:    z.string().email(t('errors.email_invalid')),
  password: z.string().min(6, t('errors.password_short')),
})

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="flex items-center gap-1 text-red-500 text-xs mt-1.5"
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {msg}
    </motion.p>
  )
}

const inputWrap = (err) =>
  `flex items-center border rounded-2xl overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-0 ${
    err
      ? 'border-red-400 focus-within:ring-red-200 bg-red-50/30'
      : 'border-gray-200 focus-within:border-green-500 focus-within:ring-green-500/15 bg-white'
  }`
const inputCls = 'flex-1 px-3 py-3.5 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400'

const DEV = import.meta.env.DEV

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, devLogin } = useAuth()
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight

  const schema = makeSchema(t)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const [showPw, setShowPw] = useState(false)

  const onSubmit = async (data) => {
    const prof = await login(data)
    if (prof?.role === 'seller') navigate('/seller')
    else if (prof?.role === 'admin') navigate('/admin')
    else navigate('/')
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">

      {/* Header */}
      <motion.div variants={item} className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('login.title')} 👋
        </h2>
        <p className="text-gray-500 text-sm mt-1.5">{t('login.subtitle')}</p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">

          {/* Email */}
          <motion.div variants={item}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('login.email')}</label>
            <div className={inputWrap(errors.email)}>
              <span className="px-3 text-gray-400 shrink-0"><Mail className="w-4 h-4" /></span>
              <input
                type="email"
                placeholder={t('login.email_placeholder')}
                dir="ltr"
                className={inputCls}
                {...register('email')}
              />
            </div>
            <FieldError msg={errors.email?.message} />
          </motion.div>

          {/* Password */}
          <motion.div variants={item}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('login.password')}</label>
            <div className={inputWrap(errors.password)}>
              <span className="px-3 text-gray-400 shrink-0"><Lock className="w-4 h-4" /></span>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder={t('login.password_placeholder')}
                className={inputCls}
                {...register('password')}
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="px-3 text-gray-400 hover:text-gray-600 shrink-0 transition-colors" tabIndex={-1}>
                {showPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
            <FieldError msg={errors.password?.message} />
          </motion.div>

          {/* Remember + Forgot */}
          <motion.div variants={item} className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded cursor-pointer accent-green-600" />
              <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                {t('login.remember')}
              </span>
            </label>
            <Link to="/forgot-password"
              className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
              {t('login.forgot')}
            </Link>
          </motion.div>

          {/* Submit */}
          <motion.div variants={item}>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 px-6 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', boxShadow: '0 8px 24px rgba(22,163,74,0.35)' }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t('login.submitting')}
                </>
              ) : (
                <>
                  {t('login.submit')}
                  <ArrowIcon className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </form>

      {/* Social login */}
      <motion.div variants={item}>
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-medium">{t('login.or')}</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SocialBtn icon="google" label={t('login.social_google')} />
          <SocialBtn icon="apple"  label={t('login.social_apple')} />
        </div>
      </motion.div>

      {/* Register link */}
      <motion.p variants={item} className="text-center text-sm text-gray-500 mt-6">
        {t('login.no_account')}{' '}
        <Link to="/register" className="font-bold text-green-600 hover:text-green-700 transition-colors">
          {t('login.register_free')}
        </Link>
      </motion.p>

      {/* Portals */}
      <motion.div variants={item} className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
        <p className="text-xs text-center text-gray-400 mb-3">{t('login.other_portals')}</p>
        <div className="flex gap-2">
          <Link to="/seller/login"
            className="flex-1 text-center text-xs font-bold py-2.5 rounded-xl border-2 border-amber-400 text-amber-600 hover:bg-amber-50 transition-colors">
            🏪 {t('nav.seller_portal')}
          </Link>
          <Link to="/admin/login"
            className="flex-1 text-center text-xs font-bold py-2.5 rounded-xl border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors">
            🔐 {t('nav.admin_portal')}
          </Link>
        </div>
      </motion.div>

      {/* Dev panel */}
      {DEV && (
        <motion.div variants={item} className="mt-5 p-3.5 rounded-2xl border-2 border-dashed border-yellow-300 bg-yellow-50">
          <p className="text-xs font-bold text-yellow-700 mb-2.5 flex items-center gap-1.5">
            <span>⚡</span> {t('dev.title')}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { role: 'customer', label: t('dev.customer'), to: '/',       color: '#16a34a' },
              { role: 'seller',   label: t('dev.seller'),   to: '/seller', color: '#f59e0b' },
              { role: 'admin',    label: t('dev.admin'),    to: '/admin',  color: '#6366f1' },
            ].map(({ role, label, to, color }) => (
              <button key={role} type="button"
                onClick={() => { devLogin(role); navigate(to) }}
                className="py-2 rounded-xl text-white text-xs font-bold transition-all active:scale-95"
                style={{ background: color }}>
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

function SocialBtn({ icon, label }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-all shadow-sm w-full"
    >
      {icon === 'google' && (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )}
      {icon === 'apple' && (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      )}
      <span className="truncate">{label}</span>
    </motion.button>
  )
}
