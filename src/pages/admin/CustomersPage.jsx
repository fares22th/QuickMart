import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter, Download, Eye, Ban, Users, UserPlus, TrendingUp, ShoppingBag, X, Check, Mail, Phone, Calendar } from 'lucide-react'
import { getCustomers } from '@/api/admin.api'
import { formatDate } from '@/utils/formatDate'
import { toast } from 'sonner'

function Avatar({ name }) {
  const colors = ['from-blue-400 to-indigo-500','from-green-400 to-emerald-500','from-violet-400 to-purple-500','from-pink-400 to-rose-500','from-amber-400 to-orange-500']
  const idx = (name?.charCodeAt(0) ?? 0) % colors.length
  return (
    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
      {name?.[0] ?? '?'}
    </div>
  )
}

function CustomerDrawer({ customer, onClose }) {
  if (!customer) return null
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 left-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">تفاصيل العميل</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
              {customer.name?.[0] ?? '?'}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{customer.name ?? '—'}</p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold mt-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> نشط
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { icon: Mail,     label: 'البريد الإلكتروني', value: customer.email ?? '—' },
              { icon: Phone,    label: 'الهاتف',            value: customer.phone ?? '—' },
              { icon: Calendar, label: 'تاريخ التسجيل',     value: formatDate(customer.created_at) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm shrink-0">
                  <Icon className="w-4 h-4 text-gray-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">{label}</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-blue-700">—</p>
              <p className="text-xs text-blue-500 mt-0.5">الطلبات</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-green-700">—</p>
              <p className="text-xs text-green-500 mt-0.5">إجمالي الإنفاق</p>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button onClick={() => { toast.error('تم إيقاف الحساب'); onClose() }}
            className="flex-1 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <Ban className="w-4 h-4" /> إيقاف
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 bg-[#16A34A] text-white hover:bg-green-700 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> تأكيد
          </button>
        </div>
      </div>
    </>
  )
}

export default function CustomersPage() {
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState(null)
  const [page, setPage]         = useState(0)
  const limit = 20

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['admin-customers', search, page],
    queryFn:  () => getCustomers({ search, limit, offset: page * limit }),
    keepPreviousData: true,
  })

  const summaryCards = [
    { icon: Users,       label: 'إجمالي العملاء',      value: customers.length, color: 'bg-blue-50 text-blue-600' },
    { icon: TrendingUp,  label: 'نشطون هذا الشهر',     value: '—',              color: 'bg-green-50 text-green-600' },
    { icon: UserPlus,    label: 'عملاء جدد (أسبوع)',   value: '—',              color: 'bg-violet-50 text-violet-600' },
    { icon: ShoppingBag, label: 'متوسط عدد الطلبات',   value: '—',              color: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء</h1>
          <p className="text-sm text-gray-500 mt-0.5">عرض وإدارة جميع عملاء المنصة</p>
        </div>
        <button className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Download className="w-4 h-4" /> تصدير CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 border-b border-gray-50">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0) }}
              placeholder="بحث بالاسم أو رقم الهاتف..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pr-9 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors shrink-0">
            <Filter className="w-4 h-4" /> فلترة
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 bg-gray-50/60">
                {['العميل', 'الهاتف', 'الحالة', 'تاريخ الانضمام', 'إجراءات'].map(h => (
                  <th key={h} className="text-right px-5 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[140, 100, 70, 90, 60].map((w, j) => (
                      <td key={j} className="px-5 py-4"><div className={`h-4 bg-gray-100 rounded`} style={{ width: w }} /></td>
                    ))}
                  </tr>
                ))
                : customers.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/70 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{c.name ?? '—'}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5 font-mono">#{c.id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 text-sm">{c.phone ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold ring-1 ring-green-200">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> نشط
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate(c.created_at)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelected(c)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
              {!isLoading && customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">لا يوجد عملاء مطابقون</p>
                    <p className="text-gray-300 text-xs mt-1">جرّب تغيير كلمة البحث</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50">
          <p className="text-xs text-gray-400">عرض <span className="font-semibold text-gray-600">{customers.length}</span> عميل</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              السابق
            </button>
            <span className="w-7 h-7 flex items-center justify-center bg-[#16A34A] text-white rounded-lg text-xs font-bold">{page + 1}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={customers.length < limit}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              التالي
            </button>
          </div>
        </div>
      </div>

      {selected && <CustomerDrawer customer={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
