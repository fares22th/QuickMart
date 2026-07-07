import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Bell, X, AlertTriangle, Info, CheckCircle } from 'lucide-react'
import { getAdminAlerts, dismissAlert } from '@/api/admin.api'
import EmptyState from '@/components/common/EmptyState'
import PageBanner from '@/components/admin/layout/PageBanner'
import { formatDate } from '@/utils/formatDate'

const LEVEL_CONFIG = {
  critical: { icon: AlertTriangle, color: 'border-red-500 bg-red-50',      iconColor: 'text-red-500' },
  warning:  { icon: AlertTriangle, color: 'border-orange-400 bg-orange-50', iconColor: 'text-orange-500' },
  info:     { icon: Info,          color: 'border-blue-400 bg-blue-50',     iconColor: 'text-blue-500' },
  success:  { icon: CheckCircle,   color: 'border-green-400 bg-green-50',   iconColor: 'text-green-600' },
}

function AlertCard({ alert, onDismiss }) {
  const cfg = LEVEL_CONFIG[alert.level] ?? LEVEL_CONFIG.info
  const Icon = cfg.icon

  return (
    <div className={`rounded-2xl p-4 border-r-4 ${cfg.color} flex items-start justify-between gap-3`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${cfg.iconColor}`} />
        <div>
          <p className="font-semibold text-gray-800 text-sm">{alert.title}</p>
          <p className="text-gray-600 text-sm mt-0.5">{alert.message}</p>
          <p className="text-xs text-gray-400 mt-1.5">{formatDate(alert.time)}</p>
        </div>
      </div>
      <button
        onClick={() => onDismiss(alert.id)}
        className="p-1 rounded-lg hover:bg-white/50 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

function AlertsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse h-20" />
      ))}
    </div>
  )
}

export default function AlertsPage() {
  const qc = useQueryClient()

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['admin-alerts'],
    queryFn:  getAdminAlerts,
    refetchInterval: 60_000,
  })

  const dismissMut = useMutation({
    mutationFn: dismissAlert,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-alerts'] }); toast.success('تم إخفاء التنبيه') },
  })

  const critical = alerts.filter(a => a.level === 'critical')
  const rest     = alerts.filter(a => a.level !== 'critical')

  return (
    <div className="space-y-5" dir="rtl">
      <PageBanner
        title="التنبيهات"
        subtitle={alerts.length > 0 ? `${alerts.length} تنبيه — ${critical.length > 0 ? `${critical.length} حرج` : 'لا توجد تنبيهات حرجة'}` : 'لا توجد تنبيهات نشطة'}
        icon={Bell}
        gradient="linear-gradient(135deg, #7C2D12 0%, #C2410C 50%, #F97316 100%)"
        glow="rgba(249,115,22,0.4)"
        badge={critical.length > 0 ? `🔴 ${critical.length} تنبيه حرج` : null}
      />

      <div className="flex items-center justify-between">
        <div />
        {critical.length > 0 && (
          <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-xl">
            ⚠️ {critical.length} تنبيه حرج
          </span>
        )}
      </div>

      {isLoading ? <AlertsSkeleton /> : !alerts.length ? (
        <EmptyState icon={Bell} title="لا توجد تنبيهات" message="كل شيء يعمل بشكل طبيعي" />
      ) : (
        <div className="space-y-3">
          {critical.length > 0 && (
            <>
              <h2 className="text-sm font-bold text-red-600">تنبيهات حرجة</h2>
              {critical.map(a => <AlertCard key={a.id} alert={a} onDismiss={id => dismissMut.mutate(id)} />)}
              {rest.length > 0 && <h2 className="text-sm font-bold text-gray-500 pt-2">تنبيهات أخرى</h2>}
            </>
          )}
          {rest.map(a => <AlertCard key={a.id} alert={a} onDismiss={id => dismissMut.mutate(id)} />)}
        </div>
      )}
    </div>
  )
}
