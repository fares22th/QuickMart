import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, ChevronLeft } from 'lucide-react'

const SLIDES = [
  {
    tag: '🚀 توصيل خلال ٣٠ دقيقة',
    title: 'كل ما تحتاجه\nعلى بُعد نقرة',
    sub: 'آلاف المنتجات من أقرب المتاجر إليك — طازجة، سريعة، وبأفضل الأسعار',
    cta: 'اطلب الآن',
    badge1: { icon: '⭐', val: '٤.٩', label: 'تقييم العملاء' },
    badge2: { icon: '📦', val: '+١٠٠٠', label: 'منتج متاح' },
    bg: 'linear-gradient(135deg,#00C896 0%,#00A878 50%,#007A58 100%)',
    accent: '#E6FAF5',
    emoji: '🛒',
  },
  {
    tag: '🔥 عروض اليوم',
    title: 'خصومات تصل\nإلى ٥٠٪',
    sub: 'عروض حصرية يومية على آلاف المنتجات المختارة من أفضل المتاجر',
    cta: 'استكشف العروض',
    badge1: { icon: '💰', val: '٥٠٪', label: 'أقصى خصم' },
    badge2: { icon: '🏪', val: '+٢٠٠', label: 'متجر شريك' },
    bg: 'linear-gradient(135deg,#FF6B35 0%,#e85d2a 50%,#cc4d1f 100%)',
    accent: '#fff5f0',
    emoji: '🛍️',
  },
]

export default function HeroBanner() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [slide, setSlide] = useState(0)
  const s = SLIDES[slide]

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <section className="relative overflow-hidden" style={{ background: s.bg, transition: 'background 0.6s ease' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#fff 0%,transparent 70%)' }} />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle,#fff 0%,transparent 70%)' }} />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
          <defs>
            <pattern id="hg" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0L0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hg)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

          {/* ── Left content ── */}
          <div className="flex-1 text-center md:text-right">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur text-white text-sm font-semibold px-4 py-2 rounded-full mb-5">
              <span>{s.tag}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4" style={{ whiteSpace: 'pre-line' }}>
              {s.title}
            </h1>
            <p className="text-white/75 text-base md:text-lg leading-relaxed mb-7 max-w-lg mx-auto md:mx-0">
              {s.sub}
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-2xl mb-6 max-w-lg mx-auto md:mx-0">
              <div className="flex items-center gap-2 px-3 border-l border-gray-100 shrink-0">
                <MapPin className="w-4 h-4" style={{ color: '#00C896' }} />
                <span className="text-sm text-gray-500 hidden sm:block">الرياض</span>
              </div>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="ابحث عن منتجات أو متاجر..."
                className="flex-1 text-sm text-gray-800 placeholder:text-gray-400 outline-none bg-transparent"
              />
              <button type="submit"
                className="flex items-center gap-2 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg,#00C896,#00A878)' }}>
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">بحث</span>
              </button>
            </form>

            {/* Stats badges */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
              {[s.badge1, s.badge2].map(b => (
                <div key={b.label} className="flex items-center gap-2 bg-white/15 backdrop-blur rounded-2xl px-4 py-2.5">
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <p className="text-white font-bold text-sm leading-none">{b.val}</p>
                    <p className="text-white/65 text-xs mt-0.5">{b.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right illustration ── */}
          <div className="flex-shrink-0 relative w-52 h-52 md:w-72 md:h-72">
            <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur" />
            <div className="absolute inset-4 rounded-full bg-white/10" />
            <div className="absolute inset-0 flex items-center justify-center text-[8rem] md:text-[10rem] leading-none select-none">
              {s.emoji}
            </div>
            {/* Floating chips */}
            <div className="absolute -top-3 -right-3 bg-white rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2">
              <span className="text-base">⚡</span>
              <div>
                <p className="text-xs font-bold text-gray-800">توصيل سريع</p>
                <p className="text-[10px] text-gray-500">٣٠ دقيقة</p>
              </div>
            </div>
            <div className="absolute -bottom-3 -left-3 bg-white rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2">
              <span className="text-base">🔒</span>
              <div>
                <p className="text-xs font-bold text-gray-800">دفع آمن</p>
                <p className="text-[10px] text-gray-500">مشفّر ١٠٠٪</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Slide dots ── */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === slide ? 24 : 8,
                height: 8,
                background: i === slide ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
              }} />
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="relative -mb-px">
        <svg viewBox="0 0 1440 40" className="w-full" style={{ display: 'block' }} preserveAspectRatio="none">
          <path d="M0,40 C360,0 1080,40 1440,10 L1440,40 Z" fill="#f9fafb" />
        </svg>
      </div>
    </section>
  )
}
