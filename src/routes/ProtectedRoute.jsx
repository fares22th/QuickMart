import { Outlet } from 'react-router-dom'

// 🚧 DEV MODE — auth disabled temporarily
export default function ProtectedRoute({ children }) {
  return children ?? <Outlet />
}
