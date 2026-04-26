import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Search, ChevronDown, X, Package, Phone, MapPin, Clock,
  CheckCircle, XCircle, Printer, MoreVertical, User, CreditCard,
  ChevronRight, AlertCircle,
} from 'lucide-react'
import { getMyStore } from '@/api/stores.api'
import { getSellerOrders, updateSellerOrderStatus } from '@/api/seller.api'
import { formatPrice } from '@/utils/formatPrice'
import { formatDate } from '@/utils/formatDate'

const STATUSES = [
  { value: 'all',              label: 'الكل',          dot: 'bg-gray-400' },
  { value: 'pending',          label: 'معلق',           dot: 'bg-amber-500' },
  { value: 'confirmed',        label: 'مؤكد',           dot: 'bg-blue-500' },
  { value: 'preparing',        label: 'قيد التجهيز',   dot: 'bg-violet-500' },
  { value: 'out_for_delivery', label: 'في الطريق',     dot: 'bg-cyan-500' },
  { value: 'delivered',        label: 'مُسلَّم',       dot: 'bg-green-500' },
  { value: 'cancelled',        label: 'ملغي',           dot: 'bg-red-500' },
]

const STATUS_META = {
  pending:          { label: 'معلق',          color: 'bg-amber-50 text-amber-700 ring-amber-200',   dot: 'bg-amber-500',  next: 'confirmed' },
  confirmed:        { label: 'مؤكد',          color: 'bg-blue-50 text-blue-700 ring-blue-200',      dot: 'bg-blue-500',   next: 'preparing' },
  preparing:        { label: 'قيد التجهيز',  color: 'bg-violet-50 text-violet-700 ring-violet-200', dot: 'bg-violet-500', next: 'out_for_delivery' },
  out_for_delivery: { label: 'في الطريق',    color: 'bg-cyan-50 text-cyan-700 ring-cyan-200',       dot: 'bg-cyan-500',   next: 'delivered' },
  delivered:        { label: 'مُسلَّم',      color: 'bg-green-50 text-green-700 ring-green-200',    dot: 'bg-green-500',  next: null },
  cancelled:        { label: 'ملغي',          color: 'bg-red-50 text-red-700 ring-red-200',          dot: 'bg-red-500',    next: null },
  refunded:         { label: 'مُسترجع',      color: 'bg-gray-100 text-gray-500 ring-gray-200',      dot: 'bg-gray-400',   next: null },
}

const STATUS_ACTIONS = {
  pending:          [{ label: 'قبول الطلب', value: 'confirmed', style: 'bg-green-600 hover:bg-green-700 text-white' }, { label: 'رفض',       value: 'cancelled', style: 'bg-red-50 text-red-600 hover:bg-red-100' }],
  confirmed:        [{ label: 'بدء التجهيز', value: 'preparing', style: 'bg-[#16A34A] hover:bg-green-700 text-white' }],
  preparing:        [{ label: 'جاهز للتوصيل', value: 'out_for_delivery', style: 'bg-[#16A34A] hover:bg-green-700 text-white' }],
  out_for_delivery: [{ label: 'تم التوصيل', value: 'delivered', style: 'bg-[#16A34A] hover:bg-green-700 text-white' }],
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${m.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  )
}

