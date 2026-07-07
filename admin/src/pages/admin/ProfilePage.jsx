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
  User, Phone, Mail, Lock, Eye, EyeOff, ShieldCheck,
  LogOut, Camera, CheckCircle, Calendar, Key,
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

function InputField({ label, icon: Icon, error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className={`flex items-center border-2 rounded-2xl overflow-hidden transition-all ${
        error ? 'border-red-400' : 'border-gray-100 focus-within:border-indigo-400'
      }`} style={{ background: '#F9FAFB' }}>
        {Icon && <span className="pr-4 pl-2 text-gray-400 shrink-0"><Icon className="w-4 h-4" /></span>}
        <input
          className="flex-1 px-3 py-3 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-300"
          {...props}
        />
      </div>
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
        error ? 'border-red-400' : 'border-gray-100 focus-within:border-indigo-400'
      }`} style={{ background: '#F9FAFB' }}>
        <span className="pr-4 pl-2 text-gray-400 shrink-0"><Lock className="w-4 h-4" /></span>
        <input
          type={show ? 'text' : 'password'}
          className="flex-1 py-3 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-300"
          placeholder="••••••••"
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

export default function AdminProfilePage() {
  const { user, setAuth } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: me } = useQuery({ queryKey: ['admin-me'], queryFn: getMe })

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
      qc.invalidateQueries({ queryKey: ['admin-me'] })
      if (data?.user) setAuth(data.user, useAuthStore.getState().token, useAuthStore.getState().refreshToken)
      toast.success('تم تحديث المعلومات')
    },
    onError: () => toast.error('تعذّر تحديث المعلومات'),
  })

  const pwdMut = useMutation({
    mutationFn: (data) => updateMe({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
    onSuccess: () => { resetPwd(); toast.success('تم تغيير كلمة المرور') },
    onError: (err) => toast.error(err?.error || 'كلمة المرور الحالية غير صحيحة'),
  })

  const handleLogout = async () => { await logout(); navigate('/login') }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'AD'

  return (
    <div className="max-w-2xl space-y-6" dir="rtl">

      {/* Profile hero */}
      <div
        className="relative rounded-2xl overflow-hidden p-6"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #2d2b6b 50%, #3730a3 100%)' }}
      >
        <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)' }} />
        <div className="relative z-10 flex items-center gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white shadow-xl"
              style={{ background: 'rgba(99,102,241,0.4)', border: '2px solid rgba(165,180,252,0.3)' }}
            >
              {initials}
            </div>
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xl font-extrabold text-white truncate">{user?.name ?? 'المشرف'}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
              <span className="text-xs font-semibold text-indigo-200">مشرف النظام</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <Phone className="w-3 h-3 text-indigo-300/60" />
              <span className="text-xs text-indigo-200/60">{user?.phone ?? '—'}</span>
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
          style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }} />
      </div>

      {/* Edit personal info */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,0.1)' }}>
            <User className="w-4 h-4" style={{ color: '#6366F1' }} />
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
          {/* Read-only phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">رقم الهاتف</label>
            <div className="flex items-center border-2 border-gray-100 rounded-2xl overflow-hidden"
              style={{ background: '#F3F4F6' }}>
              <span className="pr-4 pl-2 text-gray-400 shrink-0"><Phone className="w-4 h-4" /></span>
              <input value={user?.phone ?? ''} readOnly
                className="flex-1 px-3 py-3 text-sm bg-transparent outline-none text-gray-400 cursor-not-allowed" />
            </div>
            <p className="text-xs text-gray-400 mt-1">لا يمكن تغيير رقم الهاتف</p>
          </div>

          <button
            type="submit"
            disabled={!profileDirty || profileMut.isPending}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}
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
            label="تأكيد كلمة المرور الجديدة"
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

      {/* Account info */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-extrabold text-gray-900 text-sm mb-4">معلومات الحساب</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'الدور', value: 'مشرف النظام', icon: ShieldCheck, color: '#6366F1' },
            { label: 'تاريخ الانضمام', value: me?.createdAt ? new Date(me.createdAt).toLocaleDateString('ar-SA') : '—', icon: Calendar, color: '#10B981' },
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
