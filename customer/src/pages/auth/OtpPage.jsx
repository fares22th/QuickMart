import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import Button from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'

export default function OtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyOtp, resendOtp, isLoading } = useAuth()

  // phone passed via navigation state from register/login page
  const phone = location.state?.phone ?? ''

  const [otp, setOtp] = useState('')
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    const timer = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (otp.length < 4) return
    try {
      await verifyOtp(otp, phone)
      navigate('/')
    } catch {}
  }

  const handleResend = async () => {
    if (!phone) return
    try {
      await resendOtp(phone)
      setCountdown(60)
      setOtp('')
    } catch {}
  }

  return (
    <div>
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">التحقق من الهاتف</h2>
      <p className="text-center text-gray-500 text-sm mb-6">
        {phone
          ? <>أدخل الرمز المرسل إلى <span className="font-semibold text-gray-700">{phone}</span></>
          : 'أدخل رمز OTP المرسل إلى هاتفك'
        }
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="tel"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder="○ ○ ○ ○ ○ ○"
          className="w-full text-center text-3xl tracking-[0.5em] border-2 border-gray-200 rounded-2xl py-4 focus:border-primary focus:outline-none font-mono transition-colors"
          autoFocus
        />

        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
          disabled={otp.length < 4}
        >
          تحقق
        </Button>
      </form>

      {/* Resend */}
      <div className="text-center mt-4 text-sm text-gray-500">
        {countdown > 0 ? (
          <span>
            إعادة الإرسال بعد{' '}
            <span className="font-bold text-primary">{countdown}</span> ثانية
          </span>
        ) : (
          <button
            onClick={handleResend}
            disabled={isLoading || !phone}
            className="text-primary font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            إعادة إرسال الرمز
          </button>
        )}
      </div>

      {/* Back */}
      <p className="text-center mt-3 text-sm">
        <Link to="/login" className="text-gray-400 hover:text-gray-600">
          العودة لتسجيل الدخول
        </Link>
      </p>
    </div>
  )
}
