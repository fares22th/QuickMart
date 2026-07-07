import SearchInput from '@/components/common/SearchInput'

const STATUSES = ['الكل', 'قيد الانتظار', 'مؤكد', 'جاري التحضير', 'في الطريق', 'تم التوصيل', 'ملغي']

export default function OrderFilters({ onSearch, onStatusChange }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <SearchInput placeholder="بحث برقم الطلب..." onChange={e => onSearch?.(e.target.value)} className="w-64" />
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {STATUSES.map(s => (
          <button key={s} className="px-3 py-1.5 rounded-xl text-sm border border-gray-200 hover:border-primary hover:text-primary whitespace-nowrap transition-colors">
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
