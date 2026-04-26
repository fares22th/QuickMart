import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Search, Filter, Download, Package, ChevronDown, Eye, X,
  Clock, CheckCircle, Truck, XCircle, RefreshCw, TrendingUp,
  DollarSign, ShoppingBag, AlertCircle,
} from 'lucide-react'
import { getAllOrders, adminUpdateOrderStatus } from '@/api/admin.api'
import { formatDate } from '@/utils/formatDate'
import { formatPrice } from '@/utils/formatPrice'

const STATUS_META = {
  pending:          { label: 'انتظار',       pill: 'bg-yellow-50 text-yellow-700 ring-yellow-200', dot: '#EAB308',  icon: Clock },
  confirmed:        { label: 'مؤكد',         pill: 'bg-blue-50 text-blue-700 ring-blue-200',       dot: '#3B82F6',  icon: CheckCircle },
  preparing:        { label: 'تحضير',        pill: 'bg-indigo-50 text-indigo-700 ring-indigo-200', dot: '#6366F1',  icon: Package },
  out_for_delivery: { label: 'في الطريق',    pill: 'bg-purple-50 text-purple-700 ring-purple-200', dot: '#A855F7',  icon: Truck },
  delivered:        { label: 'مُسلَّم',      pill: 'bg-green-50 text-green-700 ring-green-200',    dot: '#22C55E',  icon: CheckCircle },
  cancelled:        { label: 'ملغي',         pill: 'bg-red-50 text-red-700 ring-red-200',          dot: '#EF4444',  icon: XCircle },
  refunded:         { label: 'مُسترجع',      pill: 'bg-gray-100 text-gray-600 ring-gray-200',      dot: '#6B7280',  icon: RefreshCw },
}

const ALL_STATUSES = Object.entries(STATUS_META).map(([value, m]) => ({ value, ...m }))

const PAYMENT_AR = { cash: 'كاش', card: 'بطاقة', wallet: 'محفظة' }

function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${m.pill}`}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.dot }} />
      {m.label}
    </span>
  )
}

function OrderDetailDrawer({ order, onClose }) {
  if (!order) return null
  const items = order.order_items ?? []
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 left-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">تفاصيل الطلب</h3>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">#{order.id.slice(-10).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase">الحالة الحالية</p>
              <div className="mt-1"><StatusBadge status={order.status} /></div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-semibold uppercase">المبلغ الإجمالي</p>
              <p className="text-xl font-black text-gray-900 mt-1">{formatPrice(order.total)}</p>
            </div>
          </div>

          {/* Customer + Store */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-[10px] text-blue-500 font-bold uppercase mb-1">العميل</p>
              <p className="text-sm font-semibold text-gray-800">{order.customer_profiles?.name ?? '—'}</p>
              <p className="text-xs text-gray-500">{order.customer_profiles?.phone ?? '—'}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <p className="text-[10px] text-amber-600 font-bold uppercase mb-1">المتجر</p>
              <p className="text-sm font-semibold text-gray-800">{order.seller_stores?.name ?? '—'}</p>
            </div>
          </div>

          {/* Items */}
          {items.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">منتجات الطلب</p>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl shrink-0 overflow-hidden">
                      {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-800 shrink-0">{formatPrice(item.subtotal)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial breakdown */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <div className="p-4 space-y-2">
              {[
                { label: 'طريقة الدفع',  value: PAYMENT_AR[order.payment_method] ?? order.payment_method },
                { label: 'تكلفة التوصيل', value: formatPrice(order.delivery_fee ?? 0) },
                { label: 'التاريخ',       value: formatDate(order.created_at) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
              <span className="font-bold text-gray-700">الإجمالي</span>
              <span className="font-black text-gray-900 text-lg">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function StatusDropdown({ orderId, current, onUpdate }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg transition-colors">
        تحديث <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 overflow-hidden">
            {ALL_STATUSES.map(s => (
              <button key={s.value} onClick={() => { onUpdate(orderId, s.value); setOpen(false) }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${current === s.value ? 'font-bold text-green-700' : 'text-gray-700'}`}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.dot }} />
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const TAB_STATUSES = [
  { value: '', label: 'الكل' },
  { value: 'pending', label: 'انتظار' },
  { value: 'confirmed', label: 'مؤكد' },
  { value: 'preparing', label: 'تحضير' },
  { value: 'out_for_delivery', label: 'في الطريق' },
  { value: 'delivered', label: 'مُسلَّم' },
  { value: 'cancelled', label: 'ملغي' },
]

