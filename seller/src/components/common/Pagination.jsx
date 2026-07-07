import { ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function Pagination({ total, perPage = 20, totalPages: totalPagesProp, page = 1, onPageChange }) {
  const totalPages = totalPagesProp ?? (total != null ? Math.ceil(total / perPage) : 1)
  if (totalPages <= 1) return null

  const pages = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    if (page <= 4) {
      pages.push(1, 2, 3, 4, 5, '…', totalPages)
    } else if (page >= totalPages - 3) {
      pages.push(1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, '…', page - 1, page, page + 1, '…', totalPages)
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange?.(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-40"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {pages.map((p, i) =>
        p === '…'
          ? <span key={`ellipsis-${i}`} className="px-1 text-gray-400">…</span>
          : (
            <button
              key={p}
              onClick={() => onPageChange?.(p)}
              className={cn('w-9 h-9 rounded-xl text-sm font-medium transition-colors',
                p === page ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-600')}
            >
              {p}
            </button>
          )
      )}

      <button
        onClick={() => onPageChange?.(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-40"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  )
}
