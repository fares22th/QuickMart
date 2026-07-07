import { create } from 'zustand'

const stored = () => {
  try {
    return JSON.parse(localStorage.getItem('driver_user') ?? 'null')
  } catch { return null }
}

export const useDriverStore = create((set) => ({
  user:  stored(),
  token: localStorage.getItem('driver_token') ?? null,

  setAuth: (user, token) => {
    localStorage.setItem('driver_user', JSON.stringify(user))
    localStorage.setItem('driver_token', token)
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('driver_user')
    localStorage.removeItem('driver_token')
    set({ user: null, token: null })
  },
}))
