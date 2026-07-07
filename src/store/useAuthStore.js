import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(persist((set) => ({
  user:  null,
  token: null,
  role:  null,

  setAuth: (user, token) => set({ user, token, role: user.role }),
  logout:  () => set({ user: null, token: null, role: null }),
  isAuthenticated: () => !!useAuthStore.getState().token,

}), { name: 'quickmart-auth' }))
