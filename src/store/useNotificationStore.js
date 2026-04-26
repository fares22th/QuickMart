import { create } from 'zustand'

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => set(s => ({
    notifications: [{ ...notification, id: Date.now(), read: false }, ...s.notifications],
    unreadCount: s.unreadCount + 1,
  })),

  markAllRead: () => set(s => ({
    notifications: s.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0,
  })),

  markRead: (id) => set(s => {
    const n = s.notifications.find(n => n.id === id)
    return {
      notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
      unreadCount: n?.read ? s.unreadCount : Math.max(0, s.unreadCount - 1),
    }
  }),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}))
