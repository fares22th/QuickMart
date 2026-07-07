import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus, Search, Truck, Trash2, Package, UserCheck, MapPin, ChevronRight } from 'lucide-react'
import {
  getAdminDrivers, addDriver, deleteDriver,
  getUnassignedOrders, assignDriverToOrder,
} from '@/api/admin.api'
import Modal from '@/components/common/Modal'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import EmptyState from '@/components/common/EmptyState'
import Pagination from '@/components/common/Pagination'
import PageBanner from '@/components/admin/layout/PageBanner'

function formatPrice(n) {
  return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(n ?? 0)
}

function DriverForm({ onSubmit, isLoading, onCancel }) {
  const [form, setForm] = useState({ name: '', phone: '', vehicleType: '', vehiclePlate: '' })
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div className="space-y-4" dir="rtl">
      {[
        { key: 'name',         label: 'الاسم الكامل *',   placeholder: 'اسم المندوب' },
        { key: 'phone',        label: 'رقم الجوال *',      placeholder: '05XXXXXXXX' },
        { key: 'vehicleType',  label: 'نوع المركبة',       placeholder: 'دراجة / سيارة / دراجة نارية' },
        { key: 'vehiclePlate', label: 'رقم اللوحة',        placeholder: 'أ ب ج 1234' },
      ].map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            type="text"
            value={form[key]}
            onChange={e => set(key, e.target.value)}
            placeholder={placeholder}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-admin focus:outline-none"
          />
        </div>
      ))}
      <div className="flex items-center gap-2 p-3 rounded-xl text-xs" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
        <span className="text-blue-600">🔑</span>
        <span className="text-blue-700 font-medium">كلمة المرور الافتراضية: <span className="font-mono font-bold">Driver@123</span></span>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSubmit(form)}
          disabled={!form.name || !form.phone || isLoading}
          className="flex-1 py-3 text-white rounded-xl text-sm font-extrabold disabled:opacity-50 transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', boxShadow: '0 8px 24px rgba(99,102,241,0.5)' }}
        >
          {isLoading ? 'جاري الإضافة...' : '+ إضافة المندوب'}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          إلغاء
        </button>
      </div>
    </div>
  )
}

function AssignOrderModal({ driver, onClose }) {
  const qc = useQueryClient()
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['unassigned-orders'],
    queryFn:  getUnassignedOrders,
  })

  const assignMut = useMutation({
    mutationFn: (orderId) => assignDriverToOrder(orderId, driver.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-drivers'] })
      qc.invalidateQueries({ queryKey: ['unassigned-orders'] })
      toast.success(`تم تعيين ${driver.name} على الطلب`)
      onClose()
    },
    onError: () => toast.error('تعذر تعيين المندوب'),
  })

  return (
    <div dir="rtl" className="space-y-3 max-h-96 overflow-y-auto">
      <p className="text-sm text-gray-500 mb-3">
        اختر طلباً لتعيين <span className="font-bold text-gray-800">{driver.name}</span> عليه
      </p>
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">لا توجد طلبات بانتظار مندوب</p>
        </div>
      ) : (
        orders.map(o => (
          <button
            key={o.id}
            onClick={() => assignMut.mutate(o.id)}
            disabled={assignMut.isPending}
            className="w-full p-4 rounded-xl text-right hover:bg-gray-50 border border-gray-100 transition-colors disabled:opacity-50 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                #{o.id.slice(-6).toUpperCase()} — {o.store?.storeName}
              </p>
              {o.address && (
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {[o.address.city, o.address.district].filter(Boolean).join(' - ')}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-indigo-600">{formatPrice(o.total)}</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </button>
        ))
      )}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm divide-y">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
          <div className="w-9 h-9 bg-gray-100 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 bg-gray-100 rounded w-36" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
          <div className="h-6 bg-gray-100 rounded w-20" />
        </div>
      ))}
    </div>
  )
}

