import { Outlet } from 'react-router-dom'
import SellerSidebar from '@/components/seller/layout/SellerSidebar'
import SellerTopbar from '@/components/seller/layout/SellerTopbar'

export default function SellerLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <SellerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerTopbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
