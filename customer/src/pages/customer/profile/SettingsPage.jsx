import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { User, Phone, Lock, Eye, EyeOff, Check } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { updateMe } from '@/api/users.api'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

function ProfileSection() {
  const { user, setAuth } = useAuthStore()
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: { name: user?.name ?? '', phone: user?.phone ?? '' },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateMe,
    onSuccess: (updated) => {
      setAuth(updated, useAuthStore.getState().token)
      toast.success('تم تحديث البيانات بنجاح')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'تعذر حفظ التغييرات')
    },
  })

  const onSubmit = (data) => mutate(data)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-primary-light flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
        <h2 className="font-bold text-lg">البيانات الشخصية</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="الاسم الكامل"
          placeholder="أدخل اسمك"
          error={errors.name?.message}
          {...register('name', { required: 'الاسم مطلوب' })}
        />
        <Input
          label="رقم الهاتف"
          placeholder="05xxxxxxxx"
          error={errors.phone?.message}
          {...register('phone', {
            required: 'رقم الهاتف مطلوب',
            pattern: { value: /^05\d{8}$/, message: 'رقم الهاتف غير صحيح' },
          })}
        />
        <Button
          type="submit"
          className="w-full"
          loading={isPending}
          disabled={!isDirty}
        >
          <Check className="w-4 h-4 ml-1" />
          حفظ التغييرات
        </Button>
      </form>
    </div>
  )
}

function PasswordSection() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()
  const newPass = watch('newPassword')

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => updateMe({ currentPassword: data.currentPassword, password: data.newPassword }),
    onSuccess: () => {
      toast.success('تم تغيير كلمة المرور بنجاح')
      reset()
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'كلمة المرور الحالية غير صحيحة')
    },
  })

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
          <Lock className="w-4 h-4 text-amber-500" />
        </div>
        <h2 className="font-bold text-lg">تغيير كلمة المرور</h2>
      </div>
      <form onSubmit={handleSubmit(d => mutate(d))} className="space-y-4">
        {/* Current password */}
        <div className="relative">
          <Input
            label="كلمة المرور الحالية"
            type={showCurrent ? 'text' : 'password'}
            placeholder="••••••••"
            error={errors.currentPassword?.message}
            {...register('currentPassword', { required: 'كلمة المرور الحالية مطلوبة' })}
          />
          <button type="button" onClick={() => setShowCurrent(v => !v)}
            className="absolute left-3 top-9 text-gray-400 hover:text-gray-600">
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {/* New password */}
        <div className="relative">
          <Input
            label="كلمة المرور الجديدة"
            type={showNew ? 'text' : 'password'}
            placeholder="••••••••"
            error={errors.newPassword?.message}
            {...register('newPassword', {
              required: 'كلمة المرور الجديدة مطلوبة',
              minLength: { value: 8, message: 'كلمة المرور 8 أحرف على الأقل' },
            })}
          />
          <button type="button" onClick={() => setShowNew(v => !v)}
            className="absolute left-3 top-9 text-gray-400 hover:text-gray-600">
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
              validate: v => v === newPass || 'كلمتا المرور غير متطابقتين',
            })}
          />
          <button type="button" onClick={() => setShowConfirm(v => !v)}
            className="absolute left-3 top-9 text-gray-400 hover:text-gray-600">
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <Button type="submit" variant="outline" className="w-full" loading={isPending}>
          تغيير كلمة المرور
        </Button>
      </form>
    </div>
  )
}

export default function ProfileSettingsPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold mb-2">الإعدادات</h1>
      <ProfileSection />
      <PasswordSection />
    </div>
  )
}
