import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Search, Store, CheckCircle, XCircle, Clock } from 'lucide-react'
import { getAdminSellers, approveSeller, rejectSeller, suspendSeller } from '@/api/admin.api'
import Avatar from '@/components/common/Avatar'
import StatusPill from '@/components/common/StatusPill'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import Pagination from '@/components/common/Pagination'
import EmptyState from '@/components/common/EmptyState'
import PageBanner from '@/components/admin/layout/PageBanner'
import { formatDate } from '@/utils/formatDate'

const STATUS_TABS = [
  { key: '',          label: 'الكل' },
  { key: 'pending',   label: 'قيد الموافقة' },
  { key: 'active',    label: 'نشط' },
  { key: 'suspended', label: 'موقوف' },
  { key: 'rejected',  label: 'مرفوض' },
]

function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm divide-y">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
          <div className="w-9 h-9 rounded-full bg-gray-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-40" />
            <div className="h-3 bg-gray-100 rounded w-28" />
          </div>
          <div className="h-6 bg-gray-100 rounded w-20" />
        </div>
      ))}
    </div>
  )
}

export default function AdminSellersPage() {
  const qc = useQueryClient()
  const [search,   setSearch]   = useState('')
  const [status,   setStatus]   = useState('')
  const [page,     setPage]     = useState(1)
  const [dialog,   setDialog]   = useState(null) // { type: 'approve'|'reject'|'suspend', id }

  const { data, isLoading } = useQuery({
    queryKey: ['admin-sellers', { search, status, page }],
    queryFn:  () => getAdminSellers({ search, status, page, limit: 15 }),
    keepPreviousData: true,
  })

  const mutate = (fn, successMsg) => useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-sellers'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success(successMsg)
      setDialog(null)
    },
    onError: () => toast.error('حدث خطأ، حاول مرة أخرى'),
  })

  const approveMut = useMutation({
    mutationFn: approveSeller,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sellers'] }); qc.invalidateQueries({ queryKey: ['admin-stats'] }); toast.success('تم قبول البائع'); setDialog(null) },
    onError: () => toast.error('تعذّر قبول البائع'),
  })

  const rejectMut = useMutation({
    mutationFn: (id) => rejectSeller(id, 'رُفض من قبل المشرف'),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sellers'] }); toast.success('تم رفض البائع'); setDialog(null) },
    onError: () => toast.error('تعذّر رفض البائع'),
  })

  const suspendMut = useMutation({
    mutationFn: suspendSeller,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sellers'] }); toast.success('تم تعليق حساب البائع'); setDialog(null) },
    onError: () => toast.error('تعذّر تعليق الحساب'),
  })

  const sellers    = data?.sellers ?? []
  const totalPages = data?.totalPages ?? 1
  const counts     = data?.counts ?? {}

  const handleConfirm = () => {
    if (!dialog) return
    if (dialog.type === 'approve') approveMut.mutate(dialog.id)
    if (dialog.type === 'reject')  rejectMut.mutate(dialog.id)
    if (dialog.type === 'suspend') suspendMut.mutate(dialog.id)
  }

  const isConfirmLoading = approveMut.isPending || rejectMut.isPending || suspendMut.isPending

  return (
    <div className="space-y-5" dir="rtl">
      <PageBanner
        title="إدارة البائعين"
        subtitle={counts.pending > 0 ? `${counts.pending} بائع ينتظر الموافقة` : 'مراجعة وإدارة حسابات البائعين'}
        icon={Store}
        gradient="linear-gradient(135deg, #4C1D95 0%, #6D28D9 50%, #7C3AED 100%)"
        glow="rgba(124,58,237,0.4)"
        badge={counts.pending > 0 ? `⏳ ${counts.pending} ينتظر` : null}
      />

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto">
        {STATUS_TABS.map(t => (
          <button
            key={t.key}
            onClick={() => { setStatus(t.key); setPage(1) }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              status === t.key ? 'text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600'
            }`}
            style={status === t.key ? { background: 'linear-gradient(135deg, #6D28D9, #7C3AED)' } : {}}
          >
            {t.label}
            {counts[t.key || 'all'] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${status === t.key ? 'bg-white/20' : 'bg-gray-100'}`}>
                {counts[t.key || 'all']}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="بحث باسم البائع أو المتجر..."
          className="w-full pr-9 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-admin focus:outline-none bg-white"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : !sellers.length ? (
        <EmptyState icon={Store} title="لا يوجد بائعون" message="لا توجد نتائج تطابق الفلتر" />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" dir="rtl">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  {['البائع', 'المتجر', 'رقم السجل', 'الطلبات', 'تاريخ التسجيل', 'الحالة', 'إجراءات'].map(h => (
                    <th key={h} className="px-4 py-3 text-right font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sellers.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={s.name} size="sm" />
                        <div>
                          <p className="font-medium text-gray-800">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{s.storeName}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.crNumber ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{s.ordersCount ?? 0}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(s.createdAt)}</td>
                    <td className="px-4 py-3"><StatusPill status={s.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/sellers/${s.id}`} className="text-xs text-admin hover:underline font-medium">تفاصيل</Link>
                        {s.status === 'pending' && (
                          <>
                            <button onClick={() => setDialog({ type: 'approve', id: s.id })}
                              className="p-1 rounded-lg hover:bg-green-50 text-green-600 transition-colors" title="قبول">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDialog({ type: 'reject', id: s.id })}
                              className="p-1 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="رفض">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {s.status === 'active' && (
                          <button onClick={() => setDialog({ type: 'suspend', id: s.id })}
                            className="p-1 rounded-lg hover:bg-orange-50 text-orange-500 transition-colors" title="تعليق">
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}

      <ConfirmDialog
        open={!!dialog}
        title={dialog?.type === 'approve' ? 'قبول البائع' : dialog?.type === 'reject' ? 'رفض البائع' : 'تعليق البائع'}
        message={
          dialog?.type === 'approve' ? 'هل تريد قبول هذا البائع والسماح له بالبيع على المنصة؟' :
          dialog?.type === 'reject'  ? 'هل تريد رفض هذا البائع؟ سيتم إخطاره بالرفض.' :
          'هل تريد تعليق حساب هذا البائع مؤقتاً؟'
        }
        confirmLabel={dialog?.type === 'approve' ? 'نعم، قبول' : dialog?.type === 'reject' ? 'نعم، رفض' : 'نعم، تعليق'}
        danger={dialog?.type !== 'approve'}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
        loading={isConfirmLoading}
      />
    </div>
  )
}
