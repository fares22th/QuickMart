import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/customer/product/ProductCard'
import EmptyState from '@/components/common/EmptyState'

const SORT_OPTIONS = [
  { value: '',                    label: 'الأكثر صلة' },
  { value: 'price:asc',          label: 'السعر: من الأقل' },
  { value: 'price:desc',         label: 'السعر: من الأعلى' },
  { value: 'rating:desc',        label: 'الأعلى تقييماً' },
  { value: 'sales_count:desc',   label: 'الأكثر مبيعاً' },
  { value: 'created_at:desc',    label: 'الأحدث' },
]

const PRICE_RANGES = [
  { label: 'الكل',        min: null, max: null },
  { label: 'أقل من ٥٠',  min: 0,    max: 50 },
  { label: '٥٠ - ١٠٠',  min: 50,   max: 100 },
  { label: '١٠٠ - ٢٠٠', min: 100,  max: 200 },
  { label: 'أكثر من ٢٠٠', min: 200, max: null },
]

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex justify-between pt-2">
          <div className="h-5 bg-gray-100 rounded w-16" />
          <div className="w-9 h-9 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [sort, setSort]         = useState('')
  const [priceIdx, setPriceIdx] = useState(0)
  const [discount, setDiscount] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const priceRange = PRICE_RANGES[priceIdx]

  const { data, isLoading } = useProducts({
    search:       query,
    sort:         sort || undefined,
    min_price:    priceRange.min ?? undefined,
    max_price:    priceRange.max ?? undefined,
    has_discount: discount || undefined,
  })

  const products  = data?.products ?? []
  const total     = data?.total ?? 0
  const hasFilter = sort || priceIdx !== 0 || discount

  const clearFilters = () => { setSort(''); setPriceIdx(0); setDiscount(false) }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            نتائج: <span className="text-primary">"{query}"</span>
          </h2>
          {!isLoading && (
            <p className="text-sm text-gray-400 mt-0.5">
              {total > 0 ? `${total} نتيجة` : 'لا توجد نتائج'}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:border-primary"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
              showFilters || hasFilter
                ? 'bg-primary text-white border-primary'
                : 'bg-white border-gray-200 text-gray-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            فلترة
            {hasFilter && <span className="w-2 h-2 rounded-full bg-white/70" />}
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">خيارات التصفية</h3>
            {hasFilter && (
              <button onClick={clearFilters} className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors">
                <X className="w-3.5 h-3.5" />
                إزالة الكل
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Price range */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">نطاق السعر</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setPriceIdx(i)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                      priceIdx === i
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">خيارات إضافية</p>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={discount}
                  onChange={e => setDiscount(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: '#00C896' }}
                />
                <span className="text-sm text-gray-700">عروض وخصومات فقط</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {hasFilter && (
        <div className="flex flex-wrap gap-2 mb-4">
          {sort && (
            <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
              {SORT_OPTIONS.find(o => o.value === sort)?.label}
              <button onClick={() => setSort('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {priceIdx !== 0 && (
            <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
              {PRICE_RANGES[priceIdx].label}
              <button onClick={() => setPriceIdx(0)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {discount && (
            <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
              عروض فقط
              <button onClick={() => setDiscount(false)}><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>
      )}

      {/* Results grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="py-16">
          <EmptyState
            icon="🔍"
            title="لا توجد نتائج"
            message={query ? `لم يتم العثور على نتائج لـ "${query}"` : 'جرب كلمات بحث أخرى'}
          />
          {hasFilter && (
            <div className="text-center mt-4">
              <button
                onClick={clearFilters}
                className="text-primary font-semibold text-sm hover:underline"
              >
                إزالة الفلاتر والمحاولة مجدداً
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
