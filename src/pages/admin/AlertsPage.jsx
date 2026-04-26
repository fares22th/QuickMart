import { useState } from 'react'
import { Bell, AlertTriangle, Info, CheckCircle, XCircle, Star, Flag, ShieldAlert, Package, User, Store, Check, X } from 'lucide-react'

const TYPE_META = {
  warning:  { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50',  border: 'border-amber-200', label: 'تحذير' },
  error:    { icon: XCircle,       color: 'text-red-500',   bg: 'bg-red-50',    border: 'border-red-200',   label: 'خطأ' },
  info:     { icon: Info,          color: 'text-blue-500',  bg: 'bg-blue-50',   border: 'border-blue-200',  label: 'معلومة' },
  success:  { icon: CheckCircle,   color: 'text-green-500', bg: 'bg-green-50',  border: 'border-green-200', label: 'ناجح' },
  review:   { icon: Star,          color: 'text-violet-500',bg: 'bg-violet-50', border: 'border-violet-200',label: 'تقييم' },
  report:   { icon: Flag,          color: 'text-rose-500',  bg: 'bg-rose-50',   border: 'border-rose-200',  label: 'بلاغ' },
  security: { icon: ShieldAlert,   color: 'text-orange-500',bg: 'bg-orange-50', border: 'border-orange-200',label: 'أمان' },
}

const MOCK_ALERTS = [
  { id: '1', type: 'security', title: 'محاولة دخول مشبوهة',          body: '٥ محاولات دخول فاشلة لحساب admin@quickmart.sa من IP: 185.220.101.45',                  time: 'منذ ٥ دقائق',   read: false, entity: 'نظام الأمان' },
  { id: '2', type: 'error',    title: 'فشل معالجة دفعة',              body: 'فشل تحصيل عمولة متجر النور بقيمة ٣,٨٦٠ ر.س. خطأ في بوابة الدفع.',                    time: 'منذ ٢٠ دقيقة',  read: false, entity: 'العمولات' },
  { id: '3', type: 'review',   title: 'تقييم سلبي يحتاج مراجعة',     body: 'ترك أحمد الزبون تقييم ١ نجمة لمتجر بقالة الأمين: "منتج فاسد وتوصيل متأخر جداً".',     time: 'منذ ٤٥ دقيقة',  read: false, entity: 'التقييمات' },
  { id: '4', type: 'report',   title: 'بلاغ على منتج',               body: 'أفاد ٣ مستخدمين أن منتج "عصير برتقال طازج" في متجر هايبر العائلة يحتوي على صور مضللة.', time: 'منذ ساعة',       read: false, entity: 'المنتجات' },
  { id: '5', type: 'warning',  title: 'مخزون منخفض جداً',            body: 'تجاوز ١٢ منتجاً حد التنبيه الأدنى للمخزون. يُنصح بإشعار المتاجر المعنية.',            time: 'منذ ٢ ساعة',     read: true,  entity: 'المخزون' },
  { id: '6', type: 'info',     title: 'متجر جديد بانتظار الموافقة',  body: 'قدّم "سوبر ماركت الأندلس" طلب تسجيل متجر جديد. يحتاج مراجعة.',                       time: 'منذ ٣ ساعات',    read: true,  entity: 'المتاجر' },
  { id: '7', type: 'review',   title: 'تقييمات وهمية محتملة',        body: 'رصد النظام ٨ تقييمات ٥ نجوم لمتجر البركة في أقل من ساعة. قد تكون غير حقيقية.',         time: 'منذ ٥ ساعات',    read: true,  entity: 'التقييمات' },
  { id: '8', type: 'success',  title: 'اكتملت النسخة الاحتياطية',    body: 'تمت النسخة الاحتياطية اليومية لقاعدة البيانات بنجاح. الحجم: ٢.٤ جيجابايت.',           time: 'منذ ٦ ساعات',    read: true,  entity: 'النظام' },
  { id: '9', type: 'security', title: 'حساب عميل موقوف تلقائياً',    body: 'تم إيقاف حساب user@example.com تلقائياً بسبب نشاط غير اعتيادي.',                       time: 'منذ ٨ ساعات',    read: true,  entity: 'نظام الأمان' },
]

const TABS = [
  { v: '',          l: 'الكل' },
  { v: 'unread',    l: 'غير مقروء' },
  { v: 'security',  l: 'أمان' },
  { v: 'review',    l: 'تقييمات' },
  { v: 'report',    l: 'بلاغات' },
  { v: 'warning',   l: 'تحذيرات' },
]

function AlertCard({ alert, onRead, onDismiss }) {
  const m = TYPE_META[alert.type] ?? TYPE_META.info
  const Icon = m.icon

  return (
    <div className={`relative bg-white rounded-2xl border shadow-sm p-4 transition-all duration-200 ${alert.read ? 'border-gray-100 opacity-70' : `border-gray-100 ${m.border} ring-1`}`}>
      <div className="flex items-start gap-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${m.bg}`}>
          <Icon className={`w-5 h-5 ${m.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                {!alert.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                <p className={`font-semibold text-sm ${alert.read ? 'text-gray-600' : 'text-gray-900'}`}>{alert.title}</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{alert.body}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${m.bg} ${m.color}`}>{m.label}</span>
                <span className="text-[10px] text-gray-400">{alert.entity}</span>
                <span className="text-[10px] text-gray-400">·</span>
                <span className="text-[10px] text-gray-400">{alert.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {!alert.read && (
                <button onClick={() => onRead(alert.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" title="تعليم كمقروء">
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={() => onDismiss(alert.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" title="رفض">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AlertsPage() {
  const [tab,    setTab]    = useState('')
  const [alerts, setAlerts] = useState(MOCK_ALERTS)

  const markRead    = id => setAlerts(a => a.map(x => x.id === id ? { ...x, read: true } : x))
  const dismiss     = id => setAlerts(a => a.filter(x => x.id !== id))
  const markAllRead = ()  => setAlerts(a => a.map(x => ({ ...x, read: true })))

  const filtered = alerts.filter(a => {
    if (tab === 'unread') return !a.read
    if (tab) return a.type === tab
    return true
  })

  const unread = alerts.filter(a => !a.read).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التنبيهات والبلاغات</h1>
          <p className="text-sm text-gray-500 mt-0.5">مراقبة أحداث المنصة والتقارير</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Check className="w-4 h-4" /> تعليم الكل كمقروء ({unread})
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'غير مقروءة',      value: unread,                                               color: unread > 0 ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-400',  icon: Bell },
          { label: 'تنبيهات أمان',    value: alerts.filter(a => a.type === 'security').length,     color: 'bg-orange-50 text-orange-700', icon: ShieldAlert },
          { label: 'تقييمات معلقة',   value: alerts.filter(a => a.type === 'review').length,      color: 'bg-violet-50 text-violet-700', icon: Star },
          { label: 'بلاغات نشطة',    value: alerts.filter(a => a.type === 'report').length,      color: 'bg-rose-50 text-rose-700',     icon: Flag },
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

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm overflow-x-auto">
        {TABS.map(t => (
          <button key={t.v} onClick={() => setTab(t.v)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${tab === t.v ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            {t.l}
            {t.v === 'unread' && unread > 0 && (
              <span className="mr-1.5 bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{unread}</span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.length > 0
          ? filtered.map(a => <AlertCard key={a.id} alert={a} onRead={markRead} onDismiss={dismiss} />)
          : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
              <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">لا توجد تنبيهات</p>
              <p className="text-gray-300 text-xs mt-1">كل شيء يعمل بشكل طبيعي</p>
            </div>
          )
        }
      </div>
    </div>
  )
}
