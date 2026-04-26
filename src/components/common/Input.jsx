import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Input = forwardRef(function Input({ label, error, className, ...props }, ref) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-colors',
          error && 'border-red-400 focus:border-red-400',
          className,
        )}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
})

export default Input
