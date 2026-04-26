import { useState } from 'react'
import { Search, Download, Plus, Bike, Star, Phone, MapPin, X, CheckCircle, PauseCircle, MoreVertical, Package } from 'lucide-react'

const STATUS_META = {
  active:     { label: 'نشط',         color: 'bg-green-50 text-green-700 ring-green-200',   dot: 'bg-green-500' },
  delivering: { label: 'يوصّل',       color: 'bg-blue-50 text-blue-700 ring-blue-200',      dot: 'bg-blue-500' },
  offline:    { label: 'غير متصل',    color: 'bg-gray-100 text-gray-500 ring-gray-200',     dot: 'bg-gray-400' },
  suspended:  { label: 'موقوف',       color: 'bg-red-50 text-red-700 ring-red-200',         dot: 'bg-red-500' },
}

const MOCK_DRIVERS = [
  { id: '1', name: 'علي الحارثي',    phone: '0501234567', city: 'الرياض',  vehicle: 'دراجة نارية', status: 'active',     orders: 248, rating: 4.9, joined: '2024-01-15' },
  { id: '2', name: 'محمد القحطاني',  phone: '0512345678', city: 'جدة',     vehicle: 'سيارة',       status: 'delivering', orders: 189, rating: 4.7, joined: '2024-02-20' },
  { id: '3', name: 'سالم الغامدي',   phone: '0523456789', city: 'الرياض',  vehicle: 'دراجة نارية', status: 'offline',    orders: 312, rating: 4.8, joined: '2023-11-10' },
  { id: '4', name: 'فهد العتيبي',    phone: '0534567890', city: 'الدمام',  vehicle: 'سيارة',       status: 'active',     orders: 156, rating: 4.6, joined: '2024-03-05' },
  { id: '5', name: 'خالد الدوسري',   phone: '0545678901', city: 'الرياض',  vehicle: 'دراجة هوائية',status: 'suspended',  orders: 78,  rating: 3.9, joined: '2024-04-01' },
  { id: '6', name: 'عبدالله الشهري', phone: '0556789012', city: 'مكة',     vehicle: 'دراجة نارية', status: 'active',     orders: 421, rating: 4.95,joined: '2023-09-20' },
  { id: '7', name: 'يوسف الزهراني',  phone: '0567890123', city: 'جدة',     vehicle: 'سيارة',       status: 'delivering', orders: 203, rating: 4.8, joined: '2024-01-30' },
  { id: '8', name: 'عمر البيشي',     phone: '0578901234', city: 'الطائف',  vehicle: 'دراجة نارية', status: 'offline',    orders: 134, rating: 4.5, joined: '2024-02-14' },
]

function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.offline
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${m.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  )
}

function DriverDrawer({ driver, onClose }) {
  if (!driver) return null
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 left-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">تفاصيل المندوب</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Profile */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {driver.name[0]}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{driver.name}</p>
              <StatusBadge status={driver.status} />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2">
            {[
              { icon: Phone,  label: 'الهاتف',    value: driver.phone },
              { icon: MapPin, label: 'المدينة',   value: driver.city },
              { icon: Bike,   label: 'المركبة',   value: driver.vehicle },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm shrink-0">
                  <Icon className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">{label}</p>
                  <p className="text-sm font-medium text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-blue-700">{driver.orders}</p>
              <p className="text-xs text-blue-500 mt-0.5">إجمالي التوصيلات</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-amber-700">{driver.rating}</p>
              <p className="text-xs text-amber-500 mt-0.5">التقييم</p>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button className="flex-1 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <PauseCircle className="w-4 h-4" /> إيقاف
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 bg-[#16A34A] text-white hover:bg-green-700 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" /> تفعيل
          </button>
        </div>
      </div>
    </>
  )
}

const TABS = [
  { value: '',           label: 'الكل' },
  { value: 'active',     label: 'نشط' },
  { value: 'delivering', label: 'يوصّل' },
  { value: 'offline',    label: 'غير متصل' },
  { value: 'suspended',  label: 'موقوف' },
]

export default function DriversPage() {
  const [tab,      setTab]      = useState('')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = MOCK_DRIVERS.filter(d =>
    (!tab    || d.status === tab) &&
    (!search || d.name.includes(search) || d.phone.includes(search))
  )

  const counts = {
    active:     MOCK_DRIVERS.filter(d => d.status === 'active').length,
    delivering: MOCK_DRIVERS.filter(d => d.status === 'delivering').length,
    offline:    MOCK_DRIVERS.filter(d => d.status === 'offline').length,
    suspended:  MOCK_DRIVERS.filter(d => d.status === 'suspended').length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المندوبين</h1>
          <p className="text-sm text-gray-500 mt-0.5">تتبع وإدارة فريق التوصيل</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> تصدير
          </button>
          <button className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> إضافة مندوب
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المندوبين', value: MOCK_DRIVERS.length,  color: 'bg-slate-50 text-slate-700' },
          { label: 'نشطون الآن',       value: counts.active,         color: 'bg-green-50 text-green-700' },
          { label: 'في التوصيل',       value: counts.delivering,     color: 'bg-blue-50 text-blue-700' },
          { label: 'موقوفون',          value: counts.suspended,      color: counts.suspended > 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-500' },
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
              <button key={t.value} onClick={() => setTab(t.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${tab === t.value ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو الهاتف..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pr-9 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 bg-gray-50/60">
                {['المندوب', 'الهاتف', 'المدينة', 'المركبة', 'الطلبات', 'التقييم', 'الحالة', ''].map(h => (
                  <th key={h} className="text-right px-5 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-gray-50/70 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {d.name[0]}
                      </div>
                      <p className="font-semibold text-gray-900">{d.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-sm">{d.phone}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" /> {d.city}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                      <Bike className="w-3 h-3 text-gray-400" /> {d.vehicle}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                      <Package className="w-3.5 h-3.5 text-gray-400" /> {d.orders}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {d.rating}
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge status={d.status} /></td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setSelected(d)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Bike className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">لا يوجد مندوبون مطابقون</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <DriverDrawer driver={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
