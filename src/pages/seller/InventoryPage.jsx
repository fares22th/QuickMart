import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Warehouse, AlertTriangle, TrendingUp, TrendingDown, Package, ArrowUpRight, Search, RefreshCw } from 'lucide-react'
import { getMyStore } from '@/api/stores.api'
import { getSellerProducts } from '@/api/seller.api'
import { formatPrice } from '@/utils/formatPrice'

const MOCK_MOVEMENTS = [
  { day: 'السبت',   in: 24, out: 18 },
  { day: 'الأحد',   in: 18, out: 22 },
  { day: 'الاثنين', in: 32, out: 28 },
  { day: 'الثلاثاء',in: 15, out: 20 },
  { day: 'الأربعاء',in: 28, out: 24 },
  { day: 'الخميس', in: 36, out: 30 },
  { day: 'الجمعة', in: 42, out: 38 },
]

function StockLevel({ qty, max = 100 }) {
  if (qty === null || qty === undefined) return <span className="text-xs text-gray-400">غير محدد</span>
  const pct   = Math.min((qty / max) * 100, 100)
  const color = qty <= 0 ? 'bg-red-500' : qty <= 10 ? 'bg-amber-500' : qty <= 30 ? 'bg-yellow-400' : 'bg-green-500'
  const label = qty <= 0 ? 'نفد' : qty <= 10 ? 'منخفض' : qty <= 30 ? 'متوسط' : 'كافٍ'
  const labelColor = qty <= 0 ? 'text-red-600' : qty <= 10 ? 'text-amber-600' : qty <= 30 ? 'text-yellow-600' : 'text-green-600'

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-2 min-w-[60px]">
        <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-xs font-bold text-gray-700">{qty}</span>
        <span className={`text-[10px] font-semibold ${labelColor}`}>({label})</span>
      </div>
    </div>
  )
}

export default function InventoryPage() {
  const [search, setSearch] = useState('')

  const { data: store } = useQuery({ queryKey: ['my-store'], queryFn: getMyStore, retry: false })

  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['seller-inventory', store?.id],
    queryFn:  () => getSellerProducts({ storeId: store.id, limit: 100 }),
    enabled:  !!store?.id,
  })

  const filtered = search ? products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())) : products

  const outOfStock  = products.filter(p => p.stock_quantity !== null && p.stock_quantity <= 0)
  const lowStock    = products.filter(p => p.stock_quantity !== null && p.stock_quantity > 0 && p.stock_quantity <= 10)
  const healthyStock = products.filter(p => p.stock_quantity === null || p.stock_quantity > 10)
  const totalValue  = products.reduce((s, p) => s + ((p.price || 0) * (p.stock_quantity || 0)), 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المخزون</h1>
          <p className="text-sm text-gray-500 mt-0.5">تتبع مستويات المخزون والتحركات</p>
        </div>
        <button onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" /> تحديث
        </button>
      </div>

      {/* Critical Alert */}
      {(outOfStock.length > 0 || lowStock.length > 0) && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="font-bold text-amber-800 text-sm">تنبيه المخزون</p>
            <p className="text-amber-600 text-xs mt-0.5">
              {outOfStock.length > 0 && `${outOfStock.length} منتجات نفد مخزونها. `}
              {lowStock.length > 0 && `${lowStock.length} منتجات وصلت للحد الأدنى.`}
              {' '}يُنصح بإعادة تموين هذه المنتجات في أقرب وقت.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المنتجات',    value: products.length,      color: 'bg-slate-50 text-slate-700',   icon: Package },
          { label: 'مخزون صحي',          value: healthyStock.length,  color: 'bg-green-50 text-green-700',   icon: TrendingUp },
          { label: 'مخزون منخفض',        value: lowStock.length,      color: lowStock.length > 0 ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-400', icon: TrendingDown },
          { label: 'نفد المخزون',         value: outOfStock.length,    color: outOfStock.length > 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-400', icon: AlertTriangle },
        ].map(s => (
          <div key={s.label} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory Movement Chart + Total Value */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-900 mb-1">حركة المخزون</p>
          <p className="text-xs text-gray-400 mb-4">الوارد والصادر خلال آخر ٧ أيام</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MOCK_MOVEMENTS} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(v, n) => [v, n === 'in' ? 'وارد' : 'صادر']}
                contentStyle={{ borderRadius: 12, border: '1px solid #F3F4F6', fontSize: 12 }}
              />
              <Bar dataKey="in"  name="وارد"  fill="#16A34A" radius={[4,4,0,0]} />
              <Bar dataKey="out" name="صادر"  fill="#6366F1" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-[#0F172A] to-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-1">قيمة المخزون</p>
            <p className="text-3xl font-black text-white">{formatPrice(totalValue)}</p>
            <p className="text-white/40 text-xs mt-1">إجمالي قيمة البضاعة المتوفرة</p>
          </div>
          <div className="space-y-2 mt-4">
            {[
              { label: 'المنتجات المتاحة', value: products.filter(p => p.is_available).length, color: 'text-green-400' },
              { label: 'غير متاحة',        value: products.filter(p => !p.is_available).length, color: 'text-red-400' },
            ].map(r => (
              <div key={r.label} className="flex justify-between text-xs">
                <span className="text-white/40">{r.label}</span>
                <span className={`font-bold ${r.color}`}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 p-4 border-b border-gray-50">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث في المنتجات..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pr-9 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 bg-gray-50/60">
                {['المنتج', 'السعر', 'المخزون', 'مستوى المخزون', 'الحالة', 'إجراء'].map(h => (
                  <th key={h} className="text-right px-5 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[160, 70, 60, 140, 80, 60].map((w, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded" style={{ width: w }} /></td>
                    ))}
                  </tr>
                ))
                : filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                          {p.images?.[0]
                            ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-gray-300" /></div>}
                        </div>
                        <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-700">{formatPrice(p.price)}</td>
                    <td className="px-5 py-3.5 font-bold text-gray-800">{p.stock_quantity ?? '∞'}</td>
                    <td className="px-5 py-3.5 min-w-[180px]">
                      <StockLevel qty={p.stock_quantity} max={100} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ring-1
                        ${p.is_available ? 'bg-green-50 text-green-700 ring-green-200' : 'bg-gray-100 text-gray-500 ring-gray-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.is_available ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {p.is_available ? 'متاح' : 'مخفي'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                        تحديث
                      </button>
                    </td>
                  </tr>
                ))
              }
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Warehouse className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">لا توجد منتجات</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
