import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Filter, SortAsc } from 'lucide-react'
import { getProducts } from '@/api/products.api'
import ProductCard from '@/components/customer/product/ProductCard'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'

const SORT_OPTIONS = [
  { value: 'newest',    label: 'الأحدث' },
  { value: 'price_asc', label: 'السعر: الأقل أولاً' },
  { value: 'price_desc',label: 'السعر: الأعلى أولاً' },
]

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [sort, setSort] = useState('newest')

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'search', query],
    queryFn:  () => getProducts({ search: query, limit: 60 }),
    enabled:  query.length > 0,
  })

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price_asc')  return a.price - b.price
    if (sort === 'price_desc') return b.price - a.price
    return 0
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="h-7 bg-gray-100 rounded w-64 mb-6 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-100" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-lg text-gray-500">
            نتائج البحث عن:{' '}
            <span className="font-bold text-gray-800">"{query}"</span>
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">{products.length} نتيجة</p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-gray-400" />
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {!sorted.length ? (
        <div className="py-16">
          <EmptyState message={`لا توجد نتائج لـ "${query}"`} />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
        >
          {sorted.map(p => (
            <motion.div
              key={p.id}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
