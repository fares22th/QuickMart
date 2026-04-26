import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ChevronRight, Edit, Save, X, ShoppingBag, Loader2 } from 'lucide-react'
import { getCustomer, updateCustomer } from '@/api/admin.api'
import { formatPrice } from '@/utils/formatPrice'
import { formatDate, fromNow } from '@/utils/formatDate'
import Avatar from '@/components/common/Avatar'
import Spinner from '@/components/common/Spinner'

const schema = z.object({
  name:  z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().optional().or(z.literal('')),
})

const STATUS_STYLES = {
  pending:          'bg-yellow-100 text-yellow-700',
  confirmed:        'bg-blue-100 text-blue-700',
  preparing:        'bg-blue-100 text-blue-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered:        'bg-green-100 text-green-700',
  cancelled:        'bg-red-100 text-red-700',
}
const STATUS_AR = {
  pending: 'انتظار', confirmed: 'مؤكد', preparing: 'تحضير',
  out_for_delivery: 'في الطريق', delivered: 'مُسلَّم', cancelled: 'ملغي',
}

export default function CustomerDetailPage() {
  const { id } = useParams()
  const qc     = useQueryClient()
  const [editMode, setEditMode] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customer', id],
    queryFn:  () => getCustomer(id),
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    values:   { name: data?.profile?.name ?? '', phone: data?.profile?.phone ?? '' },
  })

  const mutation = useMutation({
    mutationFn: (payload) => updateCustomer(id, payload),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['admin-customer', id] })
      qc.invalidateQueries({ queryKey: ['admin-customers'] })
      toast.success('تم تحديث بيانات العميل')
      setEditMode(false)
    },
    onError: (e) => toast.error(e.message),
  })

  if (isLoading) return <Spinner size="lg" />

  const { profile, orders } = data ?? {}
  const totalSpent = orders?.filter(o => o.status === 'delivered').reduce((s, o) => s + (Number(o.total) || 0), 0) ?? 0

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link to="/admin/customers" className="hover:text-indigo-600 transition-colors">العملاء</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-700 font-medium">{profile?.name ?? id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-bold text-gray-800">بيانات العميل</h2>
              {!editMode
                ? <button onClick={() => setEditMode(true)}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                    <Edit className="w-3.5 h-3.5" /> تعديل
                  </button>
                : <button onClick={() => { setEditMode(false); reset() }}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    <X className="w-3.5 h-3.5" /> إلغاء
                  </button>
              }
            </div>

            <div className="flex flex-col items-center text-center mb-5">
              <Avatar src={profile?.avatar_url} name={profile?.name} size="lg" />
              <p className="font-bold text-gray-900 mt-3">{profile?.name}</p>
              <p className="text-xs text-gray-400 mt-1">انضم {fromNow(profile?.created_at)}</p>
              <span className="mt-2 text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">عميل</span>
            </div>

            {editMode ? (
              <form onSubmit={handleSubmit(d => mutation.mutateAsync(d))} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">الاسم</label>
                  <input {...register('name')}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400" />
                  {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">الهاتف</label>
                  <input {...register('phone')} dir="ltr"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400" />
                </div>
                <button type="submit" disabled={mutation.isPending}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-60">
                  {mutation.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> حفظ...</> : <><Save className="w-3.5 h-3.5" /> حفظ</>}
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-t border-gray-50">
                  <span className="text-gray-500">الهاتف</span>
                  <span className="font-medium text-gray-800 dir-ltr" dir="ltr">{profile?.phone || '—'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-gray-50">
                  <span className="text-gray-500">تاريخ التسجيل</span>
                  <span className="font-medium text-gray-800">{formatDate(profile?.created_at)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'إجمالي الطلبات', value: orders?.length ?? 0, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'إجمالي الإنفاق', value: formatPrice(totalSpent), color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'طلبات مكتملة',   value: orders?.filter(o => o.status === 'delivered').length ?? 0, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'طلبات ملغية',    value: orders?.filter(o => o.status === 'cancelled').length ?? 0, color: 'text-red-500',   bg: 'bg-red-50' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-500" />
            سجل الطلبات
            <span className="text-xs text-gray-400 font-normal">({orders?.length ?? 0})</span>
          </h2>

          {orders?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">لم يقم العميل بأي طلبات بعد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-50">
                    {['#', 'المتجر', 'المبلغ', 'الطريقة', 'التاريخ', 'الحالة'].map(h => (
                      <th key={h} className="text-right pb-3 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 text-xs text-gray-400">#{o.id.slice(-6)}</td>
                      <td className="py-3 text-gray-700">{o.stores?.name ?? '—'}</td>
                      <td className="py-3 font-bold text-gray-900">{formatPrice(o.total)}</td>
                      <td className="py-3 text-gray-500 text-xs">{o.payment_method === 'cash' ? 'كاش' : o.payment_method === 'card' ? 'بطاقة' : 'محفظة'}</td>
                      <td className="py-3 text-xs text-gray-400">{formatDate(o.created_at)}</td>
                      <td className="py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_AR[o.status] ?? o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
