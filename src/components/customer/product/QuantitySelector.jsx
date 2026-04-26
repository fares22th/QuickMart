import { Minus, Plus } from 'lucide-react'

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center hover:border-primary disabled:opacity-40"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-10 text-center font-bold text-lg">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center hover:border-primary disabled:opacity-40"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}