export default function AllOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch]             = useState('')
  const [selected, setSelected]         = useState(null)
  const [page, setPage]                 = useState(0)
  const limit = 20
  const qc = useQueryClient()

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter, page],
    queryFn: () => getAllOrders({ status: statusFilter || undefined, limit, offset: page * limit }),
    keepPreviousData: true,
  })

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) => adminUpdateOrderStatus(id, status),
    onSuccess: () => { toast.success('تم تحديث حالة الطلب'); qc.invalidateQueries({ queryKey: ['admin-orders'] }) },
    onError:   () => toast.error('فشل تحديث الحالة'),
  })

  const filtered = orders.filter(o =>
    !search ||
    o.customer_profiles?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.seller_stores?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.id.includes(search)
  )

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + Number(o.total ?? 0), 0)

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
          <p className="text-sm text-gray-500 mt-0.5">تتبع وإدارة جميع طلبات المنصة</p>
        </div>
        <button className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Download className="w-4 h-4" /> تصدير
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الطلبات',   value: orders.length, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
          { label: 'طلبات نشطة',       value: orders.filter(o => ['pending','confirmed','preparing','out_for_delivery'].includes(o.status)).length, icon: Clock, color: 'bg-amber-50 text-amber-600' },
          { label: 'مُسلَّمة',         value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
          { label: 'إيرادات هذه الصفحة', value: formatPrice(totalRevenue), icon: DollarSign, color: 'bg-violet-50 text-violet-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-gray-900 truncate">{s.value}</p>
              <p className="text-xs text-gray-500 truncate">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">

        {/* Filters */}
        <div className="p-4 border-b border-gray-50 space-y-3">
          {/* Status tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {TAB_STATUSES.map(t => (
              <button key={t.value} onClick={() => { setStatusFilter(t.value); setPage(0) }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all shrink-0 ${statusFilter === t.value ? 'bg-[#16A34A] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t.label}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو رقم الطلب..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pr-9 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 bg-gray-50/60">
                {['# الطلب', 'العميل', 'المتجر', 'المبلغ', 'الدفع', 'الحالة', 'التاريخ', 'إجراءات'].map(h => (
                  <th key={h} className="text-right px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded w-full" /></td>
                    ))}
                  </tr>
                ))
                : filtered.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50/70 transition-colors group">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                        #{o.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {(o.customer_profiles?.name ?? 'ع')[0]}
                        </div>
                        <span className="text-xs font-medium text-gray-800 truncate max-w-[100px]">
                          {o.customer_profiles?.name ?? '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600 max-w-[100px] truncate">{o.seller_stores?.name ?? '—'}</td>
                    <td className="px-4 py-3.5 text-xs font-bold text-gray-900 whitespace-nowrap">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                        {PAYMENT_AR[o.payment_method] ?? o.payment_method}
                      </span>
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap">{formatDate(o.created_at)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(o)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <StatusDropdown
                          orderId={o.id}
                          current={o.status}
                          onUpdate={(id, status) => updateStatus({ id, status })}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              }
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">لا توجد طلبات مطابقة</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50">
          <p className="text-xs text-gray-400">عرض <span className="font-semibold text-gray-600">{filtered.length}</span> طلب</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">السابق</button>
            <span className="w-7 h-7 flex items-center justify-center bg-[#16A34A] text-white rounded-lg text-xs font-bold">{page + 1}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={orders.length < limit}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">التالي</button>
          </div>
        </div>
      </div>

      {selected && <OrderDetailDrawer order={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
