import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useLocationStore = create(persist((set) => ({
  address: null,
  lat: null,
  lng: null,

  setLocation: ({ address, lat, lng }) => set({ address, lat, lng }),
  clearLocation: () => set({ address: null, lat: null, lng: null }),

}), { name: 'quickmart-location' }))
