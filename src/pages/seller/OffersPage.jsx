import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Tag, Percent, Calendar, Users, Copy, Trash2, X, Zap, Gift, Clock, CheckCircle, ToggleLeft } from 'lucide-react'

const MOCK_COUPONS = [
  { id: '1', code: 'RAMADAN30',  type: 'percent', value: 30, minOrder: 100, uses: 48,  maxUses: 100, expiry: '2026-04-30', status: 'active'   },
  { id: '2', code: 'WELCOME10',  type: 'percent', value: 10, minOrder: 0,   uses: 132, maxUses: 500, expiry: '2026-12-31', status: 'active'   },
  { id: '3', code: 'FLAT20SAR',  type: 'fixed',   value: 20, minOrder: 80,  uses: 21,  maxUses: 50,  expiry: '2026-05-15', status: 'active'   },
  { id: '4', code: 'SUMMER25',   type: 'percent', value: 25, minOrder: 150, uses: 50,  maxUses: 50,  expiry: '2026-03-31', status: 'expired'  },
  { id: '5', code: 'VIP50',      type: 'percent', value: 50, minOrder: 200, uses: 8,   maxUses: 20,  expiry: '2026-05-31', status: 'paused'   },
]

const STATUS_META = {
  active:  { label: 'نشط',    color: 'bg-green-50 text-green-700 ring-green-200',   dot: 'bg-green-500' },
  expired: { label: 'منتهي',  color: 'bg-gray-100 text-gray-500 ring-gray-200',     dot: 'bg-gray-400' },
  paused:  { label: 'متوقف',  color: 'bg-amber-50 text-amber-700 ring-amber-200',   dot: 'bg-amber-500' },
}

const FLASH_SALES = [
  { id: '1', title: 'تخفيضات نهاية الأسبوع', discount: 20, products: 12, ends: '2026-04-26 23:59', active: true },
  { id: '2', title: 'عرض الساعة الواحدة',    discount: 40, products: 3,  ends: '2026-04-25 14:00', active: false },
]

function CouponCard({ coupon, onDelete }) {
  const m    = STATUS_META[coupon.status] ?? STATUS_META.expired
  const pct  = Math.min((coupon.uses / coupon.maxUses) * 100, 100)

  const copyCode = () => {
    navigator.clipboard.writeText(coupon.code)
    toast.success('تم نسخ الكود')
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${coupon.status === 'expired' ? 'opacity-60' : 'border-gray-100'}`}>
      {/* Top stripe */}
      <div className={`h-1.5 ${coupon.status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-400' : coupon.status === 'paused' ? 'bg-amber-400' : 'bg-gray-200'}`} />
      <div className="p-4">
        {/* Code + Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 px-3 py-1.5 rounded-xl font-mono font-black text-gray-800 tracking-widest text-sm">
              {coupon.code}
            </div>
            <button onClick={copyCode} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ring-1 ${m.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
            {m.label}
          </span>
        </div>

        {/* Value */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            {coupon.type === 'percent'
              ? <Percent className="w-5 h-5 text-white" />
              : <Tag className="w-5 h-5 text-white" />}
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">
              {coupon.type === 'percent' ? `${coupon.value}٪` : `${coupon.value} ر.س`}
            </p>
            <p className="text-[10px] text-gray-400">
              {coupon.minOrder > 0 ? `حد أدنى للطلب: ${coupon.minOrder} ر.س` : 'بدون حد أدنى'}
            </p>
          </div>
        </div>

        {/* Usage progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" /> الاستخدام</span>
            <span className="font-semibold text-gray-700">{coupon.uses} / {coupon.maxUses}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full transition-all ${pct >= 90 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Calendar className="w-3 h-3" />
            ينتهي: {coupon.expiry}
          </div>
          <button onClick={() => onDelete(coupon.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function NewCouponModal({ onClose }) {
  const [type, setType] = useState('percent')
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">كوبون خصم جديد</h3>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">كود الخصم</label>
              <input placeholder="مثل: SUMMER25" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">نوع الخصم</label>
              <div className="flex gap-2">
                {[{ v: 'percent', l: 'نسبة مئوية ٪', icon: Percent }, { v: 'fixed', l: 'مبلغ ثابت ر.س', icon: Tag }].map(t => (
                  <button key={t.v} onClick={() => setType(t.v)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${type === t.v ? 'border-[#16A34A] bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    <t.icon className="w-4 h-4" /> {t.l}
                  </button>
                ))}
              </div>
            </div>
            {[
              { label: `قيمة الخصم (${type === 'percent' ? '٪' : 'ر.س'})`, type: 'number', placeholder: '25' },
              { label: 'الحد الأدنى للطلب (ر.س)',   type: 'number', placeholder: '100' },
              { label: 'الحد الأقصى للاستخدام',     type: 'number', placeholder: '100' },
              { label: 'تاريخ الانتهاء',             type: 'date',   placeholder: '' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all" />
              </div>
            ))}
          </div>
          <div className="p-5 border-t border-gray-100 flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">إلغاء</button>
            <button onClick={() => { toast.success('تم إنشاء الكوبون'); onClose() }}
              className="flex-1 py-2.5 bg-[#16A34A] text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
              إنشاء الكوبون
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function SellerOffersPage() {
  const [showNew,   setShowNew]   = useState(false)
  const [coupons,   setCoupons]   = useState(MOCK_COUPONS)
  const [flashSales] = useState(FLASH_SALES)

  const deleteCoupon = id => {
    setCoupons(c => c.filter(x => x.id !== id))
    toast.success('تم حذف الكوبون')
  }

  const active  = coupons.filter(c => c.status === 'active').length
  const total   = coupons.reduce((s, c) => s + c.uses, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">العروض والكوبونات</h1>
          <p className="text-sm text-gray-500 mt-0.5">أنشئ وأدر كوبونات الخصم وعروض المتجر</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> كوبون جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'كوبونات نشطة',  value: active, color: 'bg-green-50 text-green-700' },
          { label: 'إجمالي الاستخدامات', value: total, color: 'bg-blue-50 text-blue-700' },
          { label: 'توفير للعملاء',  value: '—',    color: 'bg-violet-50 text-violet-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border border-gray-100 shadow-sm p-4 text-center ${s.color}`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-1 opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Flash Sales */}
      <div className="bg-gradient-to-r from-orange-500 to-rose-600 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-white" />
            <p className="text-white font-bold">العروض الفورية (Flash Sales)</p>
          </div>
          <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors">
            <Plus className="w-3.5 h-3.5" /> عرض جديد
          </button>
        </div>
        <div className="space-y-2">
          {flashSales.map(f => (
            <div key={f.id} className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">{f.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-white/70 text-xs">{f.products} منتج</span>
                  <span className="text-white/70 text-xs">خصم {f.discount}٪</span>
                  <span className="flex items-center gap-1 text-white/60 text-xs"><Clock className="w-3 h-3" /> {f.ends}</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${f.active ? 'bg-green-400/30 text-green-100' : 'bg-white/10 text-white/60'}`}>
                {f.active ? 'نشط' : 'منتهي'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Coupons Grid */}
      <div>
        <p className="font-bold text-gray-900 mb-3">الكوبونات</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {coupons.map(c => <CouponCard key={c.id} coupon={c} onDelete={deleteCoupon} />)}
          {/* Add New Card */}
          <button onClick={() => setShowNew(true)}
            className="border-2 border-dashed border-gray-200 hover:border-green-400 hover:bg-green-50/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-green-600 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold">كوبون جديد</p>
          </button>
        </div>
      </div>

      {showNew && <NewCouponModal onClose={() => setShowNew(false)} />}
    </div>
  )
}
