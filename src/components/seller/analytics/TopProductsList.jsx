import { formatPrice } from '@/utils/formatPrice'
import EmptyState from '@/components/common/EmptyState'

export default function TopProductsList({ products = [] }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold mb-4">أكثر المنتجات مبيعاً</h3>
      {!products.length
        ? <EmptyState message="لا توجد بيانات" />
        : (
          <div className="space-y-3">
            {products.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                  {i + 1}
                </span>
                <p className="flex-1 text-sm truncate">{p.name}</p>
                <p className="font-medium text-sm">{formatPrice(p.revenue)}</p>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}
