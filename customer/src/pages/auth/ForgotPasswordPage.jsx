import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Phone, ShieldCheck, Lock } from 'lucide-react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import PhoneInput from '@/components/common/PhoneInput'
import { useAuth } from '@/hooks/useAuth'

// ── الخطوة 1: إدخال رقم الهاتف ─────────────────────────
function PhoneStep({ onNext }) {
  const { forgotPassword, isLoading } = useAuth()
  const [phone, setPhone]   = useState('')
  const [dialCode, setDial] = useState('+966')
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!phone || phone.length < 6) { setError('أدخل رقم هاتف صحيح'); return }
    setError('')
    const fullPhone = `${dialCode}${phone}`
    try {
      await forgotPassword(fullPhone)
      onNext(fullPhone)
    } catch {}
  }

  return (
    <>
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center">
          <Phone className="w-8 h-8 text-primary" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">نسيت كلمة المرور؟</h2>
      <p className="text-center text-gray-500 text-sm mb-6">أدخل رقم هاتفك وسنرسل لك رمز التحقق</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <PhoneInput
          value={phone}
          onChange={(val, dial) => { setPhone(val); setDial(dial); setError('') }}
          error={error}
        />
        <Button type="submit" className="w-full" loading={isLoading}>
          إرسال رمز التحقق
        </Button>
      </form>
    </>
  )
}

// ── الخطوة 2: إدخال رمز OTP ────────────────────────────
function OtpStep({ phone, onNext }) {
  const { verifyOtp, resendOtp, isLoading } = useAuth()
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
      onNext(otp)
    } catch {}
  }

  const handleResend = async () => {
    try {
      await resendOtp(phone)
      setCountdown(60)
      setOtp('')
    } catch {}
  }

  return (
    <>
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">رمز التحقق</h2>
      <p className="text-center text-gray-500 text-sm mb-6">
        تم إرسال الرمز إلى <span className="font-semibold text-gray-700">{phone}</span>
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
        />
        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
          disabled={otp.length < 4}
        >
          التحقق من الرمز
        </Button>
      </form>
      <div className="text-center mt-4 text-sm text-gray-500">
        {countdown > 0 ? (
          <span>إعادة الإرسال بعد <span className="font-bold text-primary">{countdown}</span> ثانية</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={isLoading}
            className="text-primary font-semibold hover:underline disabled:opacity-50"
          >
            إعادة إرسال الرمز
          </button>
        )}
      </div>
    </>
  )
}

// ── الخطوة 3: كلمة المرور الجديدة ─────────────────────
function NewPasswordStep({ otp }) {
  const { resetPassword, isLoading } = useAuth()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async ({ password: newPassword }) => {
    try {
      await resetPassword({ otp, password: newPassword })
      navigate('/login')
    } catch {}
  }

  return (
    <>
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center">
          <Lock className="w-8 h-8 text-primary" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">كلمة المرور الجديدة</h2>
      <p className="text-center text-gray-500 text-sm mb-6">اختر كلمة مرور قوية لحمايه حسابك</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Password */}
        <div className="relative">
          <Input
            label="كلمة المرور الجديدة"
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'كلمة المرور مطلوبة',
              minLength: { value: 8, message: 'كلمة المرور 8 أحرف على الأقل' },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            className="absolute left-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {/* Confirm */}
        <div className="relative">
          <Input
            label="تأكيد كلمة المرور"
            type={showConfirm ? 'text' : 'password'}
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'تأكيد كلمة المرور مطلوب',
              validate: v => v === password || 'كلمتا المرور غير متطابقتين',
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(v => !v)}
            className="absolute left-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <Button type="submit" className="w-full" loading={isLoading}>
          تغيير كلمة المرور
        </Button>
      </form>
    </>
  )
}

// ── مؤشر الخطوات ────────────────────────────────────────
function StepIndicator({ current }) {
  const steps = ['الهاتف', 'التحقق', 'كلمة المرور']
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5`}>
            <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors
              ${i < current ? 'bg-primary text-white' : i === current ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-gray-200 text-gray-400'}`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === current ? 'text-primary' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 h-px mx-1 ${i < current ? 'bg-primary' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── الصفحة الرئيسية ──────────────────────────────────────
export default function ForgotPasswordPage() {
  const [step, setStep] = useState(0)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')

  return (
    <div>
      <StepIndicator current={step} />

      {step === 0 && (
        <PhoneStep onNext={(p) => { setPhone(p); setStep(1) }} />
      )}
      {step === 1 && (
        <OtpStep phone={phone} onNext={(o) => { setOtp(o); setStep(2) }} />
      )}
      {step === 2 && (
        <NewPasswordStep otp={otp} />
      )}

      <p className="text-center mt-6 text-sm">
        <Link to="/login" className="text-primary font-semibold hover:underline">
          العودة لتسجيل الدخول
        </Link>
      </p>
    </div>
  )
}
