import { useState } from 'react'
import { Settings, Store, DollarSign, Bell, CreditCard, Globe, Save, ChevronLeft, Upload, ToggleLeft, ToggleRight } from 'lucide-react'
import { toast } from 'sonner'

const TABS = [
  { id: 'general',      label: 'عام',         icon: Settings },
  { id: 'commissions',  label: 'العمولات',    icon: DollarSign },
  { id: 'notifications',label: 'الإشعارات',   icon: Bell },
  { id: 'payment',      label: 'الدفع',       icon: CreditCard },
  { id: 'localization', label: 'اللغة والمنطقة', icon: Globe },
]

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-gray-50 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? 'bg-[#16A34A]' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${value ? 'left-5.5 translate-x-[22px]' : 'left-0.5'}`} />
    </button>
  )
}

function GeneralTab() {
  const [name,    setName]    = useState('QuickMart')
  const [tagline, setTagline] = useState('تسوق بسرعة، استلم بسرعة')
  const [email,   setEmail]   = useState('support@quickmart.sa')
  const [phone,   setPhone]   = useState('+966 50 000 0000')
  const [maintenance, setMaintenance] = useState(false)
  const [registration, setRegistration] = useState(true)

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-bold text-gray-900 mb-4">هوية المنصة</p>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Store className="w-8 h-8 text-white" />
          </div>
          <div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" /> رفع شعار جديد
            </button>
            <p className="text-xs text-gray-400 mt-1.5">PNG أو SVG · بحد أقصى ١ ميجابايت</p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-bold text-gray-900 mb-4">معلومات المنصة</p>
        <div className="space-y-4">
          {[
            { label: 'اسم المنصة',           value: name,    set: setName,    placeholder: 'QuickMart' },
            { label: 'الشعار الفرعي',         value: tagline, set: setTagline, placeholder: 'وصف قصير للمنصة' },
            { label: 'البريد الإلكتروني للدعم', value: email,   set: setEmail,   placeholder: 'support@...' },
            { label: 'رقم التواصل',           value: phone,   set: setPhone,   placeholder: '+966 5X...' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{f.label}</label>
              <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-bold text-gray-900 mb-1">حالة المنصة</p>
        <SettingRow label="وضع الصيانة" description="إيقاف المنصة مؤقتاً للزوار مع عرض رسالة صيانة">
          <Toggle value={maintenance} onChange={setMaintenance} />
        </SettingRow>
        <SettingRow label="التسجيل مفتوح" description="السماح بإنشاء حسابات جديدة للعملاء والبائعين">
          <Toggle value={registration} onChange={setRegistration} />
        </SettingRow>
      </div>

      <button onClick={() => toast.success('تم حفظ الإعدادات')}
        className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
        <Save className="w-4 h-4" /> حفظ التغييرات
      </button>
    </div>
  )
}

function CommissionsTab() {
  const [defaultRate, setDefaultRate] = useState(8)
  const [minOrder, setMinOrder]       = useState(20)
  const [minWithdraw, setMinWithdraw] = useState(200)

  const categories = [
    { name: 'البقالة والمواد الغذائية', rate: 8 },
    { name: 'الإلكترونيات',             rate: 5 },
    { name: 'الملابس والأزياء',          rate: 10 },
    { name: 'الصحة والجمال',             rate: 10 },
    { name: 'المنزل والمطبخ',           rate: 8 },
  ]
  const [catRates, setCatRates] = useState(Object.fromEntries(categories.map(c => [c.name, c.rate])))

  return (
    <div className="space-y-6">
      {/* Global */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-bold text-gray-900 mb-4">الإعدادات العامة</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'نسبة العمولة الافتراضية (%)', value: defaultRate, set: setDefaultRate, min: 1, max: 50 },
            { label: 'الحد الأدنى للطلب (ر.س)',     value: minOrder,    set: setMinOrder,    min: 0, max: 500 },
            { label: 'الحد الأدنى للسحب (ر.س)',     value: minWithdraw, set: setMinWithdraw, min: 0, max: 5000 },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{f.label}</label>
              <input type="number" min={f.min} max={f.max} value={f.value} onChange={e => f.set(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* Per category */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-bold text-gray-900 mb-1">نسب عمولة التصنيفات</p>
        <p className="text-xs text-gray-400 mb-4">تحديد نسبة عمولة خاصة لكل تصنيف</p>
        <div className="space-y-3">
          {categories.map(c => (
            <div key={c.name} className="flex items-center justify-between gap-4">
              <p className="text-sm text-gray-700 flex-1">{c.name}</p>
              <div className="flex items-center gap-2">
                <input type="number" min={1} max={50} value={catRates[c.name]}
                  onChange={e => setCatRates(r => ({ ...r, [c.name]: Number(e.target.value) }))}
                  className="w-16 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all" />
                <span className="text-sm text-gray-400">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => toast.success('تم حفظ إعدادات العمولات')}
        className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
        <Save className="w-4 h-4" /> حفظ التغييرات
      </button>
    </div>
  )
}

function NotificationsTab() {
  const [settings, setSettings] = useState({
    newOrder:      true,
    newStore:      true,
    lowStock:      true,
    newDispute:    true,
    dailyReport:   false,
    weeklyReport:  true,
    securityAlert: true,
    paymentFailed: true,
  })
  const toggle = k => setSettings(s => ({ ...s, [k]: !s[k] }))

  const rows = [
    { key: 'newOrder',      label: 'طلب جديد',                description: 'إشعار عند كل طلب جديد على المنصة' },
    { key: 'newStore',      label: 'متجر جديد للموافقة',      description: 'إشعار عند تقديم طلب تسجيل متجر' },
    { key: 'newDispute',    label: 'نزاع جديد',               description: 'إشعار عند فتح شكوى جديدة' },
    { key: 'lowStock',      label: 'مخزون منخفض',             description: 'إشعار عند وصول منتج للحد الأدنى' },
    { key: 'paymentFailed', label: 'فشل الدفع',               description: 'إشعار عند فشل أي عملية دفع' },
    { key: 'securityAlert', label: 'تنبيهات الأمان',          description: 'إشعار عند اكتشاف نشاط مشبوه' },
    { key: 'dailyReport',   label: 'تقرير يومي',              description: 'ملخص يومي بالطلبات والإيرادات' },
    { key: 'weeklyReport',  label: 'تقرير أسبوعي',            description: 'ملخص أسبوعي شامل بالأداء' },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-bold text-gray-900 mb-1">إشعارات البريد الإلكتروني</p>
        <p className="text-xs text-gray-400 mb-4">اختر الأحداث التي تريد إشعاراً بها</p>
        {rows.map(r => (
          <SettingRow key={r.key} label={r.label} description={r.description}>
            <Toggle value={settings[r.key]} onChange={() => toggle(r.key)} />
          </SettingRow>
        ))}
      </div>
      <button onClick={() => toast.success('تم حفظ إعدادات الإشعارات')}
        className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
        <Save className="w-4 h-4" /> حفظ التغييرات
      </button>
    </div>
  )
}

function PaymentTab() {
  const [gateways, setGateways] = useState({
    stcpay: true, mada: true, visa: true, tabby: false, tamara: false,
  })

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-bold text-gray-900 mb-1">بوابات الدفع</p>
        <p className="text-xs text-gray-400 mb-4">تفعيل أو تعطيل وسائل الدفع المتاحة</p>
        {[
          { key: 'stcpay', label: 'STC Pay',  desc: 'دفع رقمي عبر STC Pay' },
          { key: 'mada',   label: 'مدى',      desc: 'بطاقات مدى المحلية' },
          { key: 'visa',   label: 'Visa / Mastercard', desc: 'بطاقات الائتمان الدولية' },
          { key: 'tabby',  label: 'Tabby',    desc: 'الشراء الآن والدفع لاحقاً' },
          { key: 'tamara', label: 'Tamara',   desc: 'تقسيم الدفع على ٣ أشهر' },
        ].map(g => (
          <SettingRow key={g.key} label={g.label} description={g.desc}>
            <Toggle value={gateways[g.key]} onChange={() => setGateways(s => ({ ...s, [g.key]: !s[g.key] }))} />
          </SettingRow>
        ))}
      </div>
      <button onClick={() => toast.success('تم حفظ إعدادات الدفع')}
        className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
        <Save className="w-4 h-4" /> حفظ التغييرات
      </button>
    </div>
  )
}

function LocalizationTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-bold text-gray-900 mb-4">اللغة والمنطقة الزمنية</p>
        <div className="space-y-4">
          {[
            { label: 'اللغة الافتراضية',   options: ['العربية', 'English'] },
            { label: 'المنطقة الزمنية',    options: ['Asia/Riyadh (GMT+3)', 'UTC', 'America/New_York'] },
            { label: 'عملة العرض',          options: ['ريال سعودي (SAR)', 'دولار أمريكي (USD)'] },
            { label: 'تنسيق التاريخ',      options: ['DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY'] },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{f.label}</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all">
                {f.options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => toast.success('تم حفظ إعدادات المنطقة')}
        className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
        <Save className="w-4 h-4" /> حفظ التغييرات
      </button>
    </div>
  )
}

const TAB_CONTENT = {
  general:       GeneralTab,
  commissions:   CommissionsTab,
  notifications: NotificationsTab,
  payment:       PaymentTab,
  localization:  LocalizationTab,
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const Content = TAB_CONTENT[activeTab]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إعدادات المنصة</h1>
        <p className="text-sm text-gray-500 mt-0.5">تكوين وضبط إعدادات QuickMart</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Nav */}
        <div className="w-52 shrink-0">
          <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 space-y-0.5">
            {TABS.map(t => {
              const Icon = t.icon
              const active = activeTab === t.id
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-[#16A34A] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Icon className="w-4 h-4" />
                  {t.label}
                  {active && <ChevronLeft className="w-3.5 h-3.5 mr-auto opacity-70" />}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Content />
        </div>
      </div>
    </div>
  )
}
