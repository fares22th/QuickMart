import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Search, Minus, Plus, AlertTriangle, CheckCircle } from 'lucide-react'
import { getMyProducts, updateProductStock } from '@/api/seller.api'
import EmptyState from '@/components/common/EmptyState'

function StockEditor({ product }) {
  const qc      = useQueryClient()
  const [draft, setDraft] = useState(product.stock)
  const changed = draft !== product.stock

  const mut = useMutation({
    mutationFn: (stock) => updateProductStock(product.id, stock),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seller-products'] })
      qc.invalidateQueries({ queryKey: ['seller-stats'] })
      toast.success(`تم تحديث مخزون "${product.name}"`)
    },
    onError: () => toast.error('تعذّر تحديث المخزون'),
  })

  const isOutOfStock = draft === 0
  const isLowStock   = draft > 0 && draft <= 5

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setDraft(v => Math.max(0, v - 1))}
        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-red-300 hover:text-red-500 transition-colors"
      >
        <Minus className="w-3 h-3" />
      </button>

      <input
        type="number"
        min={0}
        value={draft}
        onChange={e => setDraft(Math.max(0, Number(e.target.value)))}
        className="w-16 text-center border border-gray-200 rounded-lg py-1 text-sm font-medium focus:border-primary focus:outline-none"
      />

      <button
        onClick={() => setDraft(v => v + 1)}
        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-green-300 hover:text-green-500 transition-colors"
      >
        <Plus className="w-3 h-3" />
      </button>

      {changed && (
        <button
          onClick={() => mut.mutate(draft)}
          disabled={mut.isPending}
          className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {mut.isPending ? '...' : 'حفظ'}
        </button>
      )}

      <span className={`text-xs font-medium ${
        isOutOfStock ? 'text-red-500' : isLowStock ? 'text-orange-500' : 'text-green-600'
      }`}>
        {isOutOfStock
          ? 'نفذ المخزون'
          : isLowStock
          ? `مخزون منخفض`
          : 'متاح'
        }
      </span>
    </div>
  )
}

function InventorySkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm divide-y">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
          <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-48" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
          <div className="h-8 bg-gray-100 rounded w-40" />
        </div>
      ))}
    </div>
  )
}

export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['seller-products', { search, limit: 100 }],
    queryFn:  () => getMyProducts({ search, limit: 100 }),
  })

  const all     = data?.products ?? []
  const products = filter === 'out'   ? all.filter(p => p.stock === 0)
                 : filter === 'low'   ? all.filter(p => p.stock > 0 && p.stock <= 5)
                 : filter === 'ok'    ? all.filter(p => p.stock > 5)
                 : all

  const outCount = all.filter(p => p.stock === 0).length
  const lowCount = all.filter(p => p.stock > 0 && p.stock <= 5).length

  return (
    <div className="space-y-5" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إدارة المخزون</h1>
        <p className="text-sm text-gray-400 mt-0.5">تحديث كميات المنتجات مباشرة</p>
      </div>

      {/* Alerts */}
      {(outCount > 0 || lowCount > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {outCount > 0 && (
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <div>
                <p className="font-semibold text-red-700">{outCount} منتج نفذ مخزونه</p>
                <p className="text-xs text-red-500">يحتاج إلى إعادة تخزين فوري</p>
              </div>
            </div>
          )}
          {lowCount > 0 && (
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
              <div>
                <p className="font-semibold text-orange-700">{lowCount} منتج مخزونه منخفض</p>
                <p className="text-xs text-orange-500">أقل من 5 وحدات متبقية</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters + search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث عن منتج..."
            className="w-full pr-9 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none bg-white"
          />
        </div>

        {[
          { key: 'all', label: 'الكل' },
          { key: 'out', label: `نفذ (${outCount})` },
          { key: 'low', label: `منخفض (${lowCount})` },
          { key: 'ok',  label: 'متاح' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
              filter === f.key
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <InventorySkeleton />
      ) : !products.length ? (
        <EmptyState icon={CheckCircle} title="لا توجد منتجات" message="لا يوجد شيء يطابق الفلتر المحدد" />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm" dir="rtl">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-3 text-right font-medium">المنتج</th>
                <th className="px-5 py-3 text-right font-medium">الفئة</th>
                <th className="px-5 py-3 text-right font-medium">السعر</th>
                <th className="px-5 py-3 text-right font-medium">تعديل المخزون</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${p.stock === 0 ? 'bg-red-50/30' : ''}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        {p.image
                          ? <img src={p.image} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                        }
                      </div>
                      <p className="font-medium text-gray-800 truncate max-w-[200px]">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{p.category}</td>
                  <td className="px-5 py-3 font-medium">{p.price} ر.س</td>
                  <td className="px-5 py-3">
                    <StockEditor product={p} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
