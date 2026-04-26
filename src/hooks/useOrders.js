import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrders, getOrder, createOrder, updateOrderStatus } from '@/api/orders.api'
import { toast } from 'sonner'

export function useOrders(params) {
  return useQuery({ queryKey: ['orders', params], queryFn: () => getOrders(params) })
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
    onError: () => toast.error('فشل إنشاء الطلب'),
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}
