import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAddressStore = create(persist((set, get) => ({
  addresses: [],

  addAddress: (address) => {
    const isFirst = get().addresses.length === 0
    set(s => ({
      addresses: [
        ...s.addresses,
        { ...address, id: Date.now(), isDefault: isFirst },
      ],
    }))
  },

  updateAddress: (id, data) => set(s => ({
    addresses: s.addresses.map(a => a.id === id ? { ...a, ...data } : a),
  })),

  removeAddress: (id) => set(s => {
    const filtered = s.addresses.filter(a => a.id !== id)
    if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
      filtered[0].isDefault = true
    }
    return { addresses: filtered }
  }),

  setDefault: (id) => set(s => ({
    addresses: s.addresses.map(a => ({ ...a, isDefault: a.id === id })),
  })),

  getDefault: () => {
    const addrs = get().addresses
    return addrs.find(a => a.isDefault) ?? addrs[0] ?? null
  },
}), { name: 'quickmart-addresses' }))
