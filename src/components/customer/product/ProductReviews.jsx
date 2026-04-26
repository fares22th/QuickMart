import { useQuery } from '@tanstack/react-query'
import { getReviews } from '@/api/reviews.api'
import StarRating from '@/components/common/StarRating'
import Avatar from '@/components/common/Avatar'
import { formatDate } from '@/utils/formatDate'

export default function ProductReviews({ productId }) {
  const { data: reviews = [] } = useQuery({ queryKey: ['reviews', productId], queryFn: () => getReviews(productId) })

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-4">التقييمات ({reviews.length})</h2>
      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Avatar name={r.customerName} size="sm" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{r.customerName}</p>
                  <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                </div>
                <StarRating value={r.rating} readonly />
                <p className="text-gray-600 text-sm mt-1">{r.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
