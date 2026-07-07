import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus, Megaphone, Trash2, Power, Edit } from 'lucide-react'
import { getAds, createAd, updateAd, deleteAd, toggleAd } from '@/api/admin.api'
import Modal from '@/components/common/Modal'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import EmptyState from '@/components/common/EmptyState'
import PageBanner from '@/components/admin/layout/PageBanner'
import { formatDate } from '@/utils/formatDate'

function AdForm({ ad, onSubmit, isLoading, onCancel }) {
  const [form, setForm] = useState({
    title:     ad?.title     ?? '',
    subtitle:  ad?.subtitle  ?? '',
    link:      ad?.link      ?? '',
    position:  ad?.position  ?? 'banner',
    startDate: ad?.startDate ?? '',
    endDate:   ad?.endDate   ?? '',
    color:     ad?.color     ?? '#00C896',
  })
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div className="space-y-4" dir="rtl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الإعلان *</label>
        <input value={form.title} onChange={e => set('title', e.target.value)}
          placeholder="مثال: تخفيضات الصيف 50%"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-admin focus:outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">النص الفرعي</label>
        <input value={form.subtitle} onChange={e => set('subtitle', e.target.value)}
          placeholder="نص توضيحي إضافي..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-admin focus:outline-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الموضع</label>
          <select value={form.position} onChange={e => set('position', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-admin focus:outline-none bg-white">
            <option value="banner">بانر رئيسي</option>
            <option value="popup">نافذة منبثقة</option>
            <option value="sidebar">شريط جانبي</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">لون الخلفية</label>
          <div className="flex items-center gap-2">
            <input type="color" value={form.color} onChange={e => set('color', e.target.value)}
              className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
            <span className="text-sm text-gray-500">{form.color}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البداية</label>
          <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-admin focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء</label>
          <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-admin focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">الرابط (اختياري)</label>
        <input value={form.link} onChange={e => set('link', e.target.value)}
          placeholder="مثال: /category/fruits"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-admin focus:outline-none" />
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={() => onSubmit(form)} disabled={!form.title || isLoading}
          className="flex-1 py-3 text-white rounded-xl text-sm font-extrabold disabled:opacity-50 transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', boxShadow: '0 8px 24px rgba(99,102,241,0.5)' }}>
          {isLoading ? 'جاري الحفظ...' : ad ? 'حفظ التعديلات' : 'إنشاء الإعلان'}
        </button>
        <button onClick={onCancel} className="px-5 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
          إلغاء
        </button>
      </div>
    </div>
  )
}

export default function AdminAdsPage() {
  const qc = useQueryClient()
  const [showForm,  setShowForm]  = useState(false)
  const [editAd,    setEditAd]    = useState(null)
  const [deleteId,  setDeleteId]  = useState(null)

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ['admin-ads'],
    queryFn:  getAds,
  })

  const createMut = useMutation({
    mutationFn: createAd,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-ads'] }); toast.success('تم إنشاء الإعلان'); setShowForm(false) },
    onError: () => toast.error('تعذّر إنشاء الإعلان'),
  })

  const updateMut = useMutation({
    mutationFn: (data) => updateAd(editAd.id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-ads'] }); toast.success('تم تحديث الإعلان'); setEditAd(null) },
    onError: () => toast.error('تعذّر تحديث الإعلان'),
  })

  const deleteMut = useMutation({
    mutationFn: deleteAd,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-ads'] }); toast.success('تم حذف الإعلان'); setDeleteId(null) },
    onError: () => toast.error('تعذّر حذف الإعلان'),
  })

  const toggleMut = useMutation({
    mutationFn: ({ id, active }) => toggleAd(id, active),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-ads'] }); toast.success('تم تحديث حالة الإعلان') },
    onError: () => toast.error('تعذّر تحديث الإعلان'),
  })

  return (
    <div className="space-y-5" dir="rtl">
      <PageBanner
        title="إدارة الإعلانات"
        subtitle={`${ads.length} إعلان — تحكم في حملات التسويق`}
        icon={Megaphone}
        gradient="linear-gradient(135deg, #701A75 0%, #A21CAF 50%, #D946EF 100%)"
        glow="rgba(217,70,239,0.4)"
      />

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          style={{ background: 'linear-gradient(135deg, #A21CAF, #D946EF)' }}
        >
          <Plus className="w-4 h-4" />
          إعلان جديد
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse h-40" />
          ))}
        </div>
      ) : !ads.length ? (
        <EmptyState icon={Megaphone} title="لا توجد إعلانات" message="أنشئ إعلانك الأول لاستهداف العملاء" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ads.map(a => {
            const isExpired = a.endDate && new Date(a.endDate) < new Date()
            const isActive  = a.active !== false && !isExpired
            return (
              <div key={a.id} className={`rounded-2xl p-5 shadow-sm relative overflow-hidden ${isActive ? 'bg-white' : 'bg-gray-50'}`}>
                {/* Color accent */}
                <div className="absolute top-0 right-0 w-1.5 h-full rounded-r-2xl" style={{ background: a.color ?? '#6366F1' }} />

                <div className="flex items-start justify-between gap-3 pr-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{a.title}</p>
                      {isExpired && <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">منتهي</span>}
                    </div>
                    {a.subtitle && <p className="text-sm text-gray-500 mb-2">{a.subtitle}</p>}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full">{
                        a.position === 'banner' ? 'بانر رئيسي' : a.position === 'popup' ? 'نافذة منبثقة' : 'شريط جانبي'
                      }</span>
                      {a.startDate && <span>من {formatDate(a.startDate)}</span>}
                      {a.endDate   && <span>إلى {formatDate(a.endDate)}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleMut.mutate({ id: a.id, active: !a.active })}
                      className={`p-1.5 rounded-lg transition-colors ${isActive ? 'hover:bg-orange-50 text-green-600' : 'hover:bg-green-50 text-gray-400'}`}
                      title={isActive ? 'تعطيل' : 'تفعيل'}>
                      <Power className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditAd(a)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(a.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 pr-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isExpired ? 'منتهي' : isActive ? 'نشط' : 'معطّل'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="إنشاء إعلان جديد">
        <AdForm onSubmit={createMut.mutate} isLoading={createMut.isPending} onCancel={() => setShowForm(false)} />
      </Modal>

      <Modal open={!!editAd} onClose={() => setEditAd(null)} title="تعديل الإعلان">
        {editAd && <AdForm ad={editAd} onSubmit={updateMut.mutate} isLoading={updateMut.isPending} onCancel={() => setEditAd(null)} />}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="حذف الإعلان"
        message="هل تريد حذف هذا الإعلان؟"
        confirmLabel="نعم، احذف"
        danger
        onConfirm={() => deleteMut.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMut.isPending}
      />
    </div>
  )
}
