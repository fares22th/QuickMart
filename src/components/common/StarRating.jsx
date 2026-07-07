import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function StarRating({ value = 0, max = 5, onChange, readonly = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(i + 1)}
          className={cn('p-0.5', !readonly && 'hover:scale-110 transition-transform')}
        >
          <Star
            className={cn('w-5 h-5', i < value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')}
          />
        </button>
      ))}
    </div>
  )
}
