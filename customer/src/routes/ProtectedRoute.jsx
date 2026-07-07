import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

export default function ProtectedRoute({ children, role }) {
  const token    = useAuthStore(s => s.token)
  const userRole = useAuthStore(s => s.role)
  const location = useLocation()

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />
  if (role && userRole !== role) return <Navigate to="/login" replace />
  return children ?? <Outlet />
}
