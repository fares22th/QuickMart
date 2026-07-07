import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/customer/product/ProductCard'
import Pagination from '@/components/common/Pagination'
import EmptyState from '@/components/common/EmptyState'

const SORT_OPTIONS = [
  { value: '',                  label: 'الأكثر صلة' },
  { value: 'price:asc',        label: 'السعر: من الأقل' },
  { value: 'price:desc',       label: 'السعر: من الأعلى' },
  { value: 'rating:desc',      label: 'الأعلى تقييماً' },
  { value: 'sales_count:desc', label: 'الأكثر مبيعاً' },
  { value: 'created_at:desc',  label: 'الأحدث' },
]

const CATEGORY_META = {
  fruits:      { name: 'الفواكه',       emoji: '🍎', color: 'from-red-400 to-orange-400' },
  vegetables:  { name: 'الخضروات',      emoji: '🥦', color: 'from-green-400 to-emerald-500' },
  meat:        { name: 'اللحوم',         emoji: '🥩', color: 'from-red-500 to-rose-600' },
  dairy:       { name: 'الألبان',        emoji: '🥛', color: 'from-blue-300 to-sky-400' },
  bakery:      { name: 'المخبوزات',      emoji: '🍞', color: 'from-amber-400 to-yellow-500' },
  beverages:   { name: 'المشروبات',      emoji: '🥤', color: 'from-purple-400 to-indigo-500' },
  snacks:      { name: 'الوجبات الخفيفة', emoji: '🍿', color: 'from-pink-400 to-rose-400' },
  household:   { name: 'المنزل',         emoji: '🏠', color: 'from-teal-400 to-cyan-500' },
  personal:    { name: 'العناية الشخصية', emoji: '🧴', color: 'from-violet-400 to-purple-500' },
  electronics: { name: 'الإلكترونيات',  emoji: '📱', color: 'from-slate-500 to-gray-600' },
}

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

export default function CategoryPage() {
  const { slug } = useParams()
  const [sort, setSort]   = useState('')
  const [page, setPage]   = useState(1)
  const meta = CATEGORY_META[slug] ?? { name: slug, emoji: '🛍️', color: 'from-primary to-emerald-500' }

  const { data, isLoading } = useProducts({ category: slug, sort: sort || undefined, page, limit: 20 })
  const products = data?.products ?? []
  const total    = data?.total ?? 0

  return (
    <div dir="rtl">
      {/* Category header */}
      <div className={`bg-gradient-to-l ${meta.color} px-4 py-8`}>
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <span className="text-5xl">{meta.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-white">{meta.name}</h1>
            {!isLoading && (
              <p className="text-white/70 text-sm mt-1">
                {total > 0 ? `${total} منتج متاح` : 'لا توجد منتجات'}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Sort bar */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            {isLoading ? 'جاري التحميل...' : `${total} منتج`}
          </p>
          <div className="relative">
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(1) }}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:border-primary"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <EmptyState icon={meta.emoji} title="لا توجد منتجات" message="لا توجد منتجات في هذا القسم حالياً" />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div className="mt-8">
              <Pagination total={total} page={page} onChange={setPage} perPage={20} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
