import { useState } from 'react'
import { AlertTriangle, CheckCircle, Clock, X, MessageSquare, Package, User, Store, ChevronDown, Search } from 'lucide-react'

const PRIORITY_META = {
  high:   { label: 'عالي',  color: 'bg-red-50 text-red-700 ring-red-200' },
  medium: { label: 'متوسط', color: 'bg-amber-50 text-amber-700 ring-amber-200' },
  low:    { label: 'منخفض', color: 'bg-gray-100 text-gray-500 ring-gray-200' },
}

const STATUS_META = {
  open:       { label: 'مفتوح',      color: 'bg-red-50 text-red-700 ring-red-200',      dot: 'bg-red-500',    icon: AlertTriangle },
  pending:    { label: 'قيد البت',   color: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-500',  icon: Clock },
  resolved:   { label: 'محلول',      color: 'bg-green-50 text-green-700 ring-green-200', dot: 'bg-green-500',  icon: CheckCircle },
  closed:     { label: 'مغلق',       color: 'bg-gray-100 text-gray-500 ring-gray-200',   dot: 'bg-gray-400',   icon: X },
}

const MOCK_DISPUTES = [
  { id: 'D-1001', customer: 'أحمد الزبون',   store: 'متجر النور',      issue: 'المنتج لم يصل',       priority: 'high',   status: 'open',     order: '#4829', created: '2026-04-22', messages: 3 },
  { id: 'D-1002', customer: 'سارة المحمدي',  store: 'بقالة الأمين',   issue: 'منتج تالف',            priority: 'high',   status: 'pending',  order: '#4801', created: '2026-04-20', messages: 7 },
  { id: 'D-1003', customer: 'محمد العمري',   store: 'سوبرماركت الفرح', issue: 'مغايرة للوصف',         priority: 'medium', status: 'resolved', order: '#4755', created: '2026-04-18', messages: 12 },
  { id: 'D-1004', customer: 'نورة القحطاني', store: 'هايبر العائلة',  issue: 'تأخر في التوصيل',      priority: 'low',    status: 'resolved', order: '#4710', created: '2026-04-15', messages: 5 },
  { id: 'D-1005', customer: 'عبدالله الغامدي',store: 'متجر البركة',   issue: 'طلب استرداد المبلغ',   priority: 'high',   status: 'open',     order: '#4692', created: '2026-04-14', messages: 2 },
  { id: 'D-1006', customer: 'ريم الشهري',    store: 'ماركت الجوار',   issue: 'كمية ناقصة',           priority: 'medium', status: 'closed',   order: '#4650', created: '2026-04-10', messages: 9 },
]

function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.open
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${m.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  )
}

function DisputeDrawer({ dispute, onClose }) {
  const [reply, setReply] = useState('')
  if (!dispute) return null
  const pm = PRIORITY_META[dispute.priority]
  const sm = STATUS_META[dispute.status]

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 left-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">تفاصيل النزاع</h3>
            <p className="text-xs text-gray-400 mt-0.5">{dispute.id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Issue */}
          <div className={`p-4 rounded-2xl border-r-4 ${dispute.priority === 'high' ? 'bg-red-50 border-red-500' : dispute.priority === 'medium' ? 'bg-amber-50 border-amber-400' : 'bg-gray-50 border-gray-300'}`}>
            <p className="font-bold text-gray-900">{dispute.issue}</p>
            <p className="text-xs text-gray-500 mt-1">طلب رقم {dispute.order} · {dispute.created}</p>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1"><User className="w-3 h-3" /> العميل</div>
              <p className="font-semibold text-gray-800 text-sm">{dispute.customer}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1"><Store className="w-3 h-3" /> المتجر</div>
              <p className="font-semibold text-gray-800 text-sm">{dispute.store}</p>
            </div>
          </div>

          {/* Status + Priority */}
          <div className="flex items-center gap-3">
            <StatusBadge status={dispute.status} />
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${pm.color}`}>
              {pm.label}
            </span>
          </div>

          {/* Timeline (mock) */}
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-3">سجل المحادثة ({dispute.messages} رسائل)</p>
            <div className="space-y-3">
              {[
                { from: dispute.customer, msg: 'لم أستلم طلبي حتى الآن رغم مرور ٣ أيام على موعد التسليم.', time: '10:30', mine: false },
                { from: dispute.store,    msg: 'نعتذر عن التأخير، الطلب تم شحنه ويمكنك تتبعه عبر الرابط.', time: '11:15', mine: false },
                { from: 'الإدارة',        msg: 'نحن نتابع الأمر وسيتم الحل خلال ٢٤ ساعة.', time: '12:00', mine: true },
              ].map((m, i) => (
                <div key={i} className={`flex ${m.mine ? 'flex-row-reverse' : ''} gap-2`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${m.mine ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {m.from[0]}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${m.mine ? 'bg-green-500 text-white rounded-tr-sm' : 'bg-gray-50 text-gray-700 rounded-tl-sm'}`}>
                    <p className="font-semibold mb-0.5 opacity-70">{m.from}</p>
                    <p>{m.msg}</p>
                    <p className={`text-[10px] mt-1 opacity-60 text-left`}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Box */}
          <div className="mt-2">
            <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3}
              placeholder="اكتب رداً للطرفين..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all" />
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 grid grid-cols-2 gap-2">
          <button onClick={onClose} className="py-2.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-sm font-semibold transition-colors">
            حل النزاع
          </button>
          <button onClick={onClose} className="py-2.5 bg-[#16A34A] text-white hover:bg-green-700 rounded-xl text-sm font-semibold transition-colors">
            إرسال الرد
          </button>
        </div>
      </div>
    </>
  )
}

