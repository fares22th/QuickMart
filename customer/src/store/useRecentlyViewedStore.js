import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useRecentlyViewedStore = create(persist((set, get) => ({
  items: [],

  addItem: (product) => {
    const simplified = {
      id:       product.id,
      name:     product.name,
      price:    product.price,
      image:    product.images?.[0] ?? product.image ?? null,
      rating:   product.rating,
      discount: product.discount,
      originalPrice: product.originalPrice,
      storeName: product.storeName,
    }
    const filtered = get().items.filter(i => i.id !== product.id)
    set({ items: [simplified, ...filtered].slice(0, 20) })
  },

  clear: () => set({ items: [] }),
}), { name: 'quickmart-recently-viewed' }))
