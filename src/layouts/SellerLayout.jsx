import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SellerSidebar from '@/components/seller/layout/SellerSidebar'
import SellerTopbar  from '@/components/seller/layout/SellerTopbar'

export default function SellerLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed,  setCollapsed]  = useState(false)
  const w = collapsed ? 68 : 256

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex" dir="rtl">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar — fixed, right side for RTL */}
      <div
        className={`fixed top-0 right-0 h-full z-40 transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}
        style={{ width: w }}
      >
        <SellerSidebar collapsed={collapsed} setCollapsed={setCollapsed} onClose={() => setMobileOpen(false)} />
      </div>

      {/* Main content — offset by sidebar width */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ marginRight: w }}
      >
        <SellerTopbar onMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
