import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

export default function ProtectedRoute({ children, requiredRole }) {
  const { session, profile } = useAuthStore()
  const role = profile?.role ?? session?.user?.user_metadata?.role

  if (!session) {
    if (requiredRole === 'seller') return <Navigate to="/seller/login" replace />
    if (requiredRole === 'admin')  return <Navigate to="/admin/login"  replace />
    return <Navigate to="/login" replace />
  }

  if (requiredRole && role !== requiredRole) {
    if (role === 'seller') return <Navigate to="/seller" replace />
    if (role === 'admin')  return <Navigate to="/admin"  replace />
    return <Navigate to="/" replace />
  }

  return children ?? <Outlet />
}
