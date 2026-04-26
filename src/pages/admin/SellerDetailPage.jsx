import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  ArrowRight, Store, Tag, MapPin, Star, Package, Phone, Mail,
  CreditCard, FileText, CheckCircle, XCircle, PauseCircle,
  PlayCircle, AlertCircle, ChevronLeft, Calendar, BadgeCheck,
} from 'lucide-react'
import { getStore, setStoreStatus } from '@/api/admin.api'

const STATUS_META = {
  pending:   { label: 'معلق',   bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400' },
  active:    { label: 'نشط',    bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500' },
  rejected:  { label: 'مرفوض', bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500'   },
  suspended: { label: 'موقوف', bg: 'bg-slate-50',  text: 'text-slate-600',  border: 'border-slate-200',  dot: 'bg-slate-400' },
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${m.bg} ${m.text} ${m.border}`}>
      <span className={`w-2 h-2 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  )
}

function InfoRow({ label, value, mono = false }) {
  if (value == null || value === '') return null
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className={`text-sm font-medium text-gray-900 text-left break-all ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}

function Section({ title, icon: Icon, children, accent }) {
  const iconBg = accent === 'green' ? 'bg-green-50' : accent === 'amber' ? 'bg-amber-50' : accent === 'blue' ? 'bg-blue-50' : 'bg-gray-50'
  const iconColor = accent === 'green' ? 'text-green-600' : accent === 'amber' ? 'text-amber-600' : accent === 'blue' ? 'text-blue-600' : 'text-gray-600'
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-50">
        <div className={`w-8 h-8 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function SkeletonCard({ rows = 3, height = 'h-4' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse space-y-3">
      <div className="h-5 bg-gray-100 rounded w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`${height} bg-gray-100 rounded`} />
      ))}
    </div>
  )
}

export default function SellerDetailPage() {
  const { id } = useParams()
  const qc = useQueryClient()
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const { data: store, isLoading } = useQuery({
    queryKey: ['admin-store', id],
    queryFn: () => getStore(id),
  })

  const { mutate: changeStatus, isPending } = useMutation({
    mutationFn: ({ status }) => setStoreStatus(id, status),
    onSuccess: (_, { status }) => {
      const msgs = {
        active:    'تمت الموافقة على المتجر ✓',
        rejected:  'تم رفض المتجر',
        suspended: 'تم إيقاف المتجر مؤقتاً',
      }
      toast.success(msgs[status] ?? 'تم تحديث الحالة')
      qc.invalidateQueries({ queryKey: ['admin-store', id] })
      qc.invalidateQueries({ queryKey: ['admin-stores'] })
      setShowRejectModal(false)
    },
    onError: () => toast.error('فشل تحديث الحالة — حاول مرة أخرى'),
  })

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }) : null

  if (isLoading) {
    return (
      <div className="p-6 space-y-5 max-w-6xl mx-auto">
        <div className="h-5 bg-gray-100 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
          <div className="h-40 bg-gray-100" />
          <div className="p-6 space-y-3">
            <div className="h-6 bg-gray-100 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <SkeletonCard rows={5} />
            <SkeletonCard rows={3} />
          </div>
          <div className="space-y-5">
            <SkeletonCard rows={4} />
            <SkeletonCard rows={2} />
          </div>
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="p-6 text-center py-20">
        <Store className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-500 font-semibold">لم يُعثر على المتجر</p>
        <Link to="/admin/sellers" className="mt-4 inline-block text-sm text-green-600 font-medium hover:underline">
          العودة للقائمة
        </Link>
      </div>
    )
  }

  const seller = store.seller_profiles

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto" dir="rtl">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/admin/sellers" className="hover:text-gray-700 transition-colors flex items-center gap-1">
          <ArrowRight className="w-4 h-4" /> إدارة البائعين
        </Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-medium truncate">{store.name}</span>
      </div>

      {/* ── Store Header ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-44 relative"
          style={{ background: store.cover_url ? undefined : 'linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#16a34a22 100%)' }}>
          {store.cover_url && (
            <img src={store.cover_url} alt="" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute top-4 right-4">
            <StatusBadge status={store.status} />
          </div>
          {store.is_featured && (
            <div className="absolute top-4 left-4 bg-amber-400 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Star className="w-3 h-3 fill-white" /> مميز
            </div>
          )}
        </div>

        {/* Header info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-8 mb-4">
            {/* Logo + name */}
            <div className="flex items-end gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white border-[3px] border-white shadow-xl flex items-center justify-center shrink-0">
                {store.logo_url
                  ? <img src={store.logo_url} alt="" className="w-full h-full rounded-xl object-cover" />
                  : <Store className="w-8 h-8 text-gray-300" />
                }
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  {store.category && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Tag className="w-3 h-3" /> {store.category}
                    </span>
                  )}
                  {store.city && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" /> {store.city}
                    </span>
                  )}
                  {store.rating != null && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-gray-700">{Number(store.rating).toFixed(1)}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 pb-1">
              {store.status === 'pending' && (
                <>
                  <button onClick={() => changeStatus({ status: 'active' })} disabled={isPending}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-50 active:scale-95">
                    <CheckCircle className="w-4 h-4" /> موافقة
                  </button>
                  <button onClick={() => setShowRejectModal(true)} disabled={isPending}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 active:scale-95">
                    <XCircle className="w-4 h-4" /> رفض
                  </button>
                </>
              )}
              {store.status === 'active' && (
                <button onClick={() => changeStatus({ status: 'suspended' })} disabled={isPending}
                  className="flex items-center gap-1.5 px-4 py-2.5 border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 active:scale-95">
                  <PauseCircle className="w-4 h-4" /> إيقاف مؤقت
                </button>
              )}
              {(store.status === 'suspended' || store.status === 'rejected') && (
                <button onClick={() => changeStatus({ status: 'active' })} disabled={isPending}
                  className="flex items-center gap-1.5 px-4 py-2.5 border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 active:scale-95">
                  <PlayCircle className="w-4 h-4" /> تفعيل
                </button>
              )}
            </div>
          </div>

          {store.description && (
            <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4">{store.description}</p>
          )}
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Left 2/3 */}
        <div className="lg:col-span-2 space-y-5">

          {/* Store Details */}
          <Section title="تفاصيل المتجر" icon={Store} accent="green">
            <InfoRow label="اسم المتجر" value={store.name} />
            <InfoRow label="التصنيف" value={store.category} />
            <InfoRow label="المدينة" value={store.city} />
            <InfoRow label="العنوان التفصيلي" value={store.address} />
            <InfoRow label="رقم السجل التجاري" value={store.cr_number} mono />
            <InfoRow label="تاريخ التسجيل" value={formatDate(store.created_at)} />
          </Section>

          {/* Delivery */}
          <Section title="إعدادات التوصيل" icon={Package} accent="blue">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'رسوم التوصيل', value: store.delivery_fee != null ? `${store.delivery_fee} ريال` : '—' },
                { label: 'الحد الأدنى للطلب', value: store.min_order != null ? `${store.min_order} ريال` : '—' },
                { label: 'وقت التوصيل', value: store.delivery_time_min != null ? `${store.delivery_time_min} دقيقة` : '—' },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <p className="text-xl font-black text-gray-900">{item.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Documents */}
          <Section title="المستندات المرفوعة" icon={FileText} accent="amber">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'السجل التجاري', uploaded: !!store.cr_number },
                { label: 'الوثيقة الضريبية', uploaded: false },
                { label: 'شعار المتجر', uploaded: !!store.logo_url },
                { label: 'صورة الغلاف', uploaded: !!store.cover_url },
              ].map(doc => (
                <div key={doc.label}
                  className={`flex items-center gap-2.5 p-3.5 rounded-xl border ${doc.uploaded ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                  {doc.uploaded
                    ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    : <AlertCircle className="w-4 h-4 text-gray-300 shrink-0" />
                  }
                  <span className={`text-xs font-semibold ${doc.uploaded ? 'text-green-700' : 'text-gray-400'}`}>
                    {doc.label}
                  </span>
                  {!doc.uploaded && (
                    <span className="mr-auto text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">مطلوب</span>
                  )}
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Right 1/3 */}
        <div className="space-y-5">

          {/* Seller Profile */}
          <Section title="معلومات البائع" icon={BadgeCheck} accent="green">
            {seller ? (
              <>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-sm">
                    {seller.name?.[0] ?? '؟'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{seller.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">بائع مسجّل</p>
                  </div>
                </div>
                {seller.phone && (
                  <div className="flex items-center gap-2 py-2 border-b border-gray-50">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-700 font-medium" dir="ltr">{seller.phone}</span>
                  </div>
                )}
                {seller.email && (
                  <div className="flex items-center gap-2 py-2 border-b border-gray-50">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-700 font-medium break-all" dir="ltr">{seller.email}</span>
                  </div>
                )}
                {seller.national_id && <InfoRow label="رقم الهوية" value={seller.national_id} mono />}
                <InfoRow label="تاريخ الانضمام" value={formatDate(seller.created_at)} />
              </>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">لا تتوفر بيانات البائع</p>
            )}
          </Section>

          {/* Financial */}
          <Section title="المعلومات المالية" icon={CreditCard} accent="blue">
            <InfoRow label="اسم البنك" value={store.bank_name} />
            <InfoRow label="رقم الآيبان" value={store.iban} mono />
            {!store.bank_name && !store.iban && (
              <p className="text-xs text-gray-400 text-center py-3">لم تُضف بيانات بنكية بعد</p>
            )}
          </Section>

          {/* Timeline */}
          <Section title="السجل الزمني" icon={Calendar}>
            <InfoRow label="تاريخ التقديم" value={formatDate(store.created_at)} />
            {store.updated_at && store.updated_at !== store.created_at && (
              <InfoRow label="آخر تحديث" value={formatDate(store.updated_at)} />
            )}
            <div className="mt-3 pt-3 border-t border-gray-50">
              <p className="text-xs text-gray-400 mb-1.5">معرّف المتجر</p>
              <code className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg break-all block leading-relaxed border border-gray-100">
                {store.id}
              </code>
            </div>
          </Section>
        </div>
      </div>

      {/* ── Rejection Modal ── */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && setShowRejectModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">رفض طلب المتجر</h3>
                <p className="text-sm text-gray-500">يمكنك إضافة سبب الرفض (اختياري)</p>
              </div>
            </div>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="مثال: المستندات غير مكتملة، يرجى إعادة رفع السجل التجاري..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all placeholder:text-gray-400"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors active:scale-95">
                إلغاء
              </button>
              <button onClick={() => changeStatus({ status: 'rejected' })} disabled={isPending}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50 active:scale-95 shadow-sm">
                {isPending ? 'جاري الرفض...' : 'تأكيد الرفض'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
