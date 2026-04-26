import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Star, ThumbsUp, MessageSquare } from 'lucide-react'
import { getReviews, createReview } from '@/api/reviews.api'
import { useAuthStore } from '@/store/useAuthStore'
import { fromNow } from '@/utils/formatDate'
import Avatar from '@/components/common/Avatar'
import StarRating from '@/components/common/StarRating'

function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar name={review.customerName} src={review.avatarUrl} size="sm" />
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <p className="font-semibold text-sm">{review.customerName}</p>
            <p className="text-xs text-gray-400">{fromNow(review.created_at)}</p>
          </div>
          <StarRating value={review.rating} readonly size="sm" />
          {review.comment && (
            <p className="text-gray-600 text-sm mt-2 leading-relaxed">{review.comment}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function AddReviewForm({ productId, onCancel }) {
  const qc = useQueryClient()
  const [rating, setRating] = useState(5)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => createReview(productId, { rating, comment: data.comment }),
    onSuccess: () => {
      toast.success('تم إضافة تقييمك ✓')
      qc.invalidateQueries({ queryKey: ['reviews', productId] })
      reset()
      onCancel()
    },
    onError: (err) => toast.error(err?.message || 'تعذّر إضافة التقييم'),
  })

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
      <h4 className="font-bold mb-4">أضف تقييمك</h4>
      <form onSubmit={handleSubmit(d => mutate(d))} className="space-y-4">
        {/* Star selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">التقييم</label>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star className={`w-7 h-7 transition-colors ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">تعليق (اختياري)</label>
          <textarea
            {...register('comment')}
            rows={3}
            placeholder="شاركنا رأيك في هذا المنتج..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:border-green-500 focus:ring-green-500/15 transition"
          />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            إلغاء
          </button>
          <button type="submit" disabled={isPending}
            className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-60">
            {isPending ? 'جاري الإرسال...' : 'نشر التقييم'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function ProductReviews({ productId }) {
  const { profile } = useAuthStore()
  const [showForm, setShowForm] = useState(false)

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn:  () => getReviews(productId),
  })

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">التقييمات</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-amber-700">{avg}</span>
              <span className="text-amber-600 text-sm">({reviews.length})</span>
            </div>
          )}
        </div>
        {profile && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-sm px-4 py-2 rounded-xl transition-colors border border-green-200"
          >
            <MessageSquare className="w-4 h-4" /> إضافة تقييم
          </button>
        )}
      </div>

      {showForm && <div className="mb-5"><AddReviewForm productId={productId} onCancel={() => setShowForm(false)} /></div>}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-4 bg-gray-100 rounded w-4/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !reviews.length ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <ThumbsUp className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">لا توجد تقييمات بعد</p>
          <p className="text-gray-400 text-sm mt-1">كن أول من يقيّم هذا المنتج</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
        </div>
      )}
    </div>
  )
}
