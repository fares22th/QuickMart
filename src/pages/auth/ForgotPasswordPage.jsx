import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, AlertCircle, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { forgotPassword } from '@/api/auth.api'
import { toast } from 'sonner'

const makeSchema = (t) => z.object({
  email: z.string().email(t('errors.email_invalid')),
})

const container = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function ForgotPasswordPage() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const ArrowBack = isRtl ? ArrowRight : ArrowLeft

  const schema = makeSchema(t)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async ({ email }) => {
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch {
      toast.error(isRtl ? 'تعذّر إرسال الرابط، تحقق من البريد' : 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"
          >
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            {t('forgot.success_title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-sm leading-relaxed mb-8"
          >
            {t('forgot.success_sub')}
          </motion.p>
          <Link to="/login"
            className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm hover:text-green-700 transition-colors">
            <ArrowBack className="w-4 h-4" />
            {t('forgot.back_login')}
          </Link>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Header */}
          <motion.div variants={item} className="mb-8">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-5">
              <Mail className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t('forgot.title')}</h2>
            <p className="text-gray-500 text-sm mt-1.5">{t('forgot.subtitle')}</p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <motion.div variants={item}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('forgot.email')}</label>
              <div className={`flex items-center border rounded-2xl overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-0 ${
                errors.email
                  ? 'border-red-400 focus-within:ring-red-200 bg-red-50/30'
                  : 'border-gray-200 focus-within:border-green-500 focus-within:ring-green-500/15 bg-white'
              }`}>
                <span className="px-3 text-gray-400 shrink-0"><Mail className="w-4 h-4" /></span>
                <input
                  type="email"
                  placeholder={t('forgot.email_placeholder')}
                  dir="ltr"
                  className="flex-1 px-3 py-3.5 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.email.message}
                </motion.p>
              )}
            </motion.div>

            {/* Submit */}
            <motion.div variants={item}>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', boxShadow: '0 8px 24px rgba(22,163,74,0.35)' }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('forgot.submitting')}
                  </>
                ) : t('forgot.submit')}
              </motion.button>
            </motion.div>
          </form>

          {/* Back link */}
          <motion.div variants={item} className="text-center mt-6">
            <Link to="/login"
              className="inline-flex items-center gap-2 text-gray-500 text-sm hover:text-gray-700 transition-colors font-medium">
              <ArrowBack className="w-4 h-4" />
              {t('forgot.back_login')}
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
