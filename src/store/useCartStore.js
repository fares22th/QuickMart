import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(persist((set, get) => ({
  items: [],
  storeId: null,
  isOpen: false,

  open:  () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  addItem: (product) => {
    const { items } = get()
    const existing = items.find(i => i.id === product.id)
    if (existing) {
      set({ items: items.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) })
    } else {
      set({ items: [...items, { ...product, qty: 1 }] })
    }
  },

  removeItem: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),

  updateQty: (id, qty) => set(s => ({
    items: qty <= 0
      ? s.items.filter(i => i.id !== id)
      : s.items.map(i => i.id === id ? { ...i, qty } : i),
  })),

  clearCart: () => set({ items: [], storeId: null }),

}), { name: 'quickmart-cart' }))
