import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ShieldCheck, RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const DIGITS = 6
const RESEND_SECS = 60

const container = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function OtpPage() {
  const navigate = useNavigate()
  const { verifyOtp, isLoading } = useAuth()
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const [digits, setDigits] = useState(Array(DIGITS).fill(''))
  const [countdown, setCountdown] = useState(RESEND_SECS)
  const [error, setError] = useState('')
  const inputs = useRef([])

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleChange = (idx, val) => {
    const d = val.replace(/\D/, '').slice(-1)
    const next = [...digits]
    next[idx] = d
    setDigits(next)
    setError('')
    if (d && idx < DIGITS - 1) inputs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && !isRtl && idx > 0)  inputs.current[idx - 1]?.focus()
    if (e.key === 'ArrowRight' && !isRtl && idx < DIGITS - 1) inputs.current[idx + 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, DIGITS)
    const next = [...digits]
    text.split('').forEach((ch, i) => { next[i] = ch })
    setDigits(next)
    inputs.current[Math.min(text.length, DIGITS - 1)]?.focus()
  }

  const code = digits.join('')
  const filled = code.length === DIGITS

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!filled) return
    setError('')
    try {
      await verifyOtp(code)
      navigate('/')
    } catch {
      setError(isRtl ? 'الرمز غير صحيح أو منتهي الصلاحية' : 'Invalid or expired code')
      setDigits(Array(DIGITS).fill(''))
      inputs.current[0]?.focus()
    }
  }

  const handleResend = () => {
    setCountdown(RESEND_SECS)
    setDigits(Array(DIGITS).fill(''))
    setError('')
    inputs.current[0]?.focus()
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">

      {/* Icon */}
      <motion.div variants={item} className="mb-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-5"
        >
          <ShieldCheck className="w-8 h-8 text-green-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900">{t('otp.title')}</h2>
        <p className="text-gray-500 text-sm mt-1.5 max-w-[220px] leading-relaxed">
          {t('otp.subtitle')} <span className="font-semibold text-gray-700">05xxxxxxxx</span>
        </p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        {/* OTP boxes */}
        <motion.div variants={item} className="flex gap-2 justify-center mb-6" dir="ltr">
          {digits.map((d, i) => (
            <motion.input
              key={i}
              ref={el => inputs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              whileFocus={{ scale: 1.08 }}
              className={`w-11 h-14 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all duration-200 ${
                error
                  ? 'border-red-400 bg-red-50 text-red-600'
                  : d
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-800 focus:border-green-500 focus:bg-green-50/40'
              }`}
            />
          ))}
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-red-500 font-medium mb-4"
          >
            {error}
          </motion.p>
        )}

        {/* Submit */}
        <motion.div variants={item}>
          <motion.button
            type="submit"
            disabled={!filled || isLoading}
            whileHover={filled ? { scale: 1.01 } : {}}
            whileTap={filled ? { scale: 0.98 } : {}}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            style={{
              background: filled
                ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                : '#d1d5db',
              boxShadow: filled ? '0 8px 24px rgba(22,163,74,0.35)' : 'none',
            }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('otp.submitting')}
              </>
            ) : t('otp.submit')}
          </motion.button>
        </motion.div>
      </form>

      {/* Resend */}
      <motion.div variants={item} className="text-center mt-6">
        {countdown > 0 ? (
          <p className="text-sm text-gray-500">
            {t('otp.resend_in')}{' '}
            <motion.span
              key={countdown}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="font-bold text-green-600"
            >
              {countdown}
            </motion.span>
            {' '}{t('otp.seconds')}
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm hover:text-green-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {t('otp.resend')}
          </button>
        )}
      </motion.div>
    </motion.div>
  )
}
