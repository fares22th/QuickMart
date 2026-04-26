import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Store, Truck, Bell, CreditCard, Shield, Save, Upload, ChevronLeft,
  MapPin, Phone, Mail, Clock, Globe, Eye, EyeOff, RefreshCw, Lock,
} from 'lucide-react'
import { getMyStore, updateStore } from '@/api/stores.api'

const TABS = [
  { id: 'store',    label: 'المتجر',        icon: Store },
  { id: 'delivery', label: 'التوصيل',       icon: Truck },
  { id: 'notifs',   label: 'الإشعارات',     icon: Bell },
  { id: 'payment',  label: 'الدفع',         icon: CreditCard },
  { id: 'security', label: 'الأمان',        icon: Shield },
]

function FieldGroup({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Input({ ...props }) {
  return (
    <input {...props}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all" />
  )
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${value ? 'bg-[#16A34A]' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${value ? 'translate-x-[22px] left-0.5' : 'left-0.5'}`} />
    </button>
  )
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

function StoreTab({ store }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    name:        store?.name ?? '',
    description: store?.description ?? '',
    phone:       store?.phone ?? '',
    city:        store?.city ?? '',
    category:    store?.category ?? '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateStore(store.id, form),
    onSuccess:  () => { toast.success('تم حفظ إعدادات المتجر'); qc.invalidateQueries({ queryKey: ['my-store'] }) },
    onError:    () => toast.error('فشل حفظ الإعدادات'),
  })

  return (
    <div className="space-y-5">
      {/* Cover */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-br from-slate-700 to-slate-900 relative">
          {store?.cover_url && <img src={store.cover_url} alt="" className="w-full h-full object-cover" />}
          <button className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-sm transition-colors">
            <Upload className="w-3.5 h-3.5" /> تغيير الغلاف
          </button>
        </div>
        <div className="px-5 pb-5">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden relative">
              {store?.logo_url
                ? <img src={store.logo_url} alt="" className="w-full h-full object-cover" />
                : <Store className="w-8 h-8 text-gray-300" />}
              <button className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                <Upload className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="pb-1">
              <p className="font-bold text-gray-900">{store?.name ?? 'متجري'}</p>
              <p className="text-xs text-gray-400">{store?.category ?? 'التصنيف'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <p className="font-bold text-gray-900 mb-2">معلومات المتجر</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup label="اسم المتجر">
            <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="اسم متجرك" />
          </FieldGroup>
          <FieldGroup label="تصنيف المتجر">
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all">
              <option value="">اختر التصنيف</option>
              {['بقالة وسوبرماركت','مطعم وكافيه','صيدلية','إلكترونيات','أزياء وملابس','منزل وأثاث'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </FieldGroup>
          <FieldGroup label="رقم الجوال">
            <Input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+966 5X XXX XXXX" />
          </FieldGroup>
          <FieldGroup label="المدينة">
            <Input value={form.city} onChange={e => set('city', e.target.value)} placeholder="الرياض" />
          </FieldGroup>
        </div>
        <FieldGroup label="وصف المتجر">
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
            placeholder="اكتب وصفاً جذاباً لمتجرك..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all" />
        </FieldGroup>
      </div>

      <button onClick={() => mutate()} disabled={isPending}
        className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
        {isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        حفظ التغييرات
      </button>
    </div>
  )
}

function DeliveryTab() {
  const [settings, setSettings] = useState({
    isOpen:      true,
    minOrder:    30,
    deliveryFee: 15,
    freeAbove:   200,
    etaMin:      20,
    etaMax:      45,
    zones:       true,
  })
  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }))

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-bold text-gray-900 mb-1">حالة المتجر</p>
        <SettingRow label="المتجر مفتوح" desc="السماح بالطلبات الآن">
          <Toggle value={settings.isOpen} onChange={v => set('isOpen', v)} />
        </SettingRow>
        <SettingRow label="توصيل مجاني فوق مبلغ معين" desc="حدد مبلغ الشراء للتوصيل المجاني">
          <Toggle value={settings.zones} onChange={v => set('zones', v)} />
        </SettingRow>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <p className="font-bold text-gray-900 mb-1">إعدادات التوصيل</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'الحد الأدنى للطلب (ر.س)', key: 'minOrder', min: 0 },
            { label: 'رسوم التوصيل (ر.س)',      key: 'deliveryFee', min: 0 },
            { label: 'توصيل مجاني فوق (ر.س)',   key: 'freeAbove', min: 0 },
          ].map(f => (
            <FieldGroup key={f.key} label={f.label}>
              <input type="number" min={f.min} value={settings[f.key]}
                onChange={e => set(f.key, Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all" />
            </FieldGroup>
          ))}
          <FieldGroup label="وقت التوصيل المتوقع (دقيقة)">
            <div className="flex items-center gap-2">
              <input type="number" min={5} value={settings.etaMin} onChange={e => set('etaMin', Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all" />
              <span className="text-gray-400 text-xs shrink-0">إلى</span>
              <input type="number" min={5} value={settings.etaMax} onChange={e => set('etaMax', Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all" />
            </div>
          </FieldGroup>
        </div>
      </div>

      <button onClick={() => toast.success('تم حفظ إعدادات التوصيل')}
        className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
        <Save className="w-4 h-4" /> حفظ التغييرات
      </button>
    </div>
  )
}

function NotifsTab() {
  const [s, setS] = useState({
    newOrder: true, orderStatus: true, lowStock: true,
    newReview: true, payment: true, promotion: false,
  })
  const toggle = k => setS(x => ({ ...x, [k]: !x[k] }))
  const rows = [
    { k: 'newOrder',     l: 'طلب جديد',            d: 'إشعار فوري عند كل طلب' },
    { k: 'orderStatus',  l: 'تغيير حالة الطلب',    d: 'عندما يتغير وضع أحد طلباتك' },
    { k: 'lowStock',     l: 'مخزون منخفض',          d: 'عند وصول المخزون للحد الأدنى' },
    { k: 'newReview',    l: 'تقييم جديد',           d: 'عند كتابة عميل تقييماً' },
    { k: 'payment',      l: 'تحويل مبلغ',           d: 'عند تحويل الإيرادات الأسبوعية' },
    { k: 'promotion',    l: 'رسائل ترويجية',         d: 'نصائح وعروض من فريق QuickMart' },
  ]
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-bold text-gray-900 mb-1">إشعارات التطبيق</p>
        {rows.map(r => (
          <SettingRow key={r.k} label={r.l} desc={r.d}>
            <Toggle value={s[r.k]} onChange={() => toggle(r.k)} />
          </SettingRow>
        ))}
      </div>
      <button onClick={() => toast.success('تم حفظ إعدادات الإشعارات')}
        className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
        <Save className="w-4 h-4" /> حفظ
      </button>
    </div>
  )
}

function PaymentTab() {
  const [s, setS] = useState({ stcpay: true, mada: true, visa: true, cash: true, tabby: false })
  const toggle = k => setS(x => ({ ...x, [k]: !x[k] }))
  const methods = [
    { k: 'stcpay', l: 'STC Pay',      d: 'دفع إلكتروني' },
    { k: 'mada',   l: 'مدى',          d: 'بطاقات مدى المحلية' },
    { k: 'visa',   l: 'Visa / MC',    d: 'بطاقات ائتمان دولية' },
    { k: 'cash',   l: 'الدفع عند الاستلام', d: 'كاش أو بطاقة عند التوصيل' },
    { k: 'tabby',  l: 'Tabby',        d: 'الدفع لاحقاً بالتقسيط' },
  ]
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-bold text-gray-900 mb-1">طرق الدفع المقبولة</p>
        <p className="text-xs text-gray-400 mb-3">فعّل طرق الدفع التي تريد قبولها</p>
        {methods.map(m => (
          <SettingRow key={m.k} label={m.l} desc={m.d}>
            <Toggle value={s[m.k]} onChange={() => toggle(m.k)} />
          </SettingRow>
        ))}
      </div>
      <button onClick={() => toast.success('تم حفظ إعدادات الدفع')}
        className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
        <Save className="w-4 h-4" /> حفظ
      </button>
    </div>
  )
}

function SecurityTab() {
  const [show, setShow] = useState(false)
  const [twoFa, setTwoFa] = useState(false)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-bold text-gray-900 mb-4">تغيير كلمة المرور</p>
        <div className="space-y-3">
          <FieldGroup label="كلمة المرور الحالية">
            <div className="relative">
              <input type={show ? 'text' : 'password'} placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all" />
              <button onClick={() => setShow(!show)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FieldGroup>
          <FieldGroup label="كلمة المرور الجديدة">
            <Input type="password" placeholder="••••••••" />
          </FieldGroup>
          <FieldGroup label="تأكيد كلمة المرور">
            <Input type="password" placeholder="••••••••" />
          </FieldGroup>
          <button onClick={() => toast.success('تم تغيير كلمة المرور')}
            className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            <Lock className="w-4 h-4" /> تغيير كلمة المرور
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-bold text-gray-900 mb-1">المصادقة الثنائية</p>
        <SettingRow label="تفعيل المصادقة الثنائية (2FA)" desc="حماية إضافية لحسابك عند تسجيل الدخول">
          <Toggle value={twoFa} onChange={setTwoFa} />
        </SettingRow>
      </div>
    </div>
  )
}

const TAB_CONTENT = {
  store:    StoreTab,
  delivery: DeliveryTab,
  notifs:   NotifsTab,
  payment:  PaymentTab,
  security: SecurityTab,
}

export default function SellerSettingsPage() {
  const [activeTab, setActiveTab] = useState('store')
  const Content = TAB_CONTENT[activeTab]

  const { data: store } = useQuery({ queryKey: ['my-store'], queryFn: getMyStore, retry: false })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إعدادات المتجر</h1>
        <p className="text-sm text-gray-500 mt-0.5">إدارة وتخصيص متجرك على QuickMart</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Nav */}
        <div className="w-48 shrink-0">
          <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 space-y-0.5">
            {TABS.map(t => {
              const Icon = t.icon
              const active = activeTab === t.id
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-[#16A34A] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  {t.label}
                  {active && <ChevronLeft className="w-3.5 h-3.5 mr-auto opacity-70" />}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Content store={store} />
        </div>
      </div>
    </div>
  )
}