function StatusDropdown({ order, onUpdate }) {
  const [open, setOpen] = useState(false)
  const actions = STATUS_ACTIONS[order.status] ?? []
  if (!actions.length) return <StatusBadge status={order.status} />
  return (
    <div className="relative">
      <button onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
        className="flex items-center gap-1.5">
        <StatusBadge status={order.status} />
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-8 right-0 z-20 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[140px]">
            {actions.map(a => (
              <button key={a.value} onClick={() => { onUpdate(order.id, a.value); setOpen(false) }}
                className="w-full text-right px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                {a.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function OrderDrawer({ order, onClose, onUpdate }) {
  if (!order) return null
  const customer = order.customer_profiles
  const items    = order.order_items ?? []
  const m        = STATUS_META[order.status] ?? STATUS_META.pending
  const actions  = STATUS_ACTIONS[order.status] ?? []

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 left-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">تفاصيل الطلب</h3>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">#{order.id?.slice(-8).toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Status */}
          <div className={`p-3 rounded-2xl flex items-center gap-3 ${m.color.includes('green') ? 'bg-green-50' : m.color.includes('amber') ? 'bg-amber-50' : 'bg-gray-50'}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${m.dot}`} />
            <p className="text-sm font-semibold text-gray-800">{m.label}</p>
            <p className="text-xs text-gray-400 mr-auto">{formatDate(order.created_at)}</p>
          </div>

          {/* Customer */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-400 mb-3 uppercase">معلومات العميل</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {customer?.name?.[0] ?? '?'}
                </div>
                <p className="font-semibold text-gray-800 text-sm">{customer?.name ?? '—'}</p>
              </div>
              {customer?.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> {customer.phone}
                </div>
              )}
              {order.address && (
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                  <span>{typeof order.address === 'object' ? order.address.street : order.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-3 uppercase">المنتجات ({items.length})</p>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{item.name}</p>
                      <p className="text-[10px] text-gray-400">{item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-gray-700">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gradient-to-br from-[#0F172A] to-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-white/60">
              <span>المجموع الفرعي</span>
              <span>{formatPrice(order.subtotal ?? 0)}</span>
            </div>
            <div className="flex justify-between text-sm text-white/60">
              <span>رسوم التوصيل</span>
              <span>{formatPrice(order.delivery_fee ?? 0)}</span>
            </div>
            {(order.discount ?? 0) > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>الخصم</span>
                <span>- {formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white">
              <span>الإجمالي</span>
              <span>{formatPrice(order.total ?? 0)}</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <CreditCard className="w-3.5 h-3.5 text-white/40" />
              <span className="text-xs text-white/40">{order.payment_method === 'cash' ? 'دفع عند الاستلام' : 'بطاقة إلكترونية'}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="p-5 border-t border-gray-100 flex gap-2">
            {actions.map(a => (
              <button key={a.value} onClick={() => { onUpdate(order.id, a.value); onClose() }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${a.style}`}>
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default function SellerOrdersPage() {
  const [tab,      setTab]      = useState('all')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState(null)
  const [page,     setPage]     = useState(0)
  const limit = 20
  const qc = useQueryClient()

  const { data: store } = useQuery({ queryKey: ['my-store'], queryFn: getMyStore, retry: false })

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['seller-orders', store?.id, tab, page],
    queryFn:  () => getSellerOrders({ storeId: store.id, status: tab === 'all' ? undefined : tab, limit, offset: page * limit }),
    enabled:  !!store?.id,
    keepPreviousData: true,
  })

  const { mutate: changeStatus } = useMutation({
    mutationFn: ({ id, status }) => updateSellerOrderStatus(id, status),
    onSuccess: (_, { status }) => {
      const m = STATUS_META[status]
      toast.success(m ? `تم تحديث الطلب: ${m.label}` : 'تم تحديث الحالة')
      qc.invalidateQueries({ queryKey: ['seller-orders'] })
    },
    onError: () => toast.error('فشل تحديث حالة الطلب'),
  })

  const pending  = orders.filter(o => o.status === 'pending').length
  const active   = orders.filter(o => ['confirmed', 'preparing', 'out_for_delivery'].includes(o.status)).length
  const done     = orders.filter(o => o.status === 'delivered').length
  const revenue  = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + Number(o.total), 0)

  const filtered = search
    ? orders.filter(o =>
        o.id?.includes(search) ||
        o.customer_profiles?.name?.includes(search) ||
        o.customer_profiles?.phone?.includes(search))
    : orders

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
          <p className="text-sm text-gray-500 mt-0.5">تابع وأدر جميع طلبات متجرك</p>
        </div>
        {pending > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-semibold ring-1 ring-amber-200 animate-pulse">
            <AlertCircle className="w-4 h-4" />
            {pending} طلبات تنتظر قبولك
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'طلبات معلقة',    value: pending, color: pending > 0 ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-500' },
          { label: 'طلبات نشطة',     value: active,  color: 'bg-blue-50 text-blue-700' },
          { label: 'تم التسليم',     value: done,    color: 'bg-green-50 text-green-700' },
          { label: 'إيرادات مكتملة', value: formatPrice(revenue), color: 'bg-slate-50 text-slate-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border border-gray-100 shadow-sm p-4 text-center ${s.color}`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-1 opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-50">
          <div className="flex items-center gap-0.5 bg-gray-100 p-1 rounded-xl overflow-x-auto">
            {STATUSES.map(s => (
              <button key={s.value} onClick={() => { setTab(s.value); setPage(0) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${tab === s.value ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {s.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث برقم الطلب أو اسم العميل..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pr-9 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 bg-gray-50/60">
                {['رقم الطلب', 'العميل', 'الطلبات', 'الإجمالي', 'الدفع', 'الوقت', 'الحالة', 'إجراء'].map(h => (
                  <th key={h} className="text-right px-5 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[80, 120, 60, 80, 70, 80, 90, 60].map((w, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded" style={{ width: w }} /></td>
                    ))}
                  </tr>
                ))
                : filtered.map(order => (
                  <tr key={order.id} onClick={() => setSelected(order)}
                    className="hover:bg-gray-50/70 transition-colors cursor-pointer group">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-gray-600">
                      #{order.id?.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {order.customer_profiles?.name?.[0] ?? '?'}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">{order.customer_profiles?.name ?? '—'}</p>
                          <p className="text-[10px] text-gray-400">{order.customer_profiles?.phone ?? ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">{order.order_items?.length ?? 0} منتج</td>
                    <td className="px-5 py-3.5 font-bold text-gray-800">{formatPrice(order.total ?? 0)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${order.payment_method === 'cash' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                        {order.payment_method === 'cash' ? 'كاش' : 'بطاقة'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        {new Date(order.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                      <StatusDropdown order={order} onUpdate={(id, s) => changeStatus({ id, status: s })} />
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </button>
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

        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50">
          <p className="text-xs text-gray-400">عرض <span className="font-semibold text-gray-600">{filtered.length}</span> طلب</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              السابق
            </button>
            <span className="w-7 h-7 flex items-center justify-center bg-[#16A34A] text-white rounded-lg text-xs font-bold">{page + 1}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={orders.length < limit}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              التالي
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <OrderDrawer
          order={selected}
          onClose={() => setSelected(null)}
          onUpdate={(id, s) => { changeStatus({ id, status: s }); setSelected(o => o ? { ...o, status: s } : null) }}
        />
      )}
    </div>
  )
}
