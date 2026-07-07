import { createBrowserRouter, Navigate } from 'react-router-dom'

import CustomerLayout from '@/layouts/CustomerLayout'
import AuthLayout from '@/layouts/AuthLayout'
import ProtectedRoute from './ProtectedRoute'

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage'
import CustomerRegisterPage from '@/pages/auth/CustomerRegisterPage'
import OtpPage from '@/pages/auth/OtpPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

// Customer Pages
import HomePage from '@/pages/customer/HomePage'
import CategoryPage from '@/pages/customer/CategoryPage'
import SearchPage from '@/pages/customer/SearchPage'
import StorePage from '@/pages/customer/StorePage'
import ProductPage from '@/pages/customer/ProductPage'
import CartPage from '@/pages/customer/CartPage'
import WishlistPage from '@/pages/customer/WishlistPage'
import CheckoutPage from '@/pages/customer/CheckoutPage'
import OrderSuccessPage from '@/pages/customer/OrderSuccessPage'
import OrderDetailPage from '@/pages/customer/OrderDetailPage'
import TrackingPage from '@/pages/customer/TrackingPage'
import NotificationsPage from '@/pages/customer/NotificationsPage'
import ProfilePage from '@/pages/customer/profile/ProfilePage'
import MyOrdersPage from '@/pages/customer/profile/OrdersPage'
import AddressesPage from '@/pages/customer/profile/AddressesPage'
import ProfileSettingsPage from '@/pages/customer/profile/SettingsPage'

const router = createBrowserRouter([

  // ── AUTH ──────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',           element: <LoginPage /> },
      { path: '/verify-otp',      element: <OtpPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },

  { path: '/register', element: <CustomerRegisterPage /> },

  // ── CUSTOMER ──────────────────────────────────────
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      // Public browsing routes
      { path: 'category/:slug',    element: <CategoryPage /> },
      { path: 'search',            element: <SearchPage /> },
      { path: 'store/:id',         element: <StorePage /> },
      { path: 'product/:id',       element: <ProductPage /> },
      { path: 'cart',              element: <CartPage /> },
      { path: 'wishlist',          element: <WishlistPage /> },

      // Protected: require login
      {
        element: <ProtectedRoute role="customer" />,
        children: [
          { index: true,                 element: <HomePage /> },
          { path: 'checkout',            element: <CheckoutPage /> },
          { path: 'order-success',       element: <OrderSuccessPage /> },
          { path: 'order/:id',           element: <OrderDetailPage /> },
          { path: 'track/:orderId',      element: <TrackingPage /> },
          { path: 'notifications',       element: <NotificationsPage /> },
          { path: 'profile',             element: <ProfilePage /> },
          { path: 'profile/orders',      element: <MyOrdersPage /> },
          { path: 'profile/addresses',   element: <AddressesPage /> },
          { path: 'profile/settings',    element: <ProfileSettingsPage /> },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
])

export default router
