import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Search, CheckCircle, XCircle, PauseCircle, PlayCircle, Store, Star, MapPin, Tag, Clock, ExternalLink, Filter, Download, BarChart3 } from 'lucide-react'
import { getAllStores, setStoreStatus } from '@/api/admin.api'

const STATUS_META = {
  active:    { label: 'نشط',      color: 'bg-green-50 text-green-700 ring-green-200',  dot: 'bg-green-500' },
  pending:   { label: 'معلق',     color: 'bg-yellow-50 text-yellow-700 ring-yellow-200', dot: 'bg-yellow-500' },
  suspended: { label: 'موقوف',    color: 'bg-red-50 text-red-700 ring-red-200',        dot: 'bg-red-500' },
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

function StoreCard({ store, onAction }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Cover */}
      <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-900 relative">
        {store.cover_url && <img src={store.cover_url} alt="" className="w-full h-full object-cover" />}
        <div className="absolute top-3 right-3">
          <StatusBadge status={store.status} />
        </div>
        {store.is_featured && (
          <div className="absolute top-3 left-3 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            مميز
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Logo + Name */}
        <div className="flex items-start gap-3 -mt-8 mb-3">
          <div className="w-12 h-12 rounded-xl bg-white border-2 border-white shadow-md flex items-center justify-center shrink-0">
            {store.logo_url
              ? <img src={store.logo_url} alt="" className="w-full h-full rounded-xl object-cover" />
              : <Store className="w-6 h-6 text-gray-400" />
            }
          </div>
          <div className="pt-5 min-w-0">
            <p className="font-bold text-gray-900 truncate">{store.name}</p>
            <p className="text-xs text-gray-500 truncate">{store.seller_profiles?.name ?? '—'}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="space-y-1.5 mb-4">
          {store.category && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Tag className="w-3.5 h-3.5 text-gray-400" /> {store.category}
            </div>
          )}
          {store.city && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> {store.city}
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-gray-700">{Number(store.rating ?? 0).toFixed(1)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {store.status === 'pending' && (
            <>
              <button onClick={() => onAction(store.id, 'active')}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> موافقة
              </button>
              <button onClick={() => onAction(store.id, 'suspended')}
                className="flex-1 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" /> رفض
              </button>
            </>
          )}
          {store.status === 'active' && (
            <button onClick={() => onAction(store.id, 'suspended')}
              className="flex-1 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
              <PauseCircle className="w-3.5 h-3.5" /> إيقاف
            </button>
          )}
          {store.status === 'suspended' && (
            <button onClick={() => onAction(store.id, 'active')}
              className="flex-1 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
              <PlayCircle className="w-3.5 h-3.5" /> تفعيل
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { value: '',          label: 'الكل' },
  { value: 'pending',   label: 'معلق' },
  { value: 'active',    label: 'نشط' },
  { value: 'suspended', label: 'موقوف' },
]

export default function SellersPage() {
  const [status, setStatus]   = useState('')
  const [search, setSearch]   = useState('')
  const [view,   setView]     = useState('grid')
  const qc = useQueryClient()

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ['admin-stores', status, search],
    queryFn:  () => getAllStores({ status: status || undefined, search, limit: 50 }),
  })

  const { mutate: changeStatus } = useMutation({
    mutationFn: ({ id, s }) => setStoreStatus(id, s),
    onSuccess: (_, { s }) => {
      toast.success(s === 'active' ? 'تمت الموافقة على المتجر' : s === 'suspended' ? 'تم إيقاف المتجر' : 'تم تحديث الحالة')
      qc.invalidateQueries({ queryKey: ['admin-stores'] })
    },
    onError: () => toast.error('فشل تحديث حالة المتجر'),
  })

  const pending  = stores.filter(s => s.status === 'pending').length
  const active   = stores.filter(s => s.status === 'active').length
  const suspended = stores.filter(s => s.status === 'suspended').length

  const filtered = stores.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة البائعين</h1>
          <p className="text-sm text-gray-500 mt-0.5">مراجعة وإدارة متاجر المنصة</p>
        </div>
        <button className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Download className="w-4 h-4" /> تصدير
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'إجمالي المتاجر',  value: stores.length, color: 'bg-slate-50 text-slate-600' },
          { label: 'نشطة',            value: active,         color: 'bg-green-50 text-green-700' },
          { label: 'تنتظر الموافقة',  value: pending,        color: pending > 0 ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-500' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border border-gray-100 shadow-sm p-4 text-center ${s.color}`}>
            <p className="text-3xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-1 opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {TABS.map(t => (
              <button key={t.value} onClick={() => setStatus(t.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${status === t.value ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {t.label}
                {t.value === 'pending' && pending > 0 && (
                  <span className="mr-1 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{pending}</span>
                )}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="بحث باسم المتجر..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pr-9 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
              <div className="h-24 bg-gray-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-8 bg-gray-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(store => (
            <StoreCard key={store.id} store={store} onAction={(id, s) => changeStatus({ id, s })} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
          <Store className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">لا توجد متاجر مطابقة</p>
          <p className="text-gray-400 text-sm mt-1">جرّب تغيير الفلتر أو كلمة البحث</p>
        </div>
      )}
    </div>
  )
}
