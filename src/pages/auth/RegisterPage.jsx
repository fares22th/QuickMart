import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'

const schema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(9, 'رقم الهاتف غير صحيح'),
  password: z.string().min(6, 'كلمة المرور قصيرة'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
})

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    await registerUser(data)
    navigate('/verify-otp')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">إنشاء حساب جديد</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="الاسم الكامل" error={errors.name?.message} {...register('name')} />
        <Input label="رقم الهاتف" placeholder="05xxxxxxxx" error={errors.phone?.message} {...register('phone')} />
        <Input label="كلمة المرور" type="password" error={errors.password?.message} {...register('password')} />
        <Input label="تأكيد كلمة المرور" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <Button type="submit" className="w-full" loading={isLoading}>إنشاء الحساب</Button>
      </form>
      <p className="text-center mt-4 text-sm text-gray-500">
        لديك حساب بالفعل؟{' '}
        <Link to="/login" className="text-primary font-semibold">تسجيل الدخول</Link>
      </p>
    </div>
  )
}
