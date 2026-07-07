import { createBrowserRouter, Navigate } from 'react-router-dom'

import SellerLayout from '@/layouts/SellerLayout'
import SellerAuthLayout from '@/layouts/SellerAuthLayout'
import ProtectedRoute from './ProtectedRoute'

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage'
import SellerRegisterPage from '@/pages/auth/SellerRegisterPage'
import OtpPage from '@/pages/auth/OtpPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

// Seller Pages
import SellerDashboardPage from '@/pages/seller/DashboardPage'
import SellerOrdersPage from '@/pages/seller/OrdersPage'
import SellerProductsPage from '@/pages/seller/ProductsPage'
import AddProductPage from '@/pages/seller/AddProductPage'
import EditProductPage from '@/pages/seller/EditProductPage'
import InventoryPage from '@/pages/seller/InventoryPage'
import SellerAnalyticsPage from '@/pages/seller/AnalyticsPage'
import SellerOffersPage from '@/pages/seller/OffersPage'
import SellerReviewsPage from '@/pages/seller/ReviewsPage'
import SellerPaymentsPage from '@/pages/seller/PaymentsPage'
import RegisterStorePage from '@/pages/seller/RegisterStorePage'
import SellerSettingsPage from '@/pages/seller/SettingsPage'
import SellerProfilePage from '@/pages/seller/ProfilePage'

const router = createBrowserRouter([

  // ── AUTH ──────────────────────────────────────────
  {
    element: <SellerAuthLayout />,
    children: [
      { path: '/login',           element: <LoginPage /> },
      { path: '/verify-otp',      element: <OtpPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },

  { path: '/register', element: <SellerRegisterPage /> },

  // ── SELLER ──────────────────────────────────────
  {
    path: '/seller',
    element: <ProtectedRoute role="seller"><SellerLayout /></ProtectedRoute>,
    children: [
      { index: true,               element: <SellerDashboardPage /> },
      { path: 'orders',            element: <SellerOrdersPage /> },
      { path: 'products',          element: <SellerProductsPage /> },
      { path: 'products/add',      element: <AddProductPage /> },
      { path: 'products/:id/edit', element: <EditProductPage /> },
      { path: 'inventory',         element: <InventoryPage /> },
      { path: 'analytics',         element: <SellerAnalyticsPage /> },
      { path: 'offers',            element: <SellerOffersPage /> },
      { path: 'reviews',           element: <SellerReviewsPage /> },
      { path: 'payments',          element: <SellerPaymentsPage /> },
      { path: 'register-store',    element: <RegisterStorePage /> },
      { path: 'settings',          element: <SellerSettingsPage /> },
      { path: 'profile',           element: <SellerProfilePage /> },
    ],
  },

  { path: '/',  element: <Navigate to="/seller" replace /> },
  { path: '*',  element: <Navigate to="/seller" replace /> },
])

export default router
