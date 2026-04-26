import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Camera, User, Phone, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { updateMe, uploadAvatar } from '@/api/users.api'
import { resetPassword } from '@/api/auth.api'
import Avatar from '@/components/common/Avatar'
import Button from '@/components/common/Button'

const profileSchema = z.object({
  name:  z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  phone: z.string().optional(),
})

const pwSchema = z.object({
  newPassword:     z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path:    ['confirmPassword'],
})

const fieldCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:border-green-500 focus:ring-green-500/15'

export default function ProfileSettingsPage() {
  const { profile, setProfile } = useAuthStore()
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [showPw, setShowPw] = useState({ new: false, confirm: false })
  const fileRef = useRef()

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: pErr } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: profile?.name ?? '', phone: profile?.phone ?? '' },
  })

  const { register: regPw, handleSubmit: handlePw, reset: resetPwForm, formState: { errors: pwErr } } = useForm({
    resolver: zodResolver(pwSchema),
  })

  const { mutate: saveProfile, isPending: savingProfile } = useMutation({
    mutationFn: updateMe,
    onSuccess: (data) => {
      setProfile(data)
      toast.success('تم حفظ التغييرات ✓')
    },
    onError: (err) => toast.error(err?.message || 'تعذّر حفظ التغييرات'),
  })

  const { mutate: changePassword, isPending: changingPw } = useMutation({
    mutationFn: (data) => resetPassword(data.newPassword),
    onSuccess: () => {
      toast.success('تم تغيير كلمة المرور ✓')
      resetPwForm()
    },
    onError: () => toast.error('تعذّر تغيير كلمة المرور'),
  })

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    try {
      const url = await uploadAvatar(file)
      setProfile({ ...profile, avatar_url: url })
      toast.success('تم تحديث الصورة الشخصية')
    } catch {
      toast.error('تعذّر رفع الصورة')
    } finally {
      setAvatarUploading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      <h1 className="text-2xl font-bold">الإعدادات</h1>

      {/* Avatar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-5">
        <div className="relative">
          <Avatar name={profile?.name} src={profile?.avatar_url} size="xl" />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={avatarUploading}
            className="absolute -bottom-1 -left-1 w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors disabled:opacity-60"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div>
          <p className="font-bold">{profile?.name ?? 'مستخدم'}</p>
          <p className="text-sm text-gray-500">{profile?.email ?? ''}</p>
          <p className="text-xs text-gray-400 mt-0.5">انقر على الأيقونة لتغيير الصورة</p>
        </div>
      </div>

      {/* Profile form */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-bold text-base mb-4 flex items-center gap-2">
          <User className="w-4.5 h-4.5 text-green-600" /> البيانات الشخصية
        </h2>
        <form onSubmit={handleProfile((data) => saveProfile(data))} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">الاسم الكامل</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input {...regProfile('name')} placeholder="الاسم الكامل" className={`${fieldCls} pr-10`} />
            </div>
            {pErr.name && <p className="text-red-500 text-xs mt-1">{pErr.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">رقم الجوال</label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input {...regProfile('phone')} placeholder="05xxxxxxxx" dir="ltr" className={`${fieldCls} pr-10`} />
            </div>
          </div>

          {profile?.email && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  value={profile.email}
                  readOnly
                  dir="ltr"
                  className={`${fieldCls} pr-10 bg-gray-50 text-gray-500 cursor-not-allowed`}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">لا يمكن تغيير البريد الإلكتروني</p>
            </div>
          )}

          <Button type="submit" className="w-full" loading={savingProfile} disabled={savingProfile}>
            حفظ التغييرات
          </Button>
        </form>
      </div>

      {/* Password form */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-bold text-base mb-4 flex items-center gap-2">
          <Lock className="w-4.5 h-4.5 text-green-600" /> تغيير كلمة المرور
        </h2>
        <form onSubmit={handlePw((data) => changePassword(data))} className="space-y-4">
          {(['new', 'confirm']).map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {field === 'new' ? 'كلمة المرور الجديدة' : 'تأكيد كلمة المرور'}
              </label>
              <div className="relative">
                <input
                  type={showPw[field] ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...regPw(field === 'new' ? 'newPassword' : 'confirmPassword')}
                  className={fieldCls}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPw[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {field === 'new' && pwErr.newPassword && (
                <p className="text-red-500 text-xs mt-1">{pwErr.newPassword.message}</p>
              )}
              {field === 'confirm' && pwErr.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{pwErr.confirmPassword.message}</p>
              )}
            </div>
          ))}

          <Button type="submit" variant="outline" className="w-full" loading={changingPw} disabled={changingPw}>
            تحديث كلمة المرور
          </Button>
        </form>
      </div>
    </div>
  )
}
