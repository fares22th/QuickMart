import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrders, getOrder, createOrder, updateOrderStatus, cancelOrder } from '@/api/orders.api'
import { toast } from 'sonner'

export function useOrders(params) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getOrders(params).then(d => d?.orders ?? d),
  })
}

export function useOrder(id) {
  return useQuery({ queryKey: ['order', id], queryFn: () => getOrder(id), enabled: !!id })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success('تم تأكيد الطلب')
    },
    onError: (err) => toast.error(err?.error || err?.message || 'فشل إنشاء الطلب'),
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => cancelOrder(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: ['order', id] })
      toast.success('تم إلغاء الطلب')
    },
    onError: () => toast.error('تعذّر إلغاء الطلب'),
  })
}
