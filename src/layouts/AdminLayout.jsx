import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/admin/layout/AdminSidebar'
import AdminTopbar  from '@/components/admin/layout/AdminTopbar'

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed,  setCollapsed]  = useState(false)

  const W = collapsed ? 'lg:mr-[68px]' : 'lg:mr-[256px]'

  return (
    <div className="flex h-screen bg-slate-50 font-cairo overflow-hidden" dir="rtl">

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 h-full z-40 transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[68px]' : 'w-[256px]'}
        ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <AdminSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onClose={() => setMobileOpen(false)}
        />
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ${W}`}>
        <AdminTopbar onMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
