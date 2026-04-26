import { useState } from 'react'
import { toast } from 'sonner'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { DollarSign, Clock, CheckCircle, ArrowDownCircle, Download, TrendingUp, CreditCard, Banknote, ArrowUpRight, Wallet } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'

const MOCK_TRANSACTIONS = [
  { id: 'T-001', type: 'credit',  description: 'إيرادات الطلبات — أسبوع ١٨',    amount: 3240,  date: '2026-04-20', status: 'completed', method: 'تحويل بنكي' },
  { id: 'T-002', type: 'debit',   description: 'عمولة المنصة ٨٪',              amount: 259,   date: '2026-04-20', status: 'completed', method: 'خصم تلقائي' },
  { id: 'T-003', type: 'credit',  description: 'إيرادات الطلبات — أسبوع ١٧',    amount: 2840,  date: '2026-04-13', status: 'completed', method: 'تحويل بنكي' },
  { id: 'T-004', type: 'debit',   description: 'عمولة المنصة ٨٪',              amount: 227,   date: '2026-04-13', status: 'completed', method: 'خصم تلقائي' },
  { id: 'T-005', type: 'credit',  description: 'إيرادات الطلبات — أسبوع ١٦',    amount: 2120,  date: '2026-04-06', status: 'completed', method: 'تحويل بنكي' },
  { id: 'T-006', type: 'debit',   description: 'استرداد طلب #4820',            amount: 85,    date: '2026-04-05', status: 'completed', method: 'استرداد' },
  { id: 'T-007', type: 'credit',  description: 'إيرادات الطلبات — أسبوع ١٥',    amount: 1980,  date: '2026-03-30', status: 'completed', method: 'تحويل بنكي' },
  { id: 'T-008', type: 'pending', description: 'إيرادات الأسبوع الحالي',        amount: 1640,  date: '2026-04-25', status: 'pending',   method: 'تحت المعالجة' },
]

const MOCK_TREND = [
  { week: 'أسبوع ١٢', revenue: 1820, commission: 146 },
  { week: 'أسبوع ١٣', revenue: 2200, commission: 176 },
  { week: 'أسبوع ١٤', revenue: 1650, commission: 132 },
  { week: 'أسبوع ١٥', revenue: 1980, commission: 158 },
  { week: 'أسبوع ١٦', revenue: 2120, commission: 170 },
  { week: 'أسبوع ١٧', revenue: 2840, commission: 227 },
  { week: 'أسبوع ١٨', revenue: 3240, commission: 259 },
]

const PIE_DATA = [
  { name: 'صافي الإيرادات', value: 82, color: '#16A34A' },
  { name: 'عمولة المنصة',   value: 8,  color: '#6366F1' },
  { name: 'رسوم التوصيل',   value: 5,  color: '#F59E0B' },
  { name: 'ضرائب',           value: 5,  color: '#EC4899' },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-3">
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="font-bold text-gray-800">{formatPrice(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function SellerPaymentsPage() {
  const [tab, setTab] = useState('all')

  const credits  = MOCK_TRANSACTIONS.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const debits   = MOCK_TRANSACTIONS.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
  const pending  = MOCK_TRANSACTIONS.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0)
  const balance  = credits - debits - pending

  const filtered = MOCK_TRANSACTIONS.filter(t => tab === 'all' || t.type === tab || (tab === 'pending' && t.status === 'pending'))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المدفوعات والإيرادات</h1>
          <p className="text-sm text-gray-500 mt-0.5">متابعة أرباحك والمعاملات المالية</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" /> تصدير كشف الحساب
        </button>
      </div>

      {/* Wallet Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-slate-800 to-[#0F172A] rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-white/40" />
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">الرصيد المتاح</p>
            </div>
            <p className="text-4xl font-black text-white">{formatPrice(balance)}</p>
            <p className="text-white/40 text-xs mt-1">يُحدَّث كل أسبوع يوم الأحد</p>
          </div>
          <button onClick={() => toast.success('تم إرسال طلب السحب!')}
            className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-600 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-green-900/30">
            <ArrowDownCircle className="w-4 h-4" /> طلب سحب
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5 border-t border-white/5 pt-5">
          {[
            { label: 'إجمالي الإيرادات', value: formatPrice(credits),  icon: TrendingUp,   color: 'text-green-400' },
            { label: 'في الانتظار',       value: formatPrice(pending),  icon: Clock,        color: 'text-amber-400' },
            { label: 'العمولات المخصومة', value: formatPrice(debits),   icon: CreditCard,   color: 'text-red-400' },
          ].map(s => (
            <div key={s.label}>
              <s.icon className={`w-4 h-4 ${s.color} mb-1`} />
              <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
              <p className="text-white/30 text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-900 mb-1">الإيرادات الأسبوعية</p>
          <p className="text-xs text-gray-400 mb-4">مقارنة الإيرادات والعمولات</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={MOCK_TREND} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#16A34A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue"    name="الإيرادات"  stroke="#16A34A" strokeWidth={2} fill="url(#grev)" dot={false} />
              <Area type="monotone" dataKey="commission" name="العمولة"    stroke="#6366F1" strokeWidth={1.5} fill="none" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Split Pie */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-900 mb-1">توزيع الإيرادات</p>
          <p className="text-xs text-gray-400 mb-2">كيف تُوزَّع كل ١٠٠ ريال</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">
                {PIE_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}٪`, '']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {PIE_DATA.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="font-bold text-gray-700">{d.value}٪</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-50">
          <p className="font-semibold text-gray-800 text-sm">سجل المعاملات</p>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {[
              { v: 'all',     l: 'الكل' },
              { v: 'credit',  l: 'وارد' },
              { v: 'debit',   l: 'صادر' },
              { v: 'pending', l: 'معلق' },
            ].map(t => (
              <button key={t.v} onClick={() => setTab(t.v)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${tab === t.v ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {t.l}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 bg-gray-50/60">
                {['رقم المعاملة', 'الوصف', 'الطريقة', 'التاريخ', 'الحالة', 'المبلغ'].map(h => (
                  <th key={h} className="text-right px-5 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-gray-500">{t.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${t.type === 'credit' ? 'bg-green-50' : t.type === 'debit' ? 'bg-red-50' : 'bg-amber-50'}`}>
                        {t.type === 'credit'
                          ? <ArrowUpRight className="w-3.5 h-3.5 text-green-600" />
                          : t.type === 'debit'
                            ? <ArrowUpRight className="w-3.5 h-3.5 text-red-500 rotate-180" />
                            : <Clock className="w-3.5 h-3.5 text-amber-600" />}
                      </div>
                      <span className="text-xs font-medium text-gray-700">{t.description}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{t.method}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">{t.date}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ring-1
                      ${t.status === 'completed' ? 'bg-green-50 text-green-700 ring-green-200' : 'bg-amber-50 text-amber-700 ring-amber-200'}`}>
                      {t.status === 'completed' ? 'مكتمل' : 'معلق'}
                    </span>
                  </td>
                  <td className={`px-5 py-3.5 font-bold text-sm ${t.type === 'credit' ? 'text-green-700' : t.type === 'debit' ? 'text-red-600' : 'text-amber-700'}`}>
                    {t.type === 'credit' ? '+' : '-'}{formatPrice(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
