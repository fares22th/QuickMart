import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(persist((set, get) => ({
  user:    null,
  session: null,
  profile: null,

  setSession: (session) => set({
    session,
    user: session?.user ?? null,
  }),

  setProfile: (profile) => set({ profile }),

  logout: () => set({ user: null, session: null, profile: null }),

  get role()            { return get().profile?.role ?? get().user?.user_metadata?.role ?? null },
  get isAuthenticated() { return !!get().session },

}), {
  name: 'quickmart-auth',
  partialize: (s) => ({ session: s.session, user: s.user, profile: s.profile }),
}))
