import { ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function Pagination({ total = 0, page = 1, perPage = 20, onPageChange }) {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange?.(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-40"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onPageChange?.(p)}
          className={cn('w-9 h-9 rounded-xl text-sm font-medium transition-colors',
            p === page ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-600')}
        >
          {p}
        </button>
      ))}
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
