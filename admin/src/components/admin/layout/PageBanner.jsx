export default function PageBanner({ title, subtitle, icon: Icon, gradient, glow, badge }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden px-6 py-5 text-white"
      style={{ background: gradient }}
    >
      {/* Circles */}
      <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)` }} />
      <div className="absolute -bottom-6 right-10 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)` }} />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-extrabold leading-tight">{title}</h1>
            {subtitle && <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{subtitle}</p>}
          </div>
        </div>
        {badge && (
          <div className="hidden md:block px-4 py-2 rounded-xl text-sm font-bold"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
            {badge}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
    </div>
  )
}
