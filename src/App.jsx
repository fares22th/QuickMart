import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import router from '@/routes'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { getMe } from '@/api/users.api'

function AuthSync() {
  const { setSession, setProfile, logout } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) getMe().then(setProfile).catch(() => {})
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) getMe().then(setProfile).catch(() => {})
      else logout()
    })

    return () => subscription.unsubscribe()
  }, [])

  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthSync />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
