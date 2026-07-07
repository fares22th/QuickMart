import { Outlet } from 'react-router-dom'
import Navbar from '@/components/customer/navbar/Navbar'
import Footer from '@/components/customer/footer/Footer'
import CartDrawer from '@/components/customer/cart/CartDrawer'
import FloatingCartBtn from '@/components/customer/cart/FloatingCartBtn'

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingCartBtn />
    </div>
  )
}
