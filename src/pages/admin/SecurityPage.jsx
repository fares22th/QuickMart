import { useState } from 'react'
import { ShieldCheck, ShieldAlert, Key, Activity, Lock, Unlock, Globe, Clock, Monitor, Smartphone, AlertTriangle, Check, X, Copy, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

const MOCK_SESSIONS = [
  { id: '1', device: 'Chrome على Windows 11', location: 'الرياض، المملكة العربية السعودية', ip: '37.10.115.22',  time: 'نشط الآن',        current: true,  icon: Monitor },
  { id: '2', device: 'Safari على iPhone 15',  location: 'جدة، المملكة العربية السعودية',    ip: '212.103.55.8', time: 'منذ ٢ ساعة',      current: false, icon: Smartphone },
  { id: '3', device: 'Firefox على macOS',     location: 'الدمام، المملكة العربية السعودية', ip: '95.216.99.11', time: 'منذ يوم واحد',     current: false, icon: Monitor },
]

const MOCK_LOGIN_LOGS = [
  { id: '1', user: 'admin@quickmart.sa', action: 'تسجيل دخول ناجح',    ip: '37.10.115.22',  location: 'الرياض',  status: 'success', time: '2026-04-24 09:12' },
  { id: '2', user: 'admin@quickmart.sa', action: 'تسجيل دخول ناجح',    ip: '212.103.55.8',  location: 'جدة',     status: 'success', time: '2026-04-24 07:30' },
  { id: '3', user: 'admin@quickmart.sa', action: 'محاولة دخول فاشلة',  ip: '185.220.101.45',location: 'ألمانيا', status: 'failed',  time: '2026-04-24 04:18' },
  { id: '4', user: 'admin@quickmart.sa', action: 'محاولة دخول فاشلة',  ip: '185.220.101.45',location: 'ألمانيا', status: 'failed',  time: '2026-04-24 04:17' },
  { id: '5', user: 'admin@quickmart.sa', action: 'محاولة دخول فاشلة',  ip: '185.220.101.45',location: 'ألمانيا', status: 'failed',  time: '2026-04-24 04:16' },
  { id: '6', user: 'admin@quickmart.sa', action: 'تغيير كلمة المرور',  ip: '37.10.115.22',  location: 'الرياض',  status: 'success', time: '2026-04-22 14:00' },
]

const MOCK_BLOCKED = [
  { ip: '185.220.101.45', reason: 'محاولات دخول متعددة فاشلة', blocked_at: '2026-04-24 04:19', country: 'DE' },
  { ip: '45.155.205.206', reason: 'نشاط مشبوه من روبوت',        blocked_at: '2026-04-20 11:33', country: 'RU' },
]

function ScoreRing({ score }) {
  const color = score >= 80 ? '#16A34A' : score >= 60 ? '#F59E0B' : '#EF4444'
  const r = 36; const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width={90} height={90} className="-rotate-90">
      <circle cx={45} cy={45} r={r} fill="none" stroke="#F3F4F6" strokeWidth={8} />
      <circle cx={45} cy={45} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      <text x={45} y={50} textAnchor="middle" dominantBaseline="middle"
        className="rotate-90 origin-center" style={{ fontSize: 18, fontWeight: 700, fill: color, transform: 'rotate(90deg) translateX(0px)' }}>
      </text>
    </svg>
  )
}

