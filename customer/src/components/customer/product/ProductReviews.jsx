import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { getReviews, createReview } from '@/api/reviews.api'
import { useAuthStore } from '@/store/useAuthStore'
import StarRating from '@/components/common/StarRating'
import Avatar from '@/components/common/Avatar'
import { formatDate } from '@/utils/formatDate'

/* ── Star picker ── */
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              s <= (hover || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

/* ── Write review form ── */
function WriteReviewForm({ productId }) {
  const token = useAuthStore(s => s.token)
  const user  = useAuthStore(s => s.user)
  const qc    = useQueryClient()

  const [rating,  setRating]  = useState(0)
  const [comment, setComment] = useState('')
  const [open,    setOpen]    = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: () => createReview(productId, { rating, comment }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', productId] })
      toast.success('تم إضافة تقييمك بنجاح')
      setRating(0); setComment(''); setOpen(false)
    },
    onError: () => toast.error('تعذّر إرسال التقييم'),
  })

  if (!token) {
    return (
      <div className="bg-gray-50 rounded-2xl p-5 text-center border border-dashed border-gray-200">
        <p className="text-sm text-gray-500">
          <a href="/login" className="text-primary font-semibold hover:underline">سجّل دخولك</a>
          {' '}لتتمكن من إضافة تقييم
        </p>
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3.5 rounded-2xl border-2 border-dashed border-primary/30 text-primary font-semibold text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
      >
        <Star className="w-4 h-4" />
        أضف تقييمك لهذا المنتج
      </button>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <Avatar name={user?.name} size="sm" />
        <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-600 mb-2">تقييمك:</p>
        <StarPicker value={rating} onChange={setRating} />
        {rating > 0 && (
          <p className="text-xs text-gray-400 mt-1.5">
            {['', 'سيئ', 'مقبول', 'جيد', 'جيد جداً', 'ممتاز'][rating]}
          </p>
        )}
      </div>

      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="شاركنا رأيك في هذا المنتج..."
        rows={3}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none focus:border-primary transition-colors"
      />

      <div className="flex gap-3 mt-3">
        <button
          onClick={() => setOpen(false)}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          إلغاء
        </button>
        <button
          onClick={() => mutate()}
          disabled={isPending || rating === 0}
          className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg,#00C896,#00A878)' }}
        >
          {isPending ? 'جاري الإرسال...' : 'إرسال التقييم'}
        </button>
      </div>
    </div>
  )
}

/* ── Rating bar ── */
function RatingBar({ star, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-3 shrink-0">{star}</span>
      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#00C896' }} />
      </div>
      <span className="text-xs text-gray-400 w-5 text-left shrink-0">{count}</span>
    </div>
  )
}

/* ── Main component ── */
export default function ProductReviews({ productId }) {
  const [filter, setFilter] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn:  () => getReviews(productId),
  })

  const reviews   = data?.reviews ?? []
  const avgRating = data?.avgRating
    ? Number(data.avgRating).toFixed(1)
    : reviews.length
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : 0

  const starCounts = [5, 4, 3, 2, 1].map(s => ({
    star: s, count: reviews.filter(r => r.rating === s).length,
  }))

  const filtered = filter === 0 ? reviews : reviews.filter(r => r.rating === filter)

  if (isLoading) return (
    <div className="mt-12 animate-pulse">
      <div className="h-6 bg-gray-100 rounded w-40 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-4 flex gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-24" />
              <div className="h-3 bg-gray-100 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="mt-12" dir="rtl">
      <h2 className="text-xl font-bold text-gray-900 mb-5">
        التقييمات
        {reviews.length > 0 && (
          <span className="text-gray-400 font-normal text-base mr-2">({reviews.length})</span>
        )}
      </h2>

      {/* Write review */}
      <div className="mb-6">
        <WriteReviewForm productId={productId} />
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
          <span className="text-4xl block mb-3">⭐</span>
          <p className="font-semibold text-gray-700">لا توجد تقييمات بعد</p>
          <p className="text-sm text-gray-400 mt-1">كن أول من يقيّم هذا المنتج</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Summary */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 md:col-span-1">
            <div className="text-center mb-5">
              <p className="text-5xl font-bold text-gray-900">{avgRating}</p>
              <div className="flex justify-center my-2">
                <StarRating value={parseFloat(avgRating)} readonly size="sm" />
              </div>
              <p className="text-sm text-gray-400">{reviews.length} تقييم</p>
            </div>
            <div className="space-y-2">
              {starCounts.map(({ star, count }) => (
                <RatingBar key={star} star={star} count={count} total={reviews.length} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-50">
              {[0, 5, 4, 3, 2, 1].map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
                    filter === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {s === 0 ? 'الكل' : `${s} ★`}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews list */}
          <div className="md:col-span-2 space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <p className="text-gray-400 text-sm">لا توجد تقييمات بهذا التصنيف</p>
              </div>
            ) : filtered.map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
                <div className="flex items-start gap-3">
                  <Avatar name={r.customerName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-800 text-sm">{r.customerName}</p>
                      <p className="text-xs text-gray-400 shrink-0">{formatDate(r.createdAt)}</p>
                    </div>
                    <div className="mb-2">
                      <StarRating value={r.rating} readonly size="sm" />
                    </div>
                    {r.comment && (
                      <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
