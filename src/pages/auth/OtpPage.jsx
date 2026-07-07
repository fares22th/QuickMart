import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'

export default function OtpPage() {
  const navigate = useNavigate()
  const { verifyOtp, isLoading } = useAuth()
  const [otp, setOtp] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await verifyOtp(otp)
    navigate('/')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">التحقق من الهاتف</h2>
      <p className="text-center text-gray-500 text-sm mb-6">أدخل رمز OTP المرسل إلى هاتفك</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={e => setOtp(e.target.value)}
          placeholder="000000"
          className="w-full text-center text-3xl tracking-widest border-2 border-gray-200 rounded-2xl py-4 focus:border-primary focus:outline-none"
        />
        <Button type="submit" className="w-full" loading={isLoading} disabled={otp.length < 4}>تحقق</Button>
      </form>
    </div>
  )
}