export default function SecurityPage() {
  const [showKey,       setShowKey]       = useState(false)
  const [twoFa,         setTwoFa]         = useState(true)
  const [ipWhitelist,   setIpWhitelist]   = useState(false)
  const [auditLog,      setAuditLog]      = useState(true)
  const [blocked,       setBlocked]       = useState(MOCK_BLOCKED)
  const [securityScore] = useState(78)

  const apiKey = 'sk_live_q1w2e3r4t5y6u7i8o9p0aAbBcCdDeEfF'

  const copyKey = () => { navigator.clipboard.writeText(apiKey); toast.success('تم نسخ المفتاح') }
  const revokeSession = id => toast.success('تم إنهاء الجلسة')
  const unblockIp = ip => { setBlocked(b => b.filter(x => x.ip !== ip)); toast.success(`تم إلغاء حظر ${ip}`) }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">مركز الأمان</h1>
        <p className="text-sm text-gray-500 mt-0.5">مراقبة وإدارة أمان المنصة</p>
      </div>

      {/* Security Score + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Score Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-[#0F172A] to-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="relative">
            <ScoreRing score={securityScore} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-black ${securityScore >= 80 ? 'text-green-400' : securityScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                {securityScore}
              </span>
            </div>
          </div>
          <div>
            <p className="text-white font-bold">درجة الأمان</p>
            <p className="text-slate-400 text-xs mt-0.5">
              {securityScore >= 80 ? 'ممتاز' : securityScore >= 60 ? 'جيد' : 'يحتاج تحسين'}
            </p>
            <p className="text-slate-500 text-[10px] mt-2">تفعيل المصادقة الثنائية لرفع الدرجة</p>
          </div>
        </div>

        {/* Quick Stats */}
        {[
          { label: 'جلسات نشطة',        value: MOCK_SESSIONS.length,       icon: Activity,    color: 'bg-blue-50 text-blue-700' },
          { label: 'محاولات فاشلة (اليوم)',  value: 3,                      icon: AlertTriangle,color: 'bg-red-50 text-red-700' },
          { label: 'عناوين IP محظورة',   value: blocked.length,             icon: Lock,        color: 'bg-orange-50 text-orange-700' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Security Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 2FA + Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-900 mb-4">إعدادات الأمان</p>
          <div className="space-y-0">
            {[
              { label: 'المصادقة الثنائية (2FA)',     desc: 'حماية الحساب بخطوة تحقق إضافية', val: twoFa,       set: setTwoFa,       good: true },
              { label: 'القائمة البيضاء للـ IP',      desc: 'تقييد الدخول بعناوين IP محددة',  val: ipWhitelist, set: setIpWhitelist, good: false },
              { label: 'سجل المراجعة (Audit Log)',   desc: 'تسجيل جميع إجراءات المدير',      val: auditLog,    set: setAuditLog,    good: true },
            ].map(s => (
              <div key={s.label} className="flex items-start justify-between gap-4 py-4 border-b border-gray-50 last:border-0">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800">{s.label}</p>
                    {s.val && s.good && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">مُفعَّل</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                </div>
                <button onClick={() => s.set(!s.val)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${s.val ? 'bg-[#16A34A]' : 'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${s.val ? 'translate-x-[22px] left-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* API Key */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-gray-900">مفاتيح API</p>
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> تجديد
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500">المفتاح الرئيسي</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowKey(!showKey)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button onClick={copyKey} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="font-mono text-xs text-gray-700 break-all">
              {showKey ? apiKey : '••••••••••••••••••••••••••••••••••••'}
            </p>
          </div>

          <div className="text-xs text-gray-400 space-y-1">
            <p>• استخدم المفتاح في ترويسة <code className="bg-gray-100 px-1 rounded">Authorization: Bearer</code></p>
            <p>• لا تشارك المفتاح أو تضعه في الكود المصدري العلني</p>
            <p>• تجديد المفتاح يُبطل جميع التكاملات الحالية</p>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-bold text-gray-900">الجلسات النشطة</p>
          <button onClick={() => toast.success('تم إنهاء جميع الجلسات الأخرى')}
            className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors">
            إنهاء كل الجلسات الأخرى
          </button>
        </div>
        <div className="space-y-3">
          {MOCK_SESSIONS.map(s => {
            const Icon = s.icon
            return (
              <div key={s.id} className={`flex items-center gap-4 p-3 rounded-xl ${s.current ? 'bg-green-50 ring-1 ring-green-200' : 'bg-gray-50'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.current ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <Icon className={`w-5 h-5 ${s.current ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800 truncate">{s.device}</p>
                    {s.current && <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">الحالية</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400"><Globe className="w-3 h-3" /> {s.location}</span>
                    <span className="text-[11px] text-gray-400">{s.ip}</span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400"><Clock className="w-3 h-3" /> {s.time}</span>
                  </div>
                </div>
                {!s.current && (
                  <button onClick={() => revokeSession(s.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Blocked IPs + Login Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Blocked IPs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-900 mb-4">عناوين IP المحظورة</p>
          {blocked.length > 0 ? (
            <div className="space-y-2">
              {blocked.map(b => (
                <div key={b.ip} className="flex items-start justify-between gap-3 p-3 bg-red-50 rounded-xl ring-1 ring-red-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-red-500" />
                      <span className="font-mono text-sm font-bold text-gray-800">{b.ip}</span>
                      <span className="text-xs text-gray-400">[{b.country}]</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 mr-5">{b.reason}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 mr-5">{b.blocked_at}</p>
                  </div>
                  <button onClick={() => unblockIp(b.ip)}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors shrink-0">
                    <Unlock className="w-3 h-3" /> رفع الحظر
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <ShieldCheck className="w-10 h-10 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">لا توجد عناوين محظورة</p>
            </div>
          )}
        </div>

        {/* Login History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-900 mb-4">سجل تسجيل الدخول</p>
          <div className="space-y-2">
            {MOCK_LOGIN_LOGS.map(l => (
              <div key={l.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${l.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {l.status === 'success'
                    ? <Check className="w-3.5 h-3.5 text-green-600" />
                    : <X className="w-3.5 h-3.5 text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">{l.action}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-400">{l.ip}</span>
                    <span className="text-[10px] text-gray-400">·</span>
                    <span className="text-[10px] text-gray-400">{l.location}</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">{l.time.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
