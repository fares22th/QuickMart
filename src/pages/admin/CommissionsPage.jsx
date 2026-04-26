import { useState } from 'react'
import { DollarSign, Clock, CheckCircle, Download, ChevronDown, Store, AlertCircle } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'

const MOCK_COMMISSIONS = [
  { store_id: '1', store_name: 'متجر النور',     total_sales: 48250,  commission_rate: 8,  commission_earned: 3860,  status: 'paid',    period: 'أبريل 2026' },
  { store_id: '2', store_name: 'بقالة الأمين',   total_sales: 32100,  commission_rate: 8,  commission_earned: 2568,  status: 'pending', period: 'أبريل 2026' },
  { store_id: '3', store_name: 'سوبرماركت الفرح',total_sales: 61800,  commission_rate: 10, commission_earned: 6180,  status: 'paid',    period: 'أبريل 2026' },
  { store_id: '4', store_name: 'هايبر العائلة',  total_sales: 29400,  commission_rate: 8,  commission_earned: 2352,  status: 'pending', period: 'أبريل 2026' },
  { store_id: '5', store_name: 'متجر البركة',    total_sales: 15800,  commission_rate: 8,  commission_earned: 1264,  status: 'overdue', period: 'مارس 2026' },
  { store_id: '6', store_name: 'ماركت الجوار',   total_sales: 22600,  commission_rate: 8,  commission_earned: 1808,  status: 'paid',    period: 'أبريل 2026' },
]

const STATUS_META = {
  paid:    { label: 'مدفوع',    color: 'bg-green-50 text-green-700 ring-green-200' },
  pending: { label: 'معلق',     color: 'bg-yellow-50 text-yellow-700 ring-yellow-200' },
  overdue: { label: 'متأخر',    color: 'bg-red-50 text-red-700 ring-red-200' },
}

function RateEditor({ rate, onSave }) {
  const [open, setOpen] = useState(false)
  const [val,  setVal]  = useState(rate)
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold text-gray-700 transition-colors">
        {val}% <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute top-9 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-10 min-w-[140px]">
          <p className="text-xs text-gray-400 mb-2 font-medium">نسبة العمولة</p>
          <div className="flex items-center gap-2">
            <input type="number" min="1" max="30" value={val} onChange={e => setVal(Number(e.target.value))}
              className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30" />
            <span className="text-sm text-gray-500">%</span>
          </div>
          <button onClick={() => { onSave(val); setOpen(false) }}
            className="mt-2 w-full py-1.5 bg-[#16A34A] text-white rounded-lg text-xs font-semibold">
            حفظ
          </button>
        </div>
      )}
    </div>
  )
}

export default function CommissionsPage() {
  const [filter, setFilter] = useState('')
  const [rates,  setRates]  = useState({ default: 8 })

  const totalEarned  = MOCK_COMMISSIONS.reduce((s, c) => s + c.commission_earned, 0)
  const totalPending = MOCK_COMMISSIONS.filter(c => c.status === 'pending').reduce((s, c) => s + c.commission_earned, 0)
  const totalPaid    = MOCK_COMMISSIONS.filter(c => c.status === 'paid').reduce((s, c) => s + c.commission_earned, 0)
  const overdue      = MOCK_COMMISSIONS.filter(c => c.status === 'overdue').length

  const filtered = MOCK_COMMISSIONS.filter(c => !filter || c.status === filter)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">العمولات والمدفوعات</h1>
          <p className="text-sm text-gray-500 mt-0.5">إدارة عمولات المتاجر ومتابعة المدفوعات</p>
        </div>
        <button className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Download className="w-4 h-4" /> تصدير التقرير
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي العمولات',    value: formatPrice(totalEarned),  icon: DollarSign,  color: 'bg-gradient-to-br from-green-500 to-emerald-600' },
          { label: 'تم تحصيله',          value: formatPrice(totalPaid),    icon: CheckCircle, color: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
          { label: 'في الانتظار',        value: formatPrice(totalPending), icon: Clock,       color: 'bg-gradient-to-br from-amber-500 to-orange-500' },
          { label: 'متأخر',              value: overdue,                   icon: AlertCircle, color: overdue > 0 ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-gray-400 to-gray-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} shrink-0`}>
              <s.icon className="w-5 h-5 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Commission Rate Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] to-slate-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-sm">نسبة العمولة الافتراضية للمنصة</p>
          <p className="text-slate-400 text-xs mt-0.5">تُطبَّق على جميع المتاجر التي لم تُحدَّد لها نسبة خاصة</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-black text-green-400">{rates.default}%</span>
          <RateEditor rate={rates.default} onSave={v => setRates(r => ({ ...r, default: v }))} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-50">
          <p className="font-semibold text-gray-800 text-sm">تفاصيل العمولات</p>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {[
              { v: '',         l: 'الكل' },
              { v: 'paid',     l: 'مدفوع' },
              { v: 'pending',  l: 'معلق' },
              { v: 'overdue',  l: 'متأخر' },
            ].map(t => (
              <button key={t.v} onClick={() => setFilter(t.v)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${filter === t.v ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {t.l}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 bg-gray-50/60">
                {['المتجر', 'الفترة', 'إجمالي المبيعات', 'نسبة العمولة', 'العمولة المستحقة', 'الحالة', 'إجراء'].map(h => (
                  <th key={h} className="text-right px-5 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => {
                const meta = STATUS_META[c.status]
                return (
                  <tr key={c.store_id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shrink-0">
                          <Store className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">{c.store_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{c.period}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-700">{formatPrice(c.total_sales)}</td>
                    <td className="px-5 py-3.5">
                      <RateEditor rate={c.commission_rate} onSave={() => {}} />
                    </td>
                    <td className="px-5 py-3.5 font-bold text-green-700">{formatPrice(c.commission_earned)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${meta.color}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {c.status !== 'paid' && (
                        <button className="px-3 py-1.5 bg-[#16A34A] text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors">
                          تحصيل
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
