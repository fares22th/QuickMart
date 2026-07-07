import StarRating from '@/components/common/StarRating'
import EmptyState from '@/components/common/EmptyState'

export default function SellerReviewsPage() {
  const reviews = []

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">التقييمات</h1>
      {!reviews.length
        ? <EmptyState message="لا توجد تقييمات بعد" />
        : reviews.map(r => (
          <div key={r.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <p className="font-bold">{r.customerName}</p>
              <StarRating value={r.rating} readonly />
            </div>
            <p className="text-gray-600 mt-1">{r.comment}</p>
          </div>
        ))
      }
    </div>
  )
}
