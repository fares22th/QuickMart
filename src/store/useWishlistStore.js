import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWishlistStore = create(persist((set, get) => ({
  productIds: [],

  toggle: (productId) => {
    const ids = get().productIds
    if (ids.includes(productId)) {
      set({ productIds: ids.filter(id => id !== productId) })
    } else {
      set({ productIds: [...ids, productId] })
    }
  },

  add:    (id) => set(s => ({ productIds: s.productIds.includes(id) ? s.productIds : [...s.productIds, id] })),
  remove: (id) => set(s => ({ productIds: s.productIds.filter(pid => pid !== id) })),

  isInWishlist: (id) => get().productIds.includes(id),
  count: () => get().productIds.length,

  clear: () => set({ productIds: [] }),
}), { name: 'quickmart-wishlist' }))
