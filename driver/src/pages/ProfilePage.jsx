import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { LogOut, Truck, Phone, User, ToggleLeft, ToggleRight, Package, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getMe, setAvailability } from '@/api/driver.api'
import { useDriverStore } from '@/store/useDriverStore'

export default function ProfilePage() {
  const navigate  = useNavigate()
  const qc        = useQueryClient()
  const logout    = useDriverStore(s => s.logout)
  const storeUser = useDriverStore(s => s.user)

  const { data: me } = useQuery({ queryKey: ['driver-me'], queryFn: getMe })

  const availMut = useMutation({
    mutationFn: setAvailability,
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['driver-me'] }),
  })

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const isOnline = me?.isAvailable ?? false

  return (
    <div className="flex flex-col min-h-dvh pb-24" dir="rtl" style={{ background: '#0F0800' }}>
      {/* Header */}
      <div
        className="px-5 pt-12 pb-8 text-center"
        style={{ background: 'linear-gradient(160deg, #1A0900 0%, #0F0800 100%)' }}
      >
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 mx-auto"
          style={{
            background: 'linear-gradient(135deg, #F97316, #EA580C)',
            boxShadow: '0 12px 32px rgba(249,115,22,0.4)',
          }}
        >
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-black text-white">{me?.user?.name ?? storeUser?.name}</h2>
        <p className="text-gray-500 text-sm mt-1">{me?.user?.phone ?? storeUser?.phone}</p>

        {/* Online status */}
        <button
          onClick={() => availMut.mutate(!isOnline)}
          disabled={availMut.isPending}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
          style={{
            background: isOnline ? '#062E1A' : '#1C1009',
            border: `1px solid ${isOnline ? '#22C55E50' : '#2E1A00'}`,
            color: isOnline ? '#22C55E' : '#6B7280',
            boxShadow: isOnline ? '0 4px 16px rgba(34,197,94,0.2)' : 'none',
          }}
        >
          {isOnline ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
          {isOnline ? 'متاح للعمل' : 'غير متاح'}
        </button>
      </div>

      <div className="px-5 pt-4 space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'إجمالي التوصيلات', value: me?.deliveriesCount ?? 0, icon: Package, color: '#F97316' },
            { label: 'التقييم', value: '4.9 ⭐', icon: Star, color: '#EAB308' },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-3xl p-4 flex items-center gap-3"
              style={{ background: '#1C1009', border: '1px solid #2E1A00' }}
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `${s.color}20` }}
              >
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xl font-black text-white">{s.value}</p>
                <p className="text-gray-500 text-xs">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Vehicle info */}
        {(me?.vehicleType || me?.vehiclePlate) && (
          <div
            className="rounded-3xl p-4"
            style={{ background: '#1C1009', border: '1px solid #2E1A00' }}
          >
            <p className="font-bold text-white mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-400" />
              معلومات المركبة
            </p>
            <div className="space-y-2">
              {me?.vehicleType && (
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">نوع المركبة</span>
                  <span className="text-gray-300 text-sm font-bold">{me.vehicleType}</span>
                </div>
              )}
              {me?.vehiclePlate && (
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">رقم اللوحة</span>
                  <span className="text-gray-300 text-sm font-mono font-bold">{me.vehiclePlate}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact info */}
        <div
          className="rounded-3xl p-4"
          style={{ background: '#1C1009', border: '1px solid #2E1A00' }}
        >
          <p className="font-bold text-white mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-orange-400" />
            معلومات الحساب
          </p>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">رقم الجوال</span>
            <span className="text-gray-300 text-sm font-mono">{me?.user?.phone ?? storeUser?.phone}</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-3xl font-bold text-red-400 flex items-center justify-center gap-2 transition-all active:scale-98"
          style={{ background: '#2D0A0A', border: '1px solid #EF444430' }}
        >
          <LogOut className="w-5 h-5" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  )
}
