import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    console.log('Reset password for:', data.phone)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">نسيت كلمة المرور؟</h2>
      <p className="text-center text-gray-500 text-sm mb-6">سنرسل لك رمزاً للتحقق على هاتفك</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="رقم الهاتف"
          placeholder="05xxxxxxxx"
          error={errors.phone?.message}
          {...register('phone', { required: 'رقم الهاتف مطلوب' })}
        />
        <Button type="submit" className="w-full">إرسال رمز التحقق</Button>
      </form>
      <p className="text-center mt-4 text-sm">
        <Link to="/login" className="text-primary font-semibold">العودة لتسجيل الدخول</Link>
      </p>
    </div>
  )
}
