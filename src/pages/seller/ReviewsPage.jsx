import { useState } from 'react'
import { toast } from 'sonner'
import { Star, ThumbsUp, Flag, MessageSquare, Search, Filter, TrendingUp, Send } from 'lucide-react'

const MOCK_REVIEWS = [
  { id: '1', customer: 'أحمد الزبون',    avatar: null, rating: 5, text: 'منتجات ممتازة وطازجة جداً! التوصيل كان سريعاً والتغليف نظيف. سأطلب مجدداً بكل تأكيد.', product: 'عصير برتقال طازج', date: '2026-04-22', likes: 8,  reply: null },
  { id: '2', customer: 'نورة القحطاني',  avatar: null, rating: 5, text: 'خدمة رائعة والمتجر من أفضل المتاجر على التطبيق. شكراً جزيلاً!', product: 'سلطة فواكه مشكلة', date: '2026-04-20', likes: 12, reply: 'شكراً لكِ نورة! يسعدنا خدمتك دائماً.' },
  { id: '3', customer: 'خالد العمري',    avatar: null, rating: 4, text: 'المنتجات جيدة لكن التوصيل تأخر قليلاً عن الموعد المحدد. آمل أن يتحسن الأمر.', product: 'خبز عربي أصيل', date: '2026-04-18', likes: 3,  reply: null },
  { id: '4', customer: 'سارة المحمدي',  avatar: null, rating: 2, text: 'المنتج لم يكن بنفس جودة الصورة. كنت أتوقع أفضل من ذلك للسعر المدفوع.', product: 'لبن كامل الدسم', date: '2026-04-15', likes: 1,  reply: null },
  { id: '5', customer: 'محمد الغامدي',  avatar: null, rating: 5, text: 'أفضل متجر على الإطلاق! التعامل محترم والمنتجات طازجة. أنصح الجميع.', product: 'تفاح أحمر طازج', date: '2026-04-12', likes: 15, reply: 'نشكرك محمد على كلماتك الطيبة!' },
  { id: '6', customer: 'ريم الشهري',    avatar: null, rating: 3, text: 'المنتجات معقولة لكن هناك مجال للتحسين في التغليف والترتيب.', product: 'عصير برتقال طازج', date: '2026-04-10', likes: 2,  reply: null },
]

function Stars({ rating, size = 'sm' }) {
  const s = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`${s} ${i <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-200'}`} />
      ))}
    </div>
  )
}

function RatingBar({ label, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-4 text-left shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className="bg-amber-400 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-600 w-4 text-left shrink-0">{count}</span>
    </div>
  )
}

function ReviewCard({ review, onReply }) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState(review.reply ?? '')
  const [saved,     setSaved]     = useState(!!review.reply)

  const sendReply = () => {
    if (!replyText.trim()) return
    onReply(review.id, replyText)
    setSaved(true)
    setReplyOpen(false)
    toast.success('تم إرسال ردك')
  }

  const initials = review.customer?.split(' ').map(w => w[0]).slice(0, 2).join('') ?? '?'
  const GRAD_COLORS = ['from-blue-400 to-indigo-500','from-green-400 to-emerald-500','from-violet-400 to-purple-500','from-pink-400 to-rose-500','from-amber-400 to-orange-500']
  const grad = GRAD_COLORS[(review.customer?.charCodeAt(0) ?? 0) % GRAD_COLORS.length]

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 transition-all hover:shadow-md ${review.rating <= 2 ? 'border-red-100' : 'border-gray-100'}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
            {initials}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{review.customer}</p>
            <Stars rating={review.rating} />
          </div>
        </div>
        <div className="text-left">
          <p className="text-xs text-gray-400">{review.date}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{review.product}</p>
        </div>
      </div>

      {/* Review text */}
      <p className="text-sm text-gray-700 leading-relaxed mb-3">{review.text}</p>

      {/* Existing reply */}
      {saved && replyText && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-3">
          <p className="text-[10px] font-bold text-green-700 mb-1 flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> رد المتجر
          </p>
          <p className="text-xs text-green-800">{replyText}</p>
        </div>
      )}

      {/* Reply input */}
      {replyOpen && (
        <div className="mb-3">
          <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={2}
            placeholder="اكتب ردك على العميل..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all" />
          <div className="flex gap-2 mt-2">
            <button onClick={() => setReplyOpen(false)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-50">إلغاء</button>
            <button onClick={sendReply} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#16A34A] text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors">
              <Send className="w-3 h-3" /> إرسال الرد
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
        <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-500 transition-colors">
          <ThumbsUp className="w-3.5 h-3.5" /> {review.likes} مفيد
        </button>
        {!saved && !replyOpen && (
          <button onClick={() => setReplyOpen(true)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-600 transition-colors">
            <MessageSquare className="w-3.5 h-3.5" /> رد على العميل
          </button>
        )}
        {saved && (
          <button onClick={() => { setReplyOpen(true); setSaved(false) }}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-600 transition-colors">
            <MessageSquare className="w-3.5 h-3.5" /> تعديل الرد
          </button>
        )}
        <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors mr-auto">
          <Flag className="w-3.5 h-3.5" /> إبلاغ
        </button>
      </div>
    </div>
  )
}

export default function SellerReviewsPage() {
  const [reviews, setReviews]   = useState(MOCK_REVIEWS)
  const [filter,  setFilter]    = useState('all')
  const [search,  setSearch]    = useState('')

  const handleReply = (id, text) => {
    setReviews(r => r.map(x => x.id === id ? { ...x, reply: text } : x))
  }

  const totalRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  const countByRating = [5,4,3,2,1].map(n => ({
    label: n,
    count: reviews.filter(r => r.rating === n).length,
  }))

  const filtered = reviews.filter(r => {
    if (filter === 'positive') return r.rating >= 4
    if (filter === 'negative') return r.rating <= 2
    if (filter === 'unanswered') return !r.reply
    return true
  }).filter(r => !search || r.customer.includes(search) || r.product.includes(search))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">التقييمات والمراجعات</h1>
        <p className="text-sm text-gray-500 mt-0.5">اقرأ وردّ على تقييمات عملائك</p>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Big Score */}
        <div className="bg-gradient-to-br from-[#0F172A] to-slate-800 rounded-2xl p-6 flex items-center gap-5">
          <div className="text-center">
            <p className="text-5xl font-black text-white">{totalRating.toFixed(1)}</p>
            <Stars rating={Math.round(totalRating)} size="lg" />
            <p className="text-white/40 text-xs mt-1">من {reviews.length} تقييم</p>
          </div>
        </div>

        {/* Star Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-900 mb-4">توزيع التقييمات</p>
          <div className="space-y-2.5">
            {countByRating.map(r => (
              <RatingBar key={r.label} label={`${r.label}★`} count={r.count} total={reviews.length} />
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm">
          {[
            { v: 'all',        l: 'الكل' },
            { v: 'positive',   l: '⭐ إيجابي' },
            { v: 'negative',   l: '👎 سلبي' },
            { v: 'unanswered', l: '💬 بدون رد' },
          ].map(f => (
            <button key={f.v} onClick={() => setFilter(f.v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${filter === f.v ? 'bg-[#0F172A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {f.l}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="بحث..."
            className="w-full bg-white border border-gray-200 rounded-2xl py-2.5 pr-9 pl-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(r => (
          <ReviewCard key={r.id} review={r} onReply={handleReply} />
        ))}
        {filtered.length === 0 && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
            <Star className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">لا توجد تقييمات مطابقة</p>
          </div>
        )}
      </div>
    </div>
  )
}
