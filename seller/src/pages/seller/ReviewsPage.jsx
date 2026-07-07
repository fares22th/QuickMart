import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Star, MessageCircle, Search } from 'lucide-react'
import { getMyReviews, replyToReview } from '@/api/seller.api'
import StarRating from '@/components/common/StarRating'
import EmptyState from '@/components/common/EmptyState'
import Pagination from '@/components/common/Pagination'

function ReplyForm({ reviewId, existingReply, onDone }) {
  const qc  = useQueryClient()
  const [text, setText] = useState(existingReply ?? '')
  const [open, setOpen] = useState(!!existingReply)

  const mut = useMutation({
    mutationFn: (reply) => replyToReview(reviewId, reply),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seller-reviews'] })
      toast.success('تم نشر ردك')
      onDone?.()
    },
    onError: () => toast.error('تعذّر نشر الرد'),
  })

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm text-primary hover:underline mt-2"
      >
        <MessageCircle className="w-4 h-4" />
        {existingReply ? 'تعديل الرد' : 'ردّ على التقييم'}
      </button>
    )
  }

  return (
    <div className="mt-3 space-y-2">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="اكتب ردك على تقييم العميل..."
        rows={3}
        className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-primary focus:outline-none resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={() => mut.mutate(text)}
          disabled={!text.trim() || mut.isPending}
          className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {mut.isPending ? 'جاري النشر...' : 'نشر الرد'}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
        >
          إلغاء
        </button>
      </div>
    </div>
  )
}

function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0">
            {review.customerName?.[0] ?? '?'}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{review.customerName}</p>
            <p className="text-xs text-gray-400">{review.productName}</p>
          </div>
        </div>
        <div className="text-right">
          <StarRating value={review.rating} readonly />
          <p className="text-xs text-gray-400 mt-0.5">{review.createdAt}</p>
        </div>
      </div>

      {review.comment && (
        <p className="text-gray-600 text-sm mt-3 leading-relaxed">{review.comment}</p>
      )}

      {review.reply && (
        <div className="mt-3 bg-primary/5 rounded-xl p-3 border-r-2 border-primary">
          <p className="text-xs font-semibold text-primary mb-1">ردّك</p>
          <p className="text-sm text-gray-700">{review.reply}</p>
        </div>
      )}

      <ReplyForm reviewId={review.id} existingReply={review.reply} />
    </div>
  )
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-100" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-32" />
              <div className="h-3 bg-gray-100 rounded w-24" />
            </div>
          </div>
          <div className="h-4 bg-gray-100 rounded w-full mb-2" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </div>
      ))}
    </div>
  )
}

const STAR_FILTERS = [
  { key: '', label: 'الكل' },
  { key: '5', label: '★ 5' },
  { key: '4', label: '★ 4' },
  { key: '3', label: '★ 3' },
  { key: '2', label: '★ 2' },
  { key: '1', label: '★ 1' },
]

export default function SellerReviewsPage() {
  const [search,    setSearch]    = useState('')
  const [starFilter, setStarFilter] = useState('')
  const [page,      setPage]      = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['seller-reviews', { search, rating: starFilter, page }],
    queryFn:  () => getMyReviews({ search, rating: starFilter, page, limit: 10 }),
    keepPreviousData: true,
  })

  const reviews    = data?.reviews ?? []
  const totalPages = data?.totalPages ?? 1
  const avgRating  = data?.avgRating ?? 0
  const totalCount = data?.total ?? 0

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التقييمات</h1>
          <p className="text-sm text-gray-400 mt-0.5">{totalCount} تقييم</p>
        </div>

        {avgRating > 0 && (
          <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2.5 rounded-xl">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-yellow-700 text-lg">{avgRating.toFixed(1)}</span>
            <span className="text-sm text-yellow-600">متوسط التقييم</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="بحث باسم العميل أو المنتج..."
            className="w-full pr-9 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none bg-white"
          />
        </div>

        <div className="flex gap-1.5">
          {STAR_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => { setStarFilter(f.key); setPage(1) }}
              className={`px-3 py-2 rounded-xl text-sm transition-all ${
                starFilter === f.key
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-yellow-400 hover:text-yellow-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews */}
      {isLoading ? (
        <ReviewsSkeleton />
      ) : !reviews.length ? (
        <EmptyState
          icon={Star}
          title="لا توجد تقييمات"
          message={search || starFilter ? 'لا توجد تقييمات تطابق البحث' : 'لم يقيّم أي عميل منتجاتك بعد'}
        />
      ) : (
        <div className="space-y-4">
          {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}
