import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import LanguageSwitcher from '@/components/common/LanguageSwitcher'

const makeSchema = (t) => z.object({
  name:            z.string().min(2, t('errors.name_short')),
  email:           z.string().email(t('errors.email_invalid')),
  password:        z.string().min(6, t('errors.password_short')),
  confirmPassword: z.string(),
  terms: z.literal(true, { errorMap: () => ({ message: t('errors.terms_required') }) }),
}).refine(d => d.password === d.confirmPassword, {
  message: t('errors.passwords_mismatch'),
  path: ['confirmPassword'],
})

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
      className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {msg}
    </motion.p>
  )
}

const wrap = (err) =>
  `flex items-center border rounded-2xl overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-0 ${
    err
      ? 'border-red-400 focus-within:ring-red-200 bg-red-50/30'
      : 'border-gray-200 focus-within:border-green-500 focus-within:ring-green-500/15 bg-white'
  }`
const inp = 'flex-1 px-3 py-3.5 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400'

function PwField({ register, name, label, error }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className={wrap(error)}>
        <span className="px-3 text-gray-400 shrink-0"><Lock className="w-4 h-4" /></span>
        <input type={show ? 'text' : 'password'} placeholder="••••••••" className={inp} {...register(name)} />
        <button type="button" onClick={() => setShow(v => !v)}
          className="px-3 text-gray-400 hover:text-gray-600 shrink-0 transition-colors" tabIndex={-1}>
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      <FieldError msg={error} />
    </div>
  )
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function CustomerRegisterPage() {
  const navigate = useNavigate()
  const { registerCustomer, isLoading } = useAuth()
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight

  const schema = makeSchema(t)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    const prof = await registerCustomer({ name: data.name, email: data.email, password: data.password })
    navigate(prof?.role === 'seller' ? '/seller' : prof?.role === 'admin' ? '/admin' : '/')
  }

  const perks = [
    { icon: '🛒', title: isRtl ? 'تسوق من أي مكان' : 'Shop Anywhere', desc: isRtl ? 'آلاف المنتجات في راحة يدك' : 'Thousands of products at your fingertips' },
    { icon: '🚀', title: isRtl ? 'توصيل سريع' : 'Fast Delivery', desc: isRtl ? 'استلم طلبك خلال ساعات' : 'Receive your order within hours' },
    { icon: '🔒', title: isRtl ? 'دفع آمن ومضمون' : 'Secure Payment', desc: isRtl ? 'تشفير كامل لبياناتك' : 'Full encryption for your data' },
    { icon: '↩️', title: isRtl ? 'إرجاع سهل' : 'Easy Returns', desc: isRtl ? 'سياسة إرجاع مرنة ٧ أيام' : 'Flexible 7-day return policy' },
  ]

  return (
    <div className="min-h-screen flex font-cairo" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ── Left branding ── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(145deg, #16a34a 0%, #15803d 45%, #14532d 100%)' }}>
        {/* Decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,#fff 0%,transparent 70%)' }} />
          <div className="absolute bottom-0 -right-20 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#fff 0%,transparent 70%)' }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
            <defs><pattern id="rg" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0L0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#rg)" />
          </svg>
        </div>

        {/* Logo + language */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 5h13M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">{t('brand')}</span>
          </Link>
          <LanguageSwitcher />
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
          <motion.h2
            key={i18n.language + '-reg-title'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white leading-snug mb-4"
          >
            {isRtl ? 'عالم التسوق\nفي راحة يدك' : 'The World of Shopping\nin Your Hands'}
          </motion.h2>
          <p className="text-white/70 text-base leading-relaxed mb-10">
            {isRtl
              ? 'انضم لأكثر من ٥٠ ألف عميل يتسوقون يومياً من أفضل المتاجر'
              : 'Join over 50K customers who shop daily from the best stores'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {perks.map(p => (
              <motion.div
                key={p.title}
                className="bg-white/10 backdrop-blur rounded-2xl p-4"
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="text-2xl block mb-2">{p.icon}</span>
                <p className="text-white font-bold text-sm">{p.title}</p>
                <p className="text-white/60 text-xs mt-1">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="relative z-10 bg-white/10 backdrop-blur rounded-2xl p-4 flex items-center gap-3">
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4'].map((c, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-xs font-bold text-white"
                style={{ background: c }}>
                {isRtl ? ['م','أ','س','ف'][i] : ['J','A','S','M'][i]}
              </div>
            ))}
          </div>
          <div>
            <p className="text-white font-bold text-sm">
              {isRtl ? 'انضم لمجتمعنا' : 'Join our community'}
            </p>
            <p className="text-white/60 text-xs">
              {isRtl ? '+٥٠٠ عضو جديد هذا الأسبوع' : '+500 new members this week'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Right form ── */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        {/* Mobile header */}
        <div className="lg:hidden px-6 pt-8 pb-2 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-600">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 5h13M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-green-600">{t('brand')}</span>
          </Link>
          <button
            onClick={() => i18n.changeLanguage(isRtl ? 'en' : 'ar')}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-xs font-bold"
          >
            {isRtl ? 'EN' : 'ع'}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-14 py-10">
          <div className="w-full max-w-sm">

            <motion.div variants={container} initial="hidden" animate="show">
              <motion.div variants={item} className="mb-7">
                <h2 className="text-2xl font-bold text-gray-900">{t('register.title')} 🎉</h2>
                <p className="text-gray-500 text-sm mt-1.5">{t('register.subtitle')}</p>
              </motion.div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                  {/* Name */}
                  <motion.div variants={item}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('register.name')}</label>
                    <div className={wrap(errors.name?.message)}>
                      <span className="px-3 text-gray-400 shrink-0"><User className="w-4 h-4" /></span>
                      <input type="text" placeholder={t('register.name_placeholder')} className={inp} {...register('name')} />
                    </div>
                    <FieldError msg={errors.name?.message} />
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={item}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('register.email')}</label>
                    <div className={wrap(errors.email?.message)}>
                      <span className="px-3 text-gray-400 shrink-0"><Mail className="w-4 h-4" /></span>
                      <input type="email" placeholder="example@email.com" dir="ltr" className={inp} {...register('email')} />
                    </div>
                    <FieldError msg={errors.email?.message} />
                  </motion.div>

                  {/* Password */}
                  <motion.div variants={item}>
                    <PwField register={register} name="password" label={t('register.password')} error={errors.password?.message} />
                  </motion.div>
                  <motion.div variants={item}>
                    <PwField register={register} name="confirmPassword" label={t('register.confirm_password')} error={errors.confirmPassword?.message} />
                  </motion.div>

                  {/* Terms */}
                  <motion.div variants={item}>
                    <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                      <input type="checkbox" className="w-4 h-4 mt-0.5 rounded shrink-0 cursor-pointer accent-green-600" {...register('terms')} />
                      <span className="text-sm text-gray-600 leading-relaxed">
                        {t('register.terms')}{' '}
                        <a href="#" className="font-semibold text-green-600 hover:text-green-700">{t('register.terms_link')}</a>
                        {' '}{t('register.and')}{' '}
                        <a href="#" className="font-semibold text-green-600 hover:text-green-700">{t('register.privacy_link')}</a>
                      </span>
                    </label>
                    <FieldError msg={errors.terms?.message} />
                  </motion.div>

                  {/* Submit */}
                  <motion.div variants={item}>
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 mt-1 shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 8px 24px rgba(22,163,74,.35)' }}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          {t('register.submitting')}
                        </>
                      ) : (
                        <>{t('register.submit')} <ArrowIcon className="w-4 h-4" /></>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.div>
              </form>

              <motion.div variants={item}>
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">{t('login.or')}</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <p className="text-center text-sm text-gray-500">
                  {t('register.has_account')}{' '}
                  <Link to="/login" className="font-bold text-green-600 hover:text-green-700">{t('register.login')}</Link>
                </p>
                <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-center text-gray-400 mb-3">
                    {isRtl ? 'هل أنت بائع أو مدير؟' : 'Are you a seller or admin?'}
                  </p>
                  <div className="flex gap-2">
                    <Link to="/register/seller"
                      className="flex-1 text-center text-xs font-bold py-2.5 rounded-xl border-2 border-amber-400 text-amber-600 hover:bg-amber-50 transition-colors">
                      🏪 {t('register.register_as_seller')}
                    </Link>
                    <Link to="/admin/register"
                      className="flex-1 text-center text-xs font-bold py-2.5 rounded-xl border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors">
                      🔐 {t('register.admin_access')}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-5">
          © {new Date().getFullYear()} {t('brand')} — {t('copyright')}
        </p>
      </div>
    </div>
  )
}
