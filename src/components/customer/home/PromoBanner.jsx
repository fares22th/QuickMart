import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

function useCountdown(targetHours = 8) {
  const [time, setTime] = useState({ h: targetHours, m: 0, s: 0 })
  useEffect(() => {
    const id = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev
        if (s > 0) return { h, m, s: s - 1 }
        if (m > 0) return { h, m: m - 1, s: 59 }
        if (h > 0) return { h: h - 1, m: 59, s: 59 }
        return { h: 0, m: 0, s: 0 }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function Pad({ n }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white font-bold text-lg">
        {String(n).padStart(2, '0')}
      </div>
    </div>
  )
}

export default function PromoBanner() {
  const { h, m, s } = useCountdown(8)

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-5">

      {/* ── Banner 1: Flash Sale ── */}
      <div className="relative rounded-3xl overflow-hidden p-6 flex flex-col justify-between min-h-[180px]"
        style={{ background: 'linear-gradient(135deg,#FF6B35 0%,#e85d2a 60%,#cc4d1f 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,#fff 0%,transparent 70%)' }} />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#fff 0%,transparent 70%)' }} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            <span className="text-base">⚡</span> فلاش سيل
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">خصم ٥٠٪</h3>
          <p className="text-white/75 text-sm mb-4">على المنتجات المختارة — لفترة محدودة</p>
          {/* Countdown */}
          <div className="flex items-center gap-2 mb-4">
            <Pad n={h} />
            <span className="text-white font-bold text-lg">:</span>
            <Pad n={m} />
            <span className="text-white font-bold text-lg">:</span>
            <Pad n={s} />
          </div>
          <Link to="/search?promo=flash"
            className="inline-flex items-center gap-1.5 bg-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all hover:shadow-lg active:scale-95"
            style={{ color: '#FF6B35' }}>
            تسوق الآن <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
        <div className="absolute left-4 bottom-4 text-[5rem] leading-none select-none opacity-30">🛍️</div>
      </div>

      {/* ── Banner 2: Free delivery ── */}
      <div className="relative rounded-3xl overflow-hidden p-6 flex flex-col justify-between min-h-[180px]"
        style={{ background: 'linear-gradient(135deg,#6366F1 0%,#4F46E5 60%,#3730A3 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,#fff 0%,transparent 70%)' }} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            <span className="text-base">🛵</span> توصيل مجاني
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">توصيل مجاني</h3>
          <p className="text-white/75 text-sm mb-6">على أول ٣ طلبات عند التسجيل الجديد</p>
          <Link to="/register"
            className="inline-flex items-center gap-1.5 bg-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all hover:shadow-lg active:scale-95"
            style={{ color: '#6366F1' }}>
            سجّل مجاناً <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
        <div className="absolute left-4 bottom-4 text-[5rem] leading-none select-none opacity-20">🚀</div>
      </div>
    </section>
  )
}
