import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Search, Plus, Package, MoreVertical, Edit, Trash2, Copy,
  Download, Upload, Filter, Star, ToggleLeft, ToggleRight,
  Image, Tag, ChevronDown, X,
} from 'lucide-react'
import { getMyStore } from '@/api/stores.api'
import { getSellerProducts, toggleProductAvailability } from '@/api/seller.api'
import { deleteProduct } from '@/api/products.api'
import { formatPrice } from '@/utils/formatPrice'

function ProductImage({ src, name }) {
  if (src) return <img src={src} alt={name} className="w-full h-full object-cover" />
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <Image className="w-5 h-5 text-gray-300" />
    </div>
  )
}

function AvailabilityToggle({ available, onToggle, loading }) {
  return (
    <button onClick={e => { e.stopPropagation(); onToggle() }} disabled={loading}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 disabled:opacity-50 ${available ? 'bg-[#16A34A]' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${available ? 'translate-x-[22px] right-0.5' : 'right-0.5'}`} />
    </button>
  )
}

function ActionMenu({ product, onDelete }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-8 z-20 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[140px]">
            <Link to={`/seller/products/${product.id}/edit`} onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors">
              <Edit className="w-3.5 h-3.5 text-gray-400" /> تعديل
            </Link>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors text-right">
              <Copy className="w-3.5 h-3.5 text-gray-400" /> تكرار
            </button>
            <div className="border-t border-gray-50 mt-1">
              <button onClick={() => { onDelete(product.id); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors text-right">
                <Trash2 className="w-3.5 h-3.5" /> حذف
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function StockBadge({ stock }) {
  if (stock === null || stock === undefined) return <span className="text-xs text-gray-400">—</span>
  if (stock <= 0)  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 ring-1 ring-red-200">نفد</span>
  if (stock <= 10) return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 ring-1 ring-amber-200">{stock} قطعة</span>
  return <span className="text-xs font-semibold text-gray-700">{stock}</span>
}

const FILTER_OPTS = [
  { v: '',         l: 'الكل' },
  { v: 'active',   l: 'متاح' },
  { v: 'inactive', l: 'غير متاح' },
]

export default function SellerProductsPage() {
  const [search,     setSearch]     = useState('')
  const [avail,      setAvail]      = useState('')
  const [selected,   setSelected]   = useState(new Set())
  const [toggleLoading, setToggleLoading] = useState(null)
  const qc = useQueryClient()

  const { data: store } = useQuery({ queryKey: ['my-store'], queryFn: getMyStore, retry: false })

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['seller-products', store?.id, search, avail],
    queryFn:  () => getSellerProducts({ storeId: store.id, search, availability: avail || undefined }),
    enabled:  !!store?.id,
  })

  const { mutate: removeProduct } = useMutation({
    mutationFn: deleteProduct,
    onSuccess:  () => { toast.success('تم حذف المنتج'); qc.invalidateQueries({ queryKey: ['seller-products'] }) },
    onError:    () => toast.error('فشل حذف المنتج'),
  })

  const handleToggle = async (product) => {
    setToggleLoading(product.id)
    try {
      await toggleProductAvailability(product.id, !product.is_available)
      qc.invalidateQueries({ queryKey: ['seller-products'] })
      toast.success(product.is_available ? 'تم إخفاء المنتج' : 'تم تفعيل المنتج')
    } catch {
      toast.error('فشل تحديث المنتج')
    } finally {
      setToggleLoading(null)
    }
  }

  const toggleSelect = id => setSelected(s => {
    const next = new Set(s)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  const selectAll = () => setSelected(s => s.size === products.length ? new Set() : new Set(products.map(p => p.id)))

  const inStock   = products.filter(p => (p.stock_quantity ?? 1) > 0).length
  const lowStock  = products.filter(p => p.stock_quantity !== null && p.stock_quantity > 0 && p.stock_quantity <= 10).length
  const outStock  = products.filter(p => p.stock_quantity !== null && p.stock_quantity <= 0).length
  const activeP   = products.filter(p => p.is_available).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h1>
          <p className="text-sm text-gray-500 mt-0.5">أضف، عدّل وأدر كتالوج متجرك</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> تصدير
          </button>
          <button className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" /> استيراد
          </button>
          <Link to="/seller/products/add"
            className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> منتج جديد
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المنتجات', value: products.length, color: 'bg-slate-50 text-slate-700' },
          { label: 'متاح للبيع',      value: activeP,          color: 'bg-green-50 text-green-700' },
          { label: 'مخزون منخفض',    value: lowStock,          color: lowStock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-400' },
          { label: 'نفد المخزون',     value: outStock,          color: outStock > 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-400' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border border-gray-100 shadow-sm p-4 text-center ${s.color}`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-1 opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="bg-[#0F172A] rounded-2xl p-3 flex items-center justify-between">
          <p className="text-white text-sm font-semibold">تم تحديد {selected.size} منتج</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors">
              تفعيل الكل
            </button>
            <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors">
              إيقاف الكل
            </button>
            <button onClick={() => setSelected(new Set())} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl text-xs font-semibold transition-colors">
              حذف المحدد
            </button>
            <button onClick={() => setSelected(new Set())} className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-50">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث باسم المنتج..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pr-9 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {FILTER_OPTS.map(f => (
              <button key={f.v} onClick={() => setAvail(f.v)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${avail === f.v ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {f.l}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 bg-gray-50/60">
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={selected.size === products.length && products.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 rounded accent-green-600 cursor-pointer" />
                </th>
                {['المنتج', 'التصنيف', 'السعر', 'المخزون', 'المبيعات', 'التقييم', 'متاح', 'إجراءات'].map(h => (
                  <th key={h} className="text-right px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[20, 200, 80, 70, 70, 60, 60, 50, 60].map((w, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded" style={{ width: w }} /></td>
                    ))}
                  </tr>
                ))
                : products.map(p => (
                  <tr key={p.id} className={`hover:bg-gray-50/70 transition-colors group ${selected.has(p.id) ? 'bg-green-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)}
                        className="w-4 h-4 rounded accent-green-600 cursor-pointer" onClick={e => e.stopPropagation()} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          <ProductImage src={p.images?.[0]} name={p.name} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate max-w-[160px]">{p.name}</p>
                          {p.sku && <p className="text-[10px] text-gray-400 font-mono">SKU: {p.sku}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.categories?.name ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-semibold">
                          <Tag className="w-2.5 h-2.5" /> {p.categories.name}
                        </span>
                      ) : <span className="text-xs text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-bold text-gray-900">{formatPrice(p.price)}</p>
                        {p.original_price && p.original_price > p.price && (
                          <p className="text-[10px] text-gray-400 line-through">{formatPrice(p.original_price)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3"><StockBadge stock={p.stock_quantity} /></td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-600">{p.sales_count ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-gray-600">{Number(p.rating ?? 0).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <AvailabilityToggle
                        available={p.is_available}
                        loading={toggleLoading === p.id}
                        onToggle={() => handleToggle(p)}
                      />
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <Link to={`/seller/products/${p.id}/edit`}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <ActionMenu product={p} onDelete={id => removeProduct(id)} />
                      </div>
                    </td>
                  </tr>
                ))
              }
              {!isLoading && products.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">لا توجد منتجات</p>
                    <Link to="/seller/products/add"
                      className="inline-flex items-center gap-2 mt-3 bg-[#16A34A] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
                      <Plus className="w-3.5 h-3.5" /> أضف منتجك الأول
                    </Link>
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
