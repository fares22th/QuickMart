import { Bell, BellOff, Check, Package, Tag, Info, Trash2 } from 'lucide-react'
import { useNotificationStore } from '@/store/useNotificationStore'
import { formatDate } from '@/utils/formatDate'

const TYPE_CONFIG = {
  order:   { icon: Package, color: '#00C896', bg: '#E6FAF5', label: 'طلب' },
  promo:   { icon: Tag,     color: '#f59e0b', bg: '#fef3c7', label: 'عرض' },
  info:    { icon: Info,    color: '#3b82f6', bg: '#eff6ff', label: 'معلومات' },
  default: { icon: Bell,    color: '#8b5cf6', bg: '#f5f3ff', label: 'إشعار' },
}

function NotificationItem({ notification, onRead, onDelete }) {
  const cfg   = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.default
  const Icon  = cfg.icon

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${
        notification.read
          ? 'bg-white border-gray-100'
          : 'bg-blue-50/40 border-blue-100'
      }`}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: cfg.bg }}
      >
        <Icon className="w-5 h-5" style={{ color: cfg.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-snug ${notification.read ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>
            {notification.title ?? notification.message}
          </p>
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
          )}
        </div>
        {notification.title && notification.message && (
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notification.message}</p>
        )}
        <p className="text-xs text-gray-400 mt-1.5">{formatDate(notification.createdAt ?? new Date(notification.id))}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {!notification.read && (
          <button
            onClick={() => onRead(notification.id)}
            className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
            title="تعليم كمقروء"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => onDelete(notification.id)}
          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors"
          title="حذف"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotificationStore(s => ({
    notifications: s.notifications,
    unreadCount:   s.unreadCount,
    markRead:      s.markRead,
    markAllRead:   s.markAllRead,
    clearAll:      s.clearAll,
  }))

  const handleDelete = (id) => {
    useNotificationStore.setState(s => ({
      notifications: s.notifications.filter(n => n.id !== id),
      unreadCount:   s.notifications.find(n => n.id === id && !n.read)
        ? Math.max(0, s.unreadCount - 1)
        : s.unreadCount,
    }))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإشعارات</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-400 mt-0.5">{unreadCount} إشعار غير مقروء</p>
          )}
        </div>
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-sm font-medium text-primary hover:underline"
              >
                تعليم الكل كمقروء
              </button>
            )}
            <button
              onClick={clearAll}
              className="text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
            >
              حذف الكل
            </button>
          </div>
        )}
      </div>

      {/* Empty state */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <BellOff className="w-10 h-10 text-gray-300" />
          </div>
          <p className="font-semibold text-gray-700 text-lg">لا توجد إشعارات</p>
          <p className="text-sm text-gray-400 mt-1">ستظهر هنا إشعارات طلباتك وعروضك</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Unread first */}
          {unreadCount > 0 && (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide px-1 mb-2">جديد</p>
              {notifications.filter(n => !n.read).map(n => (
                <NotificationItem key={n.id} notification={n} onRead={markRead} onDelete={handleDelete} />
              ))}
              {notifications.some(n => n.read) && (
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide px-1 mt-4 mb-2">سابقاً</p>
              )}
            </>
          )}
          {notifications.filter(n => n.read).map(n => (
            <NotificationItem key={n.id} notification={n} onRead={markRead} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
