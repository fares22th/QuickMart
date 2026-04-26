import { useState } from 'react'
import { Plus, Eye, MousePointerClick, TrendingUp, Image, X, MoreVertical, Calendar, Store, Megaphone } from 'lucide-react'

const STATUS_META = {
  active:   { label: 'نشط',    color: 'bg-green-50 text-green-700 ring-green-200',   dot: 'bg-green-500' },
  paused:   { label: 'متوقف',  color: 'bg-yellow-50 text-yellow-700 ring-yellow-200', dot: 'bg-yellow-500' },
  ended:    { label: 'منتهي',  color: 'bg-gray-100 text-gray-500 ring-gray-200',     dot: 'bg-gray-400' },
  pending:  { label: 'قيد المراجعة', color: 'bg-blue-50 text-blue-700 ring-blue-200', dot: 'bg-blue-500' },
}

const PLACEMENT_META = {
  hero:     { label: 'الصفحة الرئيسية', color: 'bg-violet-50 text-violet-700' },
  banner:   { label: 'شريط علوي',       color: 'bg-blue-50 text-blue-700' },
  sidebar:  { label: 'الشريط الجانبي',  color: 'bg-amber-50 text-amber-700' },
  category: { label: 'صفحة التصنيف',   color: 'bg-teal-50 text-teal-700' },
}

const MOCK_ADS = [
  { id: '1', title: 'عرض رمضان — خصم ٣٠٪',    store: 'متجر النور',     placement: 'hero',     status: 'active',  impressions: 48250, clicks: 3820, start: '2026-04-01', end: '2026-04-30', budget: 500 },
  { id: '2', title: 'تخفيضات المنتجات الطازجة', store: 'بقالة الأمين',  placement: 'banner',   status: 'active',  impressions: 22100, clicks: 1568, start: '2026-04-10', end: '2026-04-25', budget: 250 },
  { id: '3', title: 'منتجات العناية بالمنزل',  store: 'سوبرماركت الفرح',placement: 'category', status: 'paused',  impressions: 12800, clicks: 890,  start: '2026-03-15', end: '2026-04-15', budget: 180 },
  { id: '4', title: 'عروض نهاية الأسبوع',       store: 'هايبر العائلة', placement: 'sidebar',  status: 'pending', impressions: 0,     clicks: 0,    start: '2026-04-24', end: '2026-05-05', budget: 320 },
  { id: '5', title: 'حملة رأس السنة',           store: 'متجر البركة',   placement: 'hero',     status: 'ended',   impressions: 91400, clicks: 6730, start: '2025-12-25', end: '2026-01-05', budget: 800 },
]

function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${m.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  )
}

function NewAdModal({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">إضافة إعلان جديد</h3>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: 'عنوان الإعلان',    type: 'text',   placeholder: 'عرض رمضان الكبير...' },
              { label: 'اسم المتجر',       type: 'text',   placeholder: 'اختر المتجر' },
              { label: 'تاريخ البداية',    type: 'date',   placeholder: '' },
              { label: 'تاريخ الانتهاء',   type: 'date',   placeholder: '' },
              { label: 'الميزانية (ريال)', type: 'number', placeholder: '500' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">موضع الإعلان</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all">
                <option value="hero">الصفحة الرئيسية</option>
                <option value="banner">شريط علوي</option>
                <option value="sidebar">الشريط الجانبي</option>
                <option value="category">صفحة التصنيف</option>
              </select>
            </div>
          </div>
          <div className="p-5 border-t border-gray-100 flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              إلغاء
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 bg-[#16A34A] text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
              نشر الإعلان
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function AdsPage() {
  const [tab,      setTab]      = useState('')
  const [showNew,  setShowNew]  = useState(false)

  const filtered  = MOCK_ADS.filter(a => !tab || a.status === tab)
  const totalImp  = MOCK_ADS.reduce((s, a) => s + a.impressions, 0)
  const totalClk  = MOCK_ADS.reduce((s, a) => s + a.clicks, 0)
  const ctr       = totalImp > 0 ? ((totalClk / totalImp) * 100).toFixed(1) : '0'
  const activeAds = MOCK_ADS.filter(a => a.status === 'active').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الإعلانات</h1>
          <p className="text-sm text-gray-500 mt-0.5">حملات التسويق وإعلانات المتاجر</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> إعلان جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إعلانات نشطة',    value: activeAds,                     icon: Megaphone,       color: 'bg-green-50 text-green-700' },
          { label: 'إجمالي المشاهدات', value: totalImp.toLocaleString('ar-SA'), icon: Eye,          color: 'bg-blue-50 text-blue-700' },
          { label: 'إجمالي النقرات',   value: totalClk.toLocaleString('ar-SA'), icon: MousePointerClick, color: 'bg-violet-50 text-violet-700' },
          { label: 'نسبة النقر (CTR)', value: `${ctr}%`,                    icon: TrendingUp,      color: 'bg-amber-50 text-amber-700' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-1 p-4 border-b border-gray-50 bg-gray-50/40">
          {[
            { v: '',         l: 'الكل' },
            { v: 'active',   l: 'نشط' },
            { v: 'paused',   l: 'متوقف' },
            { v: 'pending',  l: 'قيد المراجعة' },
            { v: 'ended',    l: 'منتهي' },
          ].map(t => (
            <button key={t.v} onClick={() => setTab(t.v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${tab === t.v ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t.l}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 bg-gray-50/60">
                {['الإعلان', 'المتجر', 'الموضع', 'المشاهدات', 'النقرات', 'CTR', 'الفترة', 'الحالة', ''].map(h => (
                  <th key={h} className="text-right px-5 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(ad => {
                const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : '0'
                const pm = PLACEMENT_META[ad.placement]
                return (
                  <tr key={ad.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                          <Image className="w-4 h-4 text-white" />
                        </div>
                        <p className="font-semibold text-gray-900 text-xs">{ad.title}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Store className="w-3.5 h-3.5 text-gray-400" /> {ad.store}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-semibold ${pm.color}`}>
                        {pm.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-700 text-xs">{ad.impressions.toLocaleString('ar-SA')}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-700 text-xs">{ad.clicks.toLocaleString('ar-SA')}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold ${Number(ctr) >= 5 ? 'text-green-600' : Number(ctr) >= 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                        {ctr}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {ad.start} → {ad.end}
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={ad.status} /></td>
                    <td className="px-5 py-3.5">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <Megaphone className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">لا توجد إعلانات مطابقة</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showNew && <NewAdModal onClose={() => setShowNew(false)} />}
    </div>
  )
}
