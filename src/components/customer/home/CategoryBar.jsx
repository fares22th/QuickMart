import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/api/categories.api'

const MOCK_CATS = [
  { id: 1,  slug: 'restaurants',  emoji: '🍔', name: 'مطاعم',        color: '#FF6B35', bg: '#FFF0EB' },
  { id: 2,  slug: 'supermarket',  emoji: '🛒', name: 'سوبرماركت',    color: '#10b981', bg: '#ECFDF5' },
  { id: 3,  slug: 'bakery',       emoji: '🥐', name: 'مخبوزات',      color: '#F59E0B', bg: '#FFFBEB' },
  { id: 4,  slug: 'sweets',       emoji: '🍰', name: 'حلويات',       color: '#EC4899', bg: '#FDF2F8' },
  { id: 5,  slug: 'coffee',       emoji: '☕', name: 'قهوة ومشروبات', color: '#8B5CF6', bg: '#F5F3FF' },
  { id: 6,  slug: 'pharmacy',     emoji: '💊', name: 'صيدليات',      color: '#3B82F6', bg: '#EFF6FF' },
  { id: 7,  slug: 'electronics',  emoji: '📱', name: 'إلكترونيات',   color: '#6366F1', bg: '#EEF2FF' },
  { id: 8,  slug: 'fashion',      emoji: '👗', name: 'ملابس',        color: '#F472B6', bg: '#FDF4FF' },
  { id: 9,  slug: 'flowers',      emoji: '🌸', name: 'زهور وهدايا',  color: '#F43F5E', bg: '#FFF1F2' },
  { id: 10, slug: 'home',         emoji: '🏠', name: 'منزل ومطبخ',   color: '#14B8A6', bg: '#F0FDFA' },
  { id: 11, slug: 'sports',       emoji: '⚽', name: 'رياضة',        color: '#22C55E', bg: '#F0FDF4' },
  { id: 12, slug: 'other',        emoji: '📦', name: 'أخرى',         color: '#94A3B8', bg: '#F8FAFC' },
]

export default function CategoryBar() {
  const [active, setActive] = useState(null)
  const { data: apiCats = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const cats = apiCats.length
    ? apiCats.map(c => ({ ...c, emoji: c.icon, slug: String(c.id) }))
    : MOCK_CATS

  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">تسوّق حسب الفئة</h2>
            <p className="text-sm text-gray-400 mt-0.5">اختر ما تحتاجه من أكثر من {cats.length} فئة</p>
          </div>
          <Link to="/search"
            className="text-sm font-semibold flex items-center gap-1.5 px-4 py-2 rounded-xl transition-colors hover:bg-gray-50"
            style={{ color: '#00C896' }}>
            عرض الكل
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 xl:grid-cols-12 gap-2 sm:gap-3">
          {cats.map(cat => {
            const isActive = active === (cat.slug ?? cat.id)
            const color    = cat.color ?? '#00C896'
            const bg       = cat.bg    ?? '#E6FAF5'
            const emoji    = cat.emoji ?? cat.icon ?? '📦'
            return (
              <Link
                key={cat.id ?? cat.slug}
                to={`/category/${cat.slug ?? cat.id}`}
                onClick={() => setActive(cat.slug ?? cat.id)}
                className="group flex flex-col items-center gap-2.5 p-2 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                style={isActive ? { background: `${color}12` } : undefined}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 group-hover:scale-110"
                  style={{
                    background:  isActive ? color : bg,
                    boxShadow:   isActive ? `0 8px 20px ${color}35` : `0 2px 8px ${color}18`,
                  }}
                >
                  <span style={isActive ? { filter: 'brightness(0) invert(1)' } : undefined}>
                    {emoji}
                  </span>
                </div>
                <span
                  className="text-[11px] font-semibold text-center leading-tight transition-colors"
                  style={{ color: isActive ? color : '#374151' }}
                >
                  {cat.name}
                </span>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
