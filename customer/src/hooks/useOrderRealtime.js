import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { socket } from '@/lib/socket'
import { useAuthStore } from '@/store/useAuthStore'

const STATUS_TOAST = {
  confirmed: { msg: 'تم تأكيد طلبك',             emoji: '✅', color: '#3B82F6' },
  preparing: { msg: 'جاري تحضير طلبك الآن',       emoji: '👨‍🍳', color: '#A855F7' },
  shipped:   { msg: 'طلبك في الطريق إليك!',        emoji: '🚴', color: '#00C896' },
  delivered: { msg: 'تم توصيل طلبك بنجاح 🎉',     emoji: '📦', color: '#059669' },
  cancelled: { msg: 'تم إلغاء الطلب',              emoji: '❌', color: '#EF4444' },
}

/**
 * Connect to socket and listen for real-time order status changes.
 * Joins a socket room for each orderId provided.
 * On status change: invalidates React Query cache + shows a toast.
 */
export function useOrderRealtime(orderIds = []) {
  const qc     = useQueryClient()
  const user   = useAuthStore(s => s.user)
  const joined = useRef(new Set())

  useEffect(() => {
    if (!user) return

    // Connect once
    if (!socket.connected) socket.connect()

    // Join new rooms only
    orderIds.forEach(id => {
      if (!joined.current.has(id)) {
        socket.emit('join:order', id)
        joined.current.add(id)
      }
    })
  }, [user, orderIds.join(',')])  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user) return

    const handleStatus = ({ orderId, status }) => {
      // Invalidate both the list and the individual order
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: ['order', orderId] })

      const info = STATUS_TOAST[status]
      if (!info) return

      toast(`${info.emoji} ${info.msg}`, {
        duration: 7000,
        style: {
          background: '#0A2218',
          color: info.color,
          border: `1px solid ${info.color}40`,
          borderRadius: 16,
          fontWeight: 700,
          fontSize: 14,
          direction: 'rtl',
          boxShadow: `0 8px 24px ${info.color}30`,
        },
      })
    }

    const handleDriverAssigned = ({ orderId, driverName }) => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: ['order', orderId] })
      toast(`🚴 تم تعيين مندوب لطلبك${driverName ? ` — ${driverName}` : ''}`, {
        duration: 8000,
        style: {
          background: '#0A2218',
          color: '#00C896',
          border: '1px solid #00C89640',
          borderRadius: 16,
          fontWeight: 700,
          fontSize: 14,
          direction: 'rtl',
          boxShadow: '0 8px 24px rgba(0,200,150,0.3)',
        },
      })
    }

    socket.on('order:status', handleStatus)
    socket.on('order:driver_assigned', handleDriverAssigned)
    return () => {
      socket.off('order:status', handleStatus)
      socket.off('order:driver_assigned', handleDriverAssigned)
    }
  }, [user, qc])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (!useAuthStore.getState().user) {
        socket.disconnect()
        joined.current.clear()
      }
    }
  }, [])
}

/** Simpler variant: watch a single order */
export function useSingleOrderRealtime(orderId) {
  return useOrderRealtime(orderId ? [orderId] : [])
}
