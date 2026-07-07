import { createBrowserRouter, Navigate } from 'react-router-dom'

import AdminLayout from '@/layouts/AdminLayout'
import AdminAuthLayout from '@/layouts/AdminAuthLayout'
import ProtectedRoute from './ProtectedRoute'

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage'
import AdminRegisterPage from '@/pages/auth/AdminRegisterPage'
import OtpPage from '@/pages/auth/OtpPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

// Admin Pages
import AdminOverviewPage from '@/pages/admin/OverviewPage'
import AdminAnalyticsPage from '@/pages/admin/AnalyticsPage'
import AlertsPage from '@/pages/admin/AlertsPage'
import AdminSellersPage from '@/pages/admin/SellersPage'
import SellerDetailPage from '@/pages/admin/SellerDetailPage'
import AdminCustomersPage from '@/pages/admin/CustomersPage'
import CustomerDetailPage from '@/pages/admin/CustomerDetailPage'
import AdminDriversPage from '@/pages/admin/DriversPage'
import AdminAllOrdersPage from '@/pages/admin/AllOrdersPage'
import AdminCommissionsPage from '@/pages/admin/CommissionsPage'
import AdminDisputesPage from '@/pages/admin/DisputesPage'
import AdminAdsPage from '@/pages/admin/AdsPage'
import AdminSettingsPage from '@/pages/admin/SettingsPage'
import AdminProfilePage from '@/pages/admin/ProfilePage'

const router = createBrowserRouter([

  // ── AUTH ──────────────────────────────────────────
  {
    element: <AdminAuthLayout />,
    children: [
      { path: '/login',           element: <LoginPage /> },
      { path: '/verify-otp',      element: <OtpPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },

  { path: '/register', element: <AdminRegisterPage /> },

  // ── ADMIN ──────────────────────────────────────────
  {
    path: '/admin',
    element: <ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true,               element: <AdminOverviewPage /> },
      { path: 'analytics',         element: <AdminAnalyticsPage /> },
      { path: 'alerts',            element: <AlertsPage /> },
      { path: 'sellers',           element: <AdminSellersPage /> },
      { path: 'sellers/:id',       element: <SellerDetailPage /> },
      { path: 'customers',         element: <AdminCustomersPage /> },
      { path: 'customers/:id',     element: <CustomerDetailPage /> },
      { path: 'drivers',           element: <AdminDriversPage /> },
      { path: 'orders',            element: <AdminAllOrdersPage /> },
      { path: 'commissions',       element: <AdminCommissionsPage /> },
      { path: 'disputes',          element: <AdminDisputesPage /> },
      { path: 'ads',               element: <AdminAdsPage /> },
      { path: 'settings',          element: <AdminSettingsPage /> },
      { path: 'profile',           element: <AdminProfilePage /> },
    ],
  },

  { path: '/',  element: <Navigate to="/admin" replace /> },
  { path: '*',  element: <Navigate to="/admin" replace /> },
])

export default router
