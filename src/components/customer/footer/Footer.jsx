import { Link } from 'react-router-dom'

const links = {
  'روابط سريعة': [
    { to: '/',           label: 'الرئيسية' },
    { to: '/search',     label: 'البحث' },
    { to: '/wishlist',   label: 'المفضلة' },
    { to: '/cart',       label: 'سلة التسوق' },
    { to: '/profile',    label: 'حسابي' },
  ],
  'للبائعين': [
    { to: '/seller',                  label: 'لوحة تحكم البائع' },
    { to: '/register/seller',         label: 'افتح متجرك مجاناً' },
    { to: '/seller/products',         label: 'إدارة المنتجات' },
    { to: '/seller/analytics',        label: 'التقارير والإحصائيات' },
  ],
  'المساعدة': [
    { to: '#', label: 'الأسئلة الشائعة' },
    { to: '#', label: 'سياسة الإرجاع' },
    { to: '#', label: 'تتبع الطلب' },
    { to: '#', label: 'تواصل معنا' },
  ],
}

const socials = [
  { name: 'تويتر', icon: '𝕏', href: '#' },
  { name: 'انستغرام', icon: '📸', href: '#' },
  { name: 'سناب', icon: '👻', href: '#' },
  { name: 'تيك توك', icon: '🎵', href: '#' },
]

export default function Footer() {
  return (
    <footer className="mt-20" style={{ background: '#0f172a' }}>
      {/* App download strip */}
      <div style={{ background: 'linear-gradient(135deg,#00C896,#00A878)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-bold text-xl mb-1">حمّل التطبيق الآن</p>
            <p className="text-white/75 text-sm">تجربة تسوق أسرع وأسهل من هاتفك</p>
          </div>
          <div className="flex gap-3">
            {[
              { icon: '🍎', label: 'App Store', sub: 'Download on the' },
              { icon: '🤖', label: 'Google Play', sub: 'Get it on' },
            ].map(a => (
              <a key={a.label} href="#"
                className="flex items-center gap-3 bg-white/15 backdrop-blur border border-white/20 rounded-2xl px-4 py-2.5 hover:bg-white/25 transition-colors">
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <p className="text-white/70 text-xs leading-none">{a.sub}</p>
                  <p className="text-white font-bold text-sm mt-0.5">{a.label}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#00C896,#00A878)' }}>
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 5h13M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">QuickMart</span>
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(148,163,184,1)' }}>
              منصة التسوق الأسرع في المملكة العربية السعودية — آلاف المنتجات من أقرب المتاجر إليك، بتوصيل خلال ٣٠ دقيقة.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(s => (
                <a key={s.name} href={s.href}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.06)' }} title={s.name}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-bold mb-4 text-sm">{section}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    <Link to={item.to}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: 'rgba(148,163,184,1)' }}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {[
            { val: '+٢٠٠', label: 'متجر شريك' },
            { val: '+٥٠ألف', label: 'عميل نشط' },
            { val: '٩٨٪', label: 'رضا العملاء' },
            { val: '٣٠ د', label: 'متوسط التوصيل' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-white">{s.val}</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(148,163,184,1)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-8 pt-6 border-t text-xs"
          style={{ borderColor: 'rgba(255,255,255,0.06)', color: 'rgba(100,116,139,1)' }}>
          <p>© {new Date().getFullYear()} QuickMart. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a>
            <a href="#" className="hover:text-white transition-colors">ملفات تعريف الارتباط</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
