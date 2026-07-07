import Badge from './Badge'

const STATUS_MAP = {
  pending:    { label: 'قيد الانتظار', color: 'yellow' },
  confirmed:  { label: 'مؤكد',         color: 'blue' },
  preparing:  { label: 'جاري التحضير', color: 'blue' },
  shipped:    { label: 'في الطريق',     color: 'primary' },
  delivered:  { label: 'تم التوصيل',   color: 'green' },
  cancelled:  { label: 'ملغي',          color: 'red' },
  active:     { label: 'نشط',           color: 'green' },
  inactive:   { label: 'غير نشط',       color: 'gray' },
  online:     { label: 'متصل',          color: 'green' },
  offline:    { label: 'غير متصل',      color: 'gray' },
}

export default function StatusPill({ status }) {
  const config = STATUS_MAP[status] ?? { label: status, color: 'gray' }
  return <Badge color={config.color}>{config.label}</Badge>
}
