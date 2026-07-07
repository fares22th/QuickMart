import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Search, Users, ShieldOff, ShieldCheck } from 'lucide-react'
import { getAdminCustomers, banCustomer, unbanCustomer } from '@/api/admin.api'
import Avatar from '@/components/common/Avatar'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import Pagination from '@/components/common/Pagination'
import EmptyState from '@/components/common/EmptyState'
import PageBanner from '@/components/admin/layout/PageBanner'
import { formatDate } from '@/utils/formatDate'
import { formatPrice } from '@/utils/formatPrice'

function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm divide-y">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
          <div className="w-9 h-9 rounded-full bg-gray-100" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 bg-gray-100 rounded w-36" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
          <div className="h-4 bg-gray-100 rounded w-20" />
          <div className="h-4 bg-gray-100 rounded w-16" />
        </div>
      ))}
    </div>
  )
}

export default function AdminCustomersPage() {
  const qc = useQueryClient()
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('')
  const [page,    setPage]    = useState(1)
  const [dialog,  setDialog]  = useState(null) // { type: 'ban'|'unban', id, name }

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', { search, filter, page }],
    queryFn:  () => getAdminCustomers({ search, status: filter, page, limit: 15 }),
    keepPreviousData: true,
  })

  const banMut = useMutation({
    mutationFn: banCustomer,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-customers'] }); toast.success('تم حظر العميل'); setDialog(null) },
    onError: () => toast.error('تعذّر حظر العميل'),
  })

  const unbanMut = useMutation({
    mutationFn: unbanCustomer,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-customers'] }); toast.success('تم رفع الحظر'); setDialog(null) },
    onError: () => toast.error('تعذّر رفع الحظر'),
  })

  const customers  = data?.customers ?? []
  const totalPages = data?.totalPages ?? 1
  const total      = data?.total ?? 0

  return (
    <div className="space-y-5" dir="rtl">
      <PageBanner
        title="إدارة العملاء"
        subtitle={!isLoading ? `${total} عميل مسجّل في المنصة` : 'إدارة ومتابعة حسابات العملاء'}
        icon={Users}
        gradient="linear-gradient(135deg, #1E3A5F 0%, #1D4ED8 50%, #3B82F6 100%)"
        glow="rgba(59,130,246,0.4)"
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="بحث باسم العميل أو رقمه..."
            className="w-full pr-9 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-admin focus:outline-none bg-white"
          />
        </div>
        {[{ key: '', label: 'الكل' }, { key: 'active', label: 'نشط' }, { key: 'banned', label: 'محظور' }].map(f => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setPage(1) }}
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={filter === f.key
              ? { background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', boxShadow: '0 6px 18px rgba(99,102,241,0.45)' }
              : { background: '#fff', color: '#6B7280', border: '1.5px solid #E5E7EB' }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? <TableSkeleton /> : !customers.length ? (
        <EmptyState icon={Users} title="لا يوجد عملاء" message="لا توجد نتائج تطابق الفلتر" />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm" dir="rtl">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                {['العميل', 'رقم الجوال', 'الطلبات', 'إجمالي الإنفاق', 'تاريخ التسجيل', 'إجراءات'].map(h => (
                  <th key={h} className="px-4 py-3 text-right font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map(c => (
                <tr key={c.id} className={`hover:bg-gray-50 transition-colors ${c.status === 'banned' ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <Link to={`/admin/customers/${c.id}`} className="flex items-center gap-2 hover:text-admin transition-colors">
                      <Avatar name={c.name} size="sm" />
                      <div>
                        <p className="font-medium text-gray-800">{c.name}</p>
                        {c.status === 'banned' && <span className="text-xs text-red-500">محظور</span>}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.phone}</td>
                  <td className="px-4 py-3 text-gray-700">{c.ordersCount ?? 0}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{formatPrice(c.totalSpent ?? 0)}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(c.createdAt)}</td>
                  <td className="px-4 py-3">
                    {c.status === 'banned' ? (
                      <button
                        onClick={() => setDialog({ type: 'unban', id: c.id, name: c.name })}
                        className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> رفع الحظر
                      </button>
                    ) : (
                      <button
                        onClick={() => setDialog({ type: 'ban', id: c.id, name: c.name })}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium"
                      >
                        <ShieldOff className="w-3.5 h-3.5" /> حظر
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}

      <ConfirmDialog
        open={!!dialog}
        title={dialog?.type === 'ban' ? 'حظر العميل' : 'رفع الحظر عن العميل'}
        message={
          dialog?.type === 'ban'
            ? `هل تريد حظر العميل "${dialog?.name}"؟ لن يستطيع تسجيل الدخول أو تقديم طلبات.`
            : `هل تريد رفع الحظر عن "${dialog?.name}"؟ سيتمكن من استخدام المنصة مجدداً.`
        }
        confirmLabel={dialog?.type === 'ban' ? 'نعم، حظر' : 'نعم، رفع الحظر'}
        danger={dialog?.type === 'ban'}
        onConfirm={() => dialog?.type === 'ban' ? banMut.mutate(dialog.id) : unbanMut.mutate(dialog.id)}
        onCancel={() => setDialog(null)}
        loading={banMut.isPending || unbanMut.isPending}
      />
    </div>
  )
}
