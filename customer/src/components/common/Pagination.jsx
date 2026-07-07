import { ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function Pagination({ total = 0, page = 1, perPage = 20, onPageChange, onChange }) {
  const handleChange = onPageChange ?? onChange
  const totalPages   = Math.ceil(total / perPage)
  if (totalPages <= 1) return null

  // Show max 7 page buttons to avoid overflow
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 4) return [1, 2, 3, 4, 5, '…', totalPages]
    if (page >= totalPages - 3) return [1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '…', page - 1, page, page + 1, '…', totalPages]
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8" dir="ltr">
      <button
        onClick={() => handleChange?.(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-40 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      {getPages().map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => handleChange?.(p)}
            className={cn('w-9 h-9 rounded-xl text-sm font-medium transition-colors',
              p === page ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-600')}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => handleChange?.(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-40 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  )
}