export default function AdminDriversPage() {
  const qc = useQueryClient()
  const [search,       setSearch]       = useState('')
  const [page,         setPage]         = useState(1)
  const [showForm,     setShowForm]     = useState(false)
  const [deleteId,     setDeleteId]     = useState(null)
  const [assignDriver, setAssignDriver] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-drivers', { search, page }],
    queryFn:  () => getAdminDrivers({ search, page, limit: 15 }),
    keepPreviousData: true,
    refetchInterval: 30_000,
  })

  const addMut = useMutation({
    mutationFn: addDriver,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-drivers'] })
      toast.success('تم إضافة المندوب')
      setShowForm(false)
    },
    onError: (err) => toast.error(err.response?.data?.error ?? 'تعذّر إضافة المندوب'),
  })

  const deleteMut = useMutation({
    mutationFn: deleteDriver,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-drivers'] })
      toast.success('تم حذف المندوب')
      setDeleteId(null)
    },
    onError: () => toast.error('تعذّر حذف المندوب'),
  })

  const drivers    = data?.drivers ?? []
  const totalPages = data?.totalPages ?? 1
  const total      = data?.total ?? 0
  const onlineCount = drivers.filter(d => d.isAvailable).length

  return (
    <div className="space-y-5" dir="rtl">
      <PageBanner
        title="إدارة المندوبين"
        subtitle={!isLoading ? `${total} مندوب — ${onlineCount} متاح الآن` : 'إدارة فريق التوصيل'}
        icon={Truck}
        gradient="linear-gradient(135deg, #164E63 0%, #0E7490 50%, #06B6D4 100%)"
        glow="rgba(6,182,212,0.4)"
      />

      {/* Stats bar */}
      {!isLoading && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'إجمالي المندوبين', value: total,             color: '#6366F1' },
            { label: 'متاح الآن',        value: onlineCount,       color: '#22C55E' },
            { label: 'غير متاح',         value: total - onlineCount, color: '#F59E0B' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="بحث باسم أو جوال..."
            className="pr-9 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-admin focus:outline-none bg-white w-64"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-3 text-white rounded-xl text-sm font-extrabold transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', boxShadow: '0 8px 24px rgba(99,102,241,0.5)' }}
        >
          <Plus className="w-4 h-4" />
          إضافة مندوب
        </button>
      </div>

      {isLoading ? <TableSkeleton /> : !drivers.length ? (
        <EmptyState icon={Truck} title="لا يوجد مندوبون" message="أضف مندوباً للبدء في التوصيل" />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm" dir="rtl">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                {['المندوب', 'الجوال', 'المركبة', 'التوصيلات', 'الحالة', 'الطلب الحالي', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-right font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {drivers.map(d => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-admin/10 flex items-center justify-center font-bold text-admin text-xs">
                          {d.name?.[0]}
                        </div>
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                          style={{ background: d.isAvailable ? '#22C55E' : '#D1D5DB' }}
                        />
                      </div>
                      <span className="font-medium text-gray-800">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono">{d.phone}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-gray-700">{d.vehicle ?? '—'}</p>
                      {d.vehiclePlate && <p className="text-gray-400 text-xs font-mono">{d.vehiclePlate}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-700">{d.deliveriesCount ?? 0}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: d.isAvailable ? '#F0FDF4' : '#F9FAFB',
                        color: d.isAvailable ? '#16A34A' : '#6B7280',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: d.isAvailable ? '#22C55E' : '#9CA3AF' }} />
                      {d.isAvailable ? 'متاح' : 'غير متاح'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {d.activeOrder ? (
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs"
                        style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}
                      >
                        <Package className="w-3 h-3 text-orange-500" />
                        <span className="font-medium text-orange-700 max-w-[120px] truncate">
                          {d.activeOrder.store?.storeName ?? `#${d.activeOrder.id.slice(-5)}`}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {d.isAvailable && !d.activeOrder && (
                        <button
                          onClick={() => setAssignDriver(d)}
                          className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="تعيين على طلب"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteId(d.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="إضافة مندوب جديد">
        <DriverForm onSubmit={addMut.mutate} isLoading={addMut.isPending} onCancel={() => setShowForm(false)} />
      </Modal>

      {assignDriver && (
        <Modal open={!!assignDriver} onClose={() => setAssignDriver(null)} title={`تعيين طلب لـ ${assignDriver.name}`}>
          <AssignOrderModal driver={assignDriver} onClose={() => setAssignDriver(null)} />
        </Modal>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="حذف المندوب"
        message="هل تريد حذف هذا المندوب من المنصة؟ سيتم حذف حسابه نهائياً."
        confirmLabel="نعم، احذف"
        danger
        onConfirm={() => deleteMut.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMut.isPending}
      />
    </div>
  )
}
