import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(persist((set) => ({
  user:         null,
  token:        null,
  refreshToken: null,
  role:         null,

  setAuth: (user, token, refreshToken) => set({ user, token, refreshToken, role: user.role }),
  setToken: (token) => set({ token }),
  logout:  () => set({ user: null, token: null, refreshToken: null, role: null }),
  isAuthenticated: () => !!useAuthStore.getState().token,

}), { name: 'quickmart-seller-auth' }))
