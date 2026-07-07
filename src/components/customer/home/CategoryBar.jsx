import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/api/categories.api'

const MOCK_CATS = [
  { id: 1, slug: 'restaurants',  emoji: '🍕', name: 'مطاعم',       color: '#FF6B35', bg: '#FFF0EB' },
  { id: 2, slug: 'vegetables',   emoji: '🥦', name: 'خضروات',      color: '#22C55E', bg: '#F0FDF4' },
  { id: 3, slug: 'meat',         emoji: '🥩', name: 'لحوم',        color: '#EF4444', bg: '#FEF2F2' },
  { id: 4, slug: 'dairy',        emoji: '🥛', name: 'ألبان',       color: '#3B82F6', bg: '#EFF6FF' },
  { id: 5, slug: 'drinks',       emoji: '🥤', name: 'مشروبات',     color: '#8B5CF6', bg: '#F5F3FF' },
  { id: 6, slug: 'sweets',       emoji: '🍰', name: 'حلويات',      color: '#EC4899', bg: '#FDF2F8' },
  { id: 7, slug: 'bakery',       emoji: '🥐', name: 'مخبوزات',     color: '#F59E0B', bg: '#FFFBEB' },
  { id: 8, slug: 'care',         emoji: '🧴', name: 'عناية',       color: '#06B6D4', bg: '#ECFEFF' },
  { id: 9, slug: 'electronics',  emoji: '📱', name: 'إلكترونيات',  color: '#6366F1', bg: '#EEF2FF' },
  { id: 10, slug: 'home',        emoji: '🏠', name: 'منزل',        color: '#14B8A6', bg: '#F0FDFA' },
  { id: 11, slug: 'fashion',     emoji: '👗', name: 'ملابس',       color: '#F472B6', bg: '#FDF4FF' },
  { id: 12, slug: 'organic',     emoji: '🌿', name: 'عضوي',        color: '#00C896', bg: '#E6FAF5' },
]

export default function CategoryBar() {
  const [active, setActive] = useState(null)
  const { data: apiCats = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const cats = apiCats.length ? apiCats : MOCK_CATS

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">تسوق حسب الفئة</h2>
          <Link to="/search" className="text-sm font-semibold flex items-center gap-1" style={{ color: '#00C896' }}>
            كل الفئات
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
          {cats.map(cat => (
            <Link
              key={cat.id ?? cat.slug}
              to={`/category/${cat.slug}`}
              onClick={() => setActive(cat.slug)}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg"
                style={{
                  background: active === cat.slug ? (cat.color ?? '#00C896') : (cat.bg ?? '#E6FAF5'),
                  boxShadow: active === cat.slug ? `0 6px 20px ${cat.color ?? '#00C896'}40` : undefined,
                }}
              >
                <span style={{ filter: active === cat.slug ? 'brightness(0) invert(1)' : undefined }}>
                  {cat.emoji}
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
