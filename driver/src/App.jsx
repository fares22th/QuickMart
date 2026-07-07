import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDriverStore } from '@/store/useDriverStore'
import DriverLayout from '@/layouts/DriverLayout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import ActiveOrderPage from '@/pages/ActiveOrderPage'
import OrderHistoryPage from '@/pages/OrderHistoryPage'
import EarningsPage from '@/pages/EarningsPage'
import ProfilePage from '@/pages/ProfilePage'

function ProtectedRoute({ children }) {
  const user = useDriverStore(s => s.user)
  return user ? children : <Navigate to="/login" replace />
}

function GuestRoute({ children }) {
  const user = useDriverStore(s => s.user)
  return user ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route element={<ProtectedRoute><DriverLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="active-order" element={<ActiveOrderPage />} />
          <Route path="history"      element={<OrderHistoryPage />} />
          <Route path="earnings"     element={<EarningsPage />} />
          <Route path="profile"      element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
