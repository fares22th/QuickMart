import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWishlistStore = create(persist((set, get) => ({
  items: [],

  toggle: (product) => {
    const exists = get().items.some(i => i.id === product.id)
    set(s => ({
      items: exists
        ? s.items.filter(i => i.id !== product.id)
        : [...s.items, product],
    }))
  },

  isInWishlist: (id) => get().items.some(i => i.id === id),
  remove: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
  clear: () => set({ items: [] }),
}), { name: 'quickmart-wishlist' }))
