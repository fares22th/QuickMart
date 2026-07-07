import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

export default function NavSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-xl">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ابحث عن منتجات أو متاجر..."
          className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none"
        />
      </div>
    </form>
  )
}
