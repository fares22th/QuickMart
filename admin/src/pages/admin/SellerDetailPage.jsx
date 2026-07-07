import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowRight, Store, Phone, MapPin, Star, ShoppingBag, DollarSign } from 'lucide-react'
import { getAdminSeller, approveSeller, rejectSeller, suspendSeller, activateSeller } from '@/api/admin.api'
import StatusPill from '@/components/common/StatusPill'
import Spinner from '@/components/common/Spinner'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { formatPrice } from '@/utils/formatPrice'
import { formatDate } from '@/utils/formatDate'

function StatBox({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-bold text-gray-900 text-lg">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  )
}

export default function SellerDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const qc       = useQueryClient()
  const [dialog, setDialog] = useState(null)

  const { data: seller, isLoading } = useQuery({
    queryKey: ['admin-seller', id],
    queryFn:  () => getAdminSeller(id),
    enabled:  !!id,
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-seller', id] })
    qc.invalidateQueries({ queryKey: ['admin-sellers'] })
    qc.invalidateQueries({ queryKey: ['admin-stats'] })
  }

  const approveMut  = useMutation({ mutationFn: () => approveSeller(id),  onSuccess: () => { invalidate(); toast.success('تم قبول البائع');      setDialog(null) }, onError: () => toast.error('تعذّر قبول البائع') })
  const rejectMut   = useMutation({ mutationFn: () => rejectSeller(id, 'مرفوض'), onSuccess: () => { invalidate(); toast.success('تم رفض البائع');  setDialog(null) }, onError: () => toast.error('تعذّر رفض البائع') })
  const suspendMut  = useMutation({ mutationFn: () => suspendSeller(id),  onSuccess: () => { invalidate(); toast.success('تم تعليق الحساب');   setDialog(null) }, onError: () => toast.error('تعذّر التعليق') })
  const activateMut = useMutation({ mutationFn: () => activateSeller(id), onSuccess: () => { invalidate(); toast.success('تم تفعيل الحساب');    setDialog(null) }, onError: () => toast.error('تعذّر التفعيل') })

  const isPending = approveMut.isPending || rejectMut.isPending || suspendMut.isPending || activateMut.isPending

  const handleConfirm = () => {
    if (dialog === 'approve') approveMut.mutate()
    if (dialog === 'reject')  rejectMut.mutate()
    if (dialog === 'suspend') suspendMut.mutate()
    if (dialog === 'activate') activateMut.mutate()
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner /></div>
  if (!seller)   return <div className="text-center py-16 text-gray-400">البائع غير موجود</div>

  return (
    <div className="space-y-6 max-w-4xl" dir="rtl">
      {/* Back */}
      <Link to="/admin/sellers" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-admin transition-colors">
        <ArrowRight className="w-4 h-4" />
        العودة إلى البائعين
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-admin/10 flex items-center justify-center">
              {seller.logo
                ? <img src={seller.logo} alt="" className="w-full h-full rounded-2xl object-cover" />
                : <Store className="w-8 h-8 text-admin" />
              }
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{seller.storeName}</h1>
              <p className="text-gray-500">{seller.name}</p>
              <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-400">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{seller.phone}</span>
                {seller.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{seller.city}</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <StatusPill status={seller.status} />
            <div className="flex gap-2">
              {seller.status === 'pending' && (
                <>
                  <button onClick={() => setDialog('approve')} className="px-5 py-2.5 text-white rounded-xl text-sm font-extrabold transition-all active:scale-95" style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', boxShadow: '0 6px 20px rgba(34,197,94,0.45)' }}>قبول</button>
                  <button onClick={() => setDialog('reject')}  className="px-5 py-2.5 text-white rounded-xl text-sm font-extrabold transition-all active:scale-95" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', boxShadow: '0 6px 20px rgba(239,68,68,0.45)' }}>رفض</button>
                </>
              )}
              {seller.status === 'active' && (
                <button onClick={() => setDialog('suspend')} className="px-4 py-2 border border-orange-300 text-orange-600 rounded-xl text-sm font-medium hover:bg-orange-50 transition-colors">تعليق</button>
              )}
              {seller.status === 'suspended' && (
                <button onClick={() => setDialog('activate')} className="px-5 py-2.5 text-white rounded-xl text-sm font-extrabold transition-all active:scale-95" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', boxShadow: '0 6px 20px rgba(99,102,241,0.45)' }}>تفعيل</button>
              )}
            </div>
          </div>
        </div>

        {seller.description && (
          <p className="text-gray-600 text-sm mt-4 pt-4 border-t leading-relaxed">{seller.description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox label="إجمالي الطلبات"    value={seller.totalOrders  ?? 0}           icon={ShoppingBag}  color="bg-blue-50 text-blue-600" />
        <StatBox label="إجمالي الإيرادات"   value={formatPrice(seller.totalRevenue ?? 0)} icon={DollarSign}   color="bg-green-50 text-green-600" />
        <StatBox label="متوسط التقييم"      value={`${(seller.avgRating ?? 0).toFixed(1)} ★`} icon={Star}  color="bg-yellow-50 text-yellow-600" />
        <StatBox label="عدد المنتجات"       value={seller.totalProducts ?? 0}          icon={Store}        color="bg-admin/10 text-admin" />
      </div>

      {/* Store info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-800">بيانات المتجر</h3>
          {[
            { label: 'رقم السجل التجاري', value: seller.crNumber ?? '—' },
            { label: 'الفئة',             value: seller.category ?? '—' },
            { label: 'المدينة',           value: seller.city ?? '—' },
            { label: 'وقت التوصيل',       value: seller.deliveryTime ?? '—' },
            { label: 'الحد الأدنى للطلب', value: seller.minOrder ? formatPrice(seller.minOrder) : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-800">{value}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-800">معلومات التسجيل</h3>
          {[
            { label: 'تاريخ التسجيل',  value: formatDate(seller.createdAt) },
            { label: 'آخر نشاط',       value: seller.lastActive ? formatDate(seller.lastActive) : '—' },
            { label: 'البريد الإلكتروني', value: seller.email ?? '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={!!dialog}
        title={dialog === 'approve' ? 'قبول البائع' : dialog === 'reject' ? 'رفض البائع' : dialog === 'suspend' ? 'تعليق البائع' : 'تفعيل البائع'}
        message={
          dialog === 'approve' ? 'سيتم قبول هذا البائع والسماح له بالبيع على المنصة.' :
          dialog === 'reject'  ? 'سيتم رفض هذا البائع وإخطاره بذلك.' :
          dialog === 'suspend' ? 'سيتم تعليق حساب البائع مؤقتاً ولن يستطيع البيع.' :
          'سيتم تفعيل حساب البائع من جديد.'
        }
        confirmLabel={dialog === 'approve' ? 'قبول' : dialog === 'reject' ? 'رفض' : dialog === 'suspend' ? 'تعليق' : 'تفعيل'}
        danger={dialog === 'reject' || dialog === 'suspend'}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
        loading={isPending}
      />
    </div>
  )
}
