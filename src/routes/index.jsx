import { createBrowserRouter } from 'react-router-dom'

// Layouts
import CustomerLayout from '@/layouts/CustomerLayout'
import SellerLayout from '@/layouts/SellerLayout'
import AdminLayout from '@/layouts/AdminLayout'
import AuthLayout from '@/layouts/AuthLayout'
import SellerAuthLayout from '@/layouts/SellerAuthLayout'
import AdminAuthLayout from '@/layouts/AdminAuthLayout'
import ProtectedRoute from './ProtectedRoute'

// ── Auth Pages ──────────────────────────────────────
import LoginPage from '@/pages/auth/LoginPage'
import SellerLoginPage from '@/pages/auth/SellerLoginPage'
import AdminLoginPage from '@/pages/auth/AdminLoginPage'
import CustomerRegisterPage from '@/pages/auth/CustomerRegisterPage'
import SellerRegisterPage from '@/pages/auth/SellerRegisterPage'
import AdminRegisterPage from '@/pages/auth/AdminRegisterPage'
import OtpPage from '@/pages/auth/OtpPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

// ── Customer Pages ───────────────────────────────────
import HomePage from '@/pages/customer/HomePage'
import CategoryPage from '@/pages/customer/CategoryPage'
import SearchPage from '@/pages/customer/SearchPage'
import StorePage from '@/pages/customer/StorePage'
import ProductPage from '@/pages/customer/ProductPage'
import CartPage from '@/pages/customer/CartPage'
import WishlistPage from '@/pages/customer/WishlistPage'
import CheckoutPage from '@/pages/customer/CheckoutPage'
import OrderSuccessPage from '@/pages/customer/OrderSuccessPage'
import TrackingPage from '@/pages/customer/TrackingPage'
import ProfilePage from '@/pages/customer/profile/ProfilePage'
import MyOrdersPage from '@/pages/customer/profile/OrdersPage'
import AddressesPage from '@/pages/customer/profile/AddressesPage'
import ProfileSettingsPage from '@/pages/customer/profile/SettingsPage'

// ── Seller Pages ─────────────────────────────────────
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

// ── Admin Pages ──────────────────────────────────────
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
import AdminSecurityPage from '@/pages/admin/SecurityPage'

const router = createBrowserRouter([

  // ──────────────────────────────────────────────────
  // AUTH — CUSTOMER  (/login, /register, /forgot-password)
  // ──────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',           element: <LoginPage /> },
      { path: '/verify-otp',      element: <OtpPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  { path: '/register', element: <CustomerRegisterPage /> },

  // ──────────────────────────────────────────────────
  // AUTH — SELLER  (/seller/login, /register/seller)
  // ──────────────────────────────────────────────────
  {
    element: <SellerAuthLayout />,
    children: [
      { path: '/seller/login', element: <SellerLoginPage /> },
    ],
  },
  { path: '/register/seller', element: <SellerRegisterPage /> },

  // ──────────────────────────────────────────────────
  // AUTH — ADMIN  (/admin/login, /admin/register)
  // ──────────────────────────────────────────────────
  {
    element: <AdminAuthLayout />,
    children: [
      { path: '/admin/login', element: <AdminLoginPage /> },
    ],
  },
  { path: '/admin/register', element: <AdminRegisterPage /> },

  // ──────────────────────────────────────────────────
  // CUSTOMER  (/)
  // ──────────────────────────────────────────────────
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      { index: true,               element: <HomePage /> },
      { path: 'category/:slug',    element: <CategoryPage /> },
      { path: 'search',            element: <SearchPage /> },
      { path: 'store/:id',         element: <StorePage /> },
      { path: 'product/:id',       element: <ProductPage /> },
      { path: 'cart',              element: <CartPage /> },
      { path: 'wishlist',          element: <WishlistPage /> },
      {
        element: <ProtectedRoute role="customer" />,
        children: [
          { path: 'checkout',              element: <CheckoutPage /> },
          { path: 'order-success',         element: <OrderSuccessPage /> },
          { path: 'track/:orderId',        element: <TrackingPage /> },
          { path: 'profile',               element: <ProfilePage /> },
          { path: 'profile/orders',        element: <MyOrdersPage /> },
          { path: 'profile/addresses',     element: <AddressesPage /> },
          { path: 'profile/settings',      element: <ProfileSettingsPage /> },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────
  // SELLER  (/seller/*)
  // ──────────────────────────────────────────────────
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
    ],
  },

  // ──────────────────────────────────────────────────
  // ADMIN  (/admin/*)
  // ──────────────────────────────────────────────────
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
      { path: 'security',          element: <AdminSecurityPage /> },
    ],
  },

])

export default router
