import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { socket } from '@/lib/socket'
import { useDriverStore } from '@/store/useDriverStore'

export function useDriverSocket() {
  const qc   = useQueryClient()
  const user = useDriverStore(s => s.user)

  useEffect(() => {
    if (!user) return

    if (!socket.connected) socket.connect()

    socket.emit('join:drivers')

    const onAvailable = () => {
      qc.invalidateQueries({ queryKey: ['available-orders'] })
      toast('📦 طلب جديد متاح للاستلام!', {
        duration: 8000,
        style: { background: '#1C1009', color: '#F97316', border: '1px solid #F9731640', borderRadius: 16 },
      })
    }

    const onTaken = () => {
      // Another driver accepted — refresh our list silently
      qc.invalidateQueries({ queryKey: ['available-orders'] })
    }

    const onStatusUpdate = () => {
      qc.invalidateQueries({ queryKey: ['active-order'] })
      qc.invalidateQueries({ queryKey: ['order-history'] })
    }

    socket.on('order:available', onAvailable)
    socket.on('order:taken',     onTaken)
    socket.on('order:status',    onStatusUpdate)

    return () => {
      socket.off('order:available', onAvailable)
      socket.off('order:taken',     onTaken)
      socket.off('order:status',    onStatusUpdate)
    }
  }, [user, qc])

  useEffect(() => {
    return () => {
      if (!useDriverStore.getState().user) socket.disconnect()
    }
  }, [])
}
