import { useCartStore } from '@/store/useCartStore'

export function useCart() {
  const { items, addItem, removeItem, updateQty, clearCart } = useCartStore()

  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const subtotal   = items.reduce((s, i) => s + i.price * i.qty, 0)

  return { items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }
}
