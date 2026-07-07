import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { getDisputes, resolveDispute, rejectDispute } from '@/api/admin.api'
import EmptyState from '@/components/common/EmptyState'
import Modal from '@/components/common/Modal'
import Pagination from '@/components/common/Pagination'
import PageBanner from '@/components/admin/layout/PageBanner'
import { formatDate } from '@/utils/formatDate'
import { formatPrice } from '@/utils/formatPrice'

const TYPE_COLORS = {
  open:     'border-red-400',
  pending:  'border-orange-300',
  resolved: 'border-green-400',
  rejected: 'border-gray-300',
}

function DisputeModal({ dispute, onClose }) {
  const qc  = useQueryClient()
  const [note, setNote] = useState('')

  const resolveMut = useMutation({
    mutationFn: () => resolveDispute(dispute.id, { note }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-disputes'] }); toast.success('تم حل النزاع'); onClose() },
    onError: () => toast.error('تعذّر حل النزاع'),
  })

  const rejectMut = useMutation({
    mutationFn: () => rejectDispute(dispute.id, note),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-disputes'] }); toast.success('تم رفض النزاع'); onClose() },
    onError: () => toast.error('تعذّر رفض النزاع'),
  })

  const isPending = resolveMut.isPending || rejectMut.isPending

  return (
    <Modal open={!!dispute} onClose={onClose} title={`نزاع طلب #${dispute?.orderId}`}>
      <div className="space-y-4 text-sm" dir="rtl">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-gray-500 text-xs">العميل</p>
            <p className="font-medium mt-0.5">{dispute?.customerName}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-gray-500 text-xs">المتجر</p>
            <p className="font-medium mt-0.5">{dispute?.storeName}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-gray-500 text-xs">قيمة الطلب</p>
            <p className="font-bold text-admin mt-0.5">{formatPrice(dispute?.orderTotal)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-gray-500 text-xs">تاريخ الإبلاغ</p>
            <p className="font-medium mt-0.5">{formatDate(dispute?.createdAt)}</p>
          </div>
        </div>

        <div>
          <p className="text-gray-500 text-xs mb-1">تفاصيل النزاع</p>
          <p className="text-gray-700 bg-gray-50 rounded-xl p-3 leading-relaxed">{dispute?.description}</p>
        </div>

        {dispute?.status === 'open' || dispute?.status === 'pending' ? (
          <>
            <div>
              <label className="block text-xs text-gray-500 mb-1">ملاحظة القرار (اختياري)</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="اكتب ملاحظة توضيحية..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-admin focus:outline-none resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => resolveMut.mutate()}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-xl text-sm font-extrabold disabled:opacity-50 transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', boxShadow: '0 8px 24px rgba(34,197,94,0.45)' }}
              >
                <CheckCircle className="w-4 h-4" />
                حل النزاع (لصالح العميل)
              </button>
              <button
                onClick={() => rejectMut.mutate()}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-xl text-sm font-extrabold disabled:opacity-50 transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', boxShadow: '0 8px 24px rgba(239,68,68,0.45)' }}
              >
                <XCircle className="w-4 h-4" />
                رفض النزاع
              </button>
            </div>
          </>
        ) : (
          <div className={`p-3 rounded-xl text-sm ${dispute?.status === 'resolved' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
            {dispute?.status === 'resolved' ? '✓ تم حل هذا النزاع' : '✗ تم رفض هذا النزاع'}
            {dispute?.resolution && <p className="mt-1 text-xs opacity-80">{dispute.resolution}</p>}
          </div>
        )}
      </div>
    </Modal>
  )
}

function DisputeCard({ dispute, onSelect }) {
  const borderColor = TYPE_COLORS[dispute.status] ?? 'border-gray-200'
  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-sm border-r-4 ${borderColor} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={() => onSelect(dispute)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${dispute.status === 'open' ? 'text-red-500' : 'text-gray-400'}`} />
          <div>
            <p className="font-bold text-gray-800">طلب #{dispute.orderId}</p>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{dispute.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span>{dispute.customerName}</span>
              <span>•</span>
              <span>{dispute.storeName}</span>
              <span>•</span>
              <span>{formatDate(dispute.createdAt)}</span>
            </div>
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
          dispute.status === 'open'     ? 'bg-red-50 text-red-600' :
          dispute.status === 'pending'  ? 'bg-orange-50 text-orange-600' :
          dispute.status === 'resolved' ? 'bg-green-50 text-green-600' :
                                          'bg-gray-100 text-gray-500'
        }`}>
          {dispute.status === 'open' ? 'مفتوح' : dispute.status === 'pending' ? 'قيد المراجعة' : dispute.status === 'resolved' ? 'محلول' : 'مرفوض'}
        </span>
      </div>
    </div>
  )
}

export default function AdminDisputesPage() {
  const [filter,   setFilter]   = useState('')
  const [page,     setPage]     = useState(1)
  const [selected, setSelected] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-disputes', { filter, page }],
    queryFn:  () => getDisputes({ status: filter, page, limit: 10 }),
    keepPreviousData: true,
  })

  const disputes   = data?.disputes ?? []
  const totalPages = data?.totalPages ?? 1
  const openCount  = data?.counts?.open ?? 0

  return (
    <div className="space-y-5" dir="rtl">
      <PageBanner
        title="النزاعات والشكاوى"
        subtitle={openCount > 0 ? `${openCount} نزاع مفتوح يحتاج مراجعة عاجلة` : 'حل النزاعات بين العملاء والبائعين'}
        icon={AlertTriangle}
        gradient="linear-gradient(135deg, #7F1D1D 0%, #B91C1C 50%, #EF4444 100%)"
        glow="rgba(239,68,68,0.4)"
        badge={openCount > 0 ? `⚠️ ${openCount} نزاع مفتوح` : null}
      />

      <div className="flex gap-2">
        {[
          { key: '',         label: 'الكل' },
          { key: 'open',     label: 'مفتوح' },
          { key: 'pending',  label: 'قيد المراجعة' },
          { key: 'resolved', label: 'محلول' },
          { key: 'rejected', label: 'مرفوض' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setPage(1) }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === f.key ? 'text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500'
            }`}
            style={filter === f.key ? { background: 'linear-gradient(135deg, #B91C1C, #EF4444)' } : {}}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse h-28" />
          ))}
        </div>
      ) : !disputes.length ? (
        <EmptyState icon={AlertTriangle} title="لا توجد نزاعات" message="لا توجد نزاعات تطابق الفلتر" />
      ) : (
        <div className="space-y-3">
          {disputes.map(d => <DisputeCard key={d.id} dispute={d} onSelect={setSelected} />)}
        </div>
      )}

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}

      {selected && <DisputeModal dispute={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