const TABS = [
  { v: '',         l: 'الكل' },
  { v: 'open',     l: 'مفتوح' },
  { v: 'pending',  l: 'قيد البت' },
  { v: 'resolved', l: 'محلول' },
  { v: 'closed',   l: 'مغلق' },
]

export default function DisputesPage() {
  const [tab,      setTab]      = useState('')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = MOCK_DISPUTES.filter(d =>
    (!tab    || d.status === tab) &&
    (!search || d.customer.includes(search) || d.store.includes(search) || d.id.includes(search))
  )

  const open     = MOCK_DISPUTES.filter(d => d.status === 'open').length
  const pending  = MOCK_DISPUTES.filter(d => d.status === 'pending').length
  const resolved = MOCK_DISPUTES.filter(d => d.status === 'resolved').length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">النزاعات والشكاوى</h1>
          <p className="text-sm text-gray-500 mt-0.5">إدارة النزاعات بين العملاء والمتاجر</p>
        </div>
        {open > 0 && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold ring-1 ring-red-200">
            <AlertTriangle className="w-4 h-4" />
            {open} نزاع مفتوح
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'مفتوح',    value: open,                        color: open > 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-500' },
          { label: 'قيد البت', value: pending,                     color: pending > 0 ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-500' },
          { label: 'محلول',   value: resolved,                    color: 'bg-green-50 text-green-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border border-gray-100 shadow-sm p-4 text-center ${s.color}`}>
            <p className="text-3xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-1 opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 border-b border-gray-50">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {TABS.map(t => (
              <button key={t.v} onClick={() => setTab(t.v)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${tab === t.v ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {t.l}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث برقم النزاع أو اسم العميل..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pr-9 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 bg-gray-50/60">
                {['رقم النزاع', 'العميل', 'المتجر', 'المشكلة', 'الأولوية', 'الرسائل', 'التاريخ', 'الحالة', ''].map(h => (
                  <th key={h} className="text-right px-5 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(d => {
                const pm = PRIORITY_META[d.priority]
                return (
                  <tr key={d.id} onClick={() => setSelected(d)} className="hover:bg-gray-50/70 transition-colors cursor-pointer">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-gray-600">{d.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                          {d.customer[0]}
                        </div>
                        <span className="font-medium text-gray-800 text-xs">{d.customer}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{d.store}</td>
                    <td className="px-5 py-3.5 text-gray-700 text-xs max-w-[160px] truncate">{d.issue}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${pm.color}`}>
                        {pm.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MessageSquare className="w-3.5 h-3.5 text-gray-400" /> {d.messages}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{d.created}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={d.status} /></td>
                    <td className="px-5 py-3.5 text-green-600 text-xs font-semibold">عرض</td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">لا توجد نزاعات مطابقة</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <DisputeDrawer dispute={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
