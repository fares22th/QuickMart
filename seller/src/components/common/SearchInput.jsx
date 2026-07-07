import { Search } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function SearchInput({ placeholder = 'بحث...', value, onChange, className }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none"
      />
    </div>
  )
}
