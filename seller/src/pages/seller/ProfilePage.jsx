import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/useAuthStore'
import { useAuth } from '@/hooks/useAuth'
import { getMe, updateMe } from '@/api/users.api'
import { useNavigate } from 'react-router-dom'
import {
  User, Phone, Mail, Lock, Eye, EyeOff,
  LogOut, CheckCircle, Calendar, Key, Zap, Star,
} from 'lucide-react'

const profileSchema = z.object({
  name:  z.string().min(2, 'الاسم مطلوب'),
  email: z.string().email('بريد إلكتروني غير صحيح').optional().or(z.literal('')),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword:     z.string().min(6, 'كلمة المرور الجديدة ٦ أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
})

function InputField({ label, icon: Icon, error, readOnly, hint, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div
        className={`flex items-center border-2 rounded-2xl overflow-hidden transition-all ${
          error ? 'border-red-400' : readOnly ? 'border-gray-100' : 'border-gray-100 focus-within:border-green-400'
        }`}
        style={{ background: readOnly ? '#F3F4F6' : '#F9FAFB' }}
      >
        {Icon && <span className="pr-4 pl-2 text-gray-400 shrink-0"><Icon className="w-4 h-4" /></span>}
        <input
          readOnly={readOnly}
          className={`flex-1 px-3 py-3 text-sm bg-transparent outline-none placeholder:text-gray-300 ${
            readOnly ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800'
          }`}
          {...props}
        />
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

function PasswordField({ label, error, ...props }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className={`flex items-center border-2 rounded-2xl overflow-hidden transition-all ${
        error ? 'border-red-400' : 'border-gray-100 focus-within:border-green-400'
      }`} style={{ background: '#F9FAFB' }}>
        <span className="pr-4 pl-2 text-gray-400 shrink-0"><Lock className="w-4 h-4" /></span>
        <input
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          className="flex-1 py-3 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-300"
          {...props}
        />
        <button type="button" onClick={() => setShow(v => !v)}
          className="px-4 text-gray-400 hover:text-gray-600" tabIndex={-1}>
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function SellerProfilePage() {
  const { user, setAuth } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: me } = useQuery({ queryKey: ['seller-me'], queryFn: getMe })

  const { register: regProfile, handleSubmit: hProfile, reset: resetProfile,
    formState: { errors: eProfile, isDirty: profileDirty } } = useForm({ resolver: zodResolver(profileSchema) })

  const { register: regPwd, handleSubmit: hPwd, reset: resetPwd,
    formState: { errors: ePwd } } = useForm({ resolver: zodResolver(passwordSchema) })

  useEffect(() => {
    if (me) resetProfile({ name: me.name ?? '', email: me.email ?? '' })
  }, [me, resetProfile])

  const profileMut = useMutation({
    mutationFn: updateMe,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['seller-me'] })
      if (data?.user) setAuth(data.user, useAuthStore.getState().token, useAuthStore.getState().refreshToken)
      toast.success('تم تحديث معلوماتك')
    },
    onError: () => toast.error('تعذّر تحديث المعلومات'),
  })

  const pwdMut = useMutation({
    mutationFn: (data) => updateMe({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
    onSuccess: () => { resetPwd(); toast.success('تم تغيير كلمة المرور بنجاح') },
    onError: (err) => toast.error(err?.error || 'كلمة المرور الحالية غير صحيحة'),
  })

  const handleLogout = async () => { await logout(); navigate('/login') }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'BL'

  return (
    <div className="max-w-2xl space-y-6" dir="rtl">

      {/* Profile hero */}
      <div
        className="relative rounded-2xl overflow-hidden p-6"
        style={{ background: 'linear-gradient(135deg, #0A2218 0%, #0F3024 50%, #1A4D36 100%)' }}
      >
        <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,200,150,0.2) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,200,150,0.1) 0%, transparent 70%)' }} />

        <div className="relative z-10 flex items-center gap-5">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white shadow-xl shrink-0"
            style={{ background: 'rgba(0,200,150,0.25)', border: '2px solid rgba(0,200,150,0.3)' }}
          >
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xl font-extrabold text-white truncate">{user?.name ?? 'البائع'}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Zap className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs font-semibold text-green-300">بائع نشط</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <Phone className="w-3 h-3 text-white/40" />
              <span className="text-xs text-white/40">{user?.phone ?? '—'}</span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'rgba(239,68,68,0.2)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            <LogOut className="w-4 h-4" />
            خروج
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,150,0.5), transparent)' }} />
      </div>

      {/* Edit personal info */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(0,200,150,0.1)' }}>
            <User className="w-4 h-4" style={{ color: '#00C896' }} />
          </div>
          <div>
            <h2 className="font-extrabold text-gray-900 text-sm">المعلومات الشخصية</h2>
            <p className="text-xs text-gray-400">تعديل اسمك وبريدك الإلكتروني</p>
          </div>
        </div>
        <form onSubmit={hProfile(d => profileMut.mutate(d))} className="p-6 space-y-4">
          <InputField
            label="الاسم الكامل"
            icon={User}
            placeholder="اسمك الكامل"
            error={eProfile.name?.message}
            {...regProfile('name')}
          />
          <InputField
            label="البريد الإلكتروني (اختياري)"
            icon={Mail}
            type="email"
            placeholder="email@example.com"
            error={eProfile.email?.message}
            {...regProfile('email')}
          />
          <InputField
            label="رقم الهاتف"
            icon={Phone}
            value={user?.phone ?? ''}
            readOnly
            hint="لا يمكن تغيير رقم الهاتف"
            onChange={() => {}}
          />

          <button
            type="submit"
            disabled={!profileDirty || profileMut.isPending}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #00C896, #00A878)', boxShadow: '0 4px 12px rgba(0,200,150,0.35)' }}
          >
            <CheckCircle className="w-4 h-4" />
            {profileMut.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.08)' }}>
            <Key className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h2 className="font-extrabold text-gray-900 text-sm">تغيير كلمة المرور</h2>
            <p className="text-xs text-gray-400">يُنصح بتغييرها بشكل دوري لأمان أفضل</p>
          </div>
        </div>
        <form onSubmit={hPwd(d => pwdMut.mutate(d))} className="p-6 space-y-4">
          <PasswordField
            label="كلمة المرور الحالية"
            error={ePwd.currentPassword?.message}
            {...regPwd('currentPassword')}
          />
          <PasswordField
            label="كلمة المرور الجديدة"
            error={ePwd.newPassword?.message}
            {...regPwd('newPassword')}
          />
          <PasswordField
            label="تأكيد كلمة المرور"
            error={ePwd.confirmPassword?.message}
            {...regPwd('confirmPassword')}
          />
          <button
            type="submit"
            disabled={pwdMut.isPending}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}
          >
            <Key className="w-4 h-4" />
            {pwdMut.isPending ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
          </button>
        </form>
      </div>

      {/* Account stats */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-extrabold text-gray-900 text-sm mb-4">معلومات الحساب</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'الدور',          value: 'بائع',    icon: Zap,      color: '#00C896' },
            { label: 'تاريخ الانضمام', value: me?.createdAt ? new Date(me.createdAt).toLocaleDateString('ar-SA') : '—', icon: Calendar, color: '#6366F1' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl p-4" style={{ background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-3.5 h-3.5" style={{ color }} />
                <p className="text-xs text-gray-400">{label}</p>
              </div>
              <p className="text-sm font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
