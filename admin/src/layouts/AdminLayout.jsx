import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/admin/layout/AdminSidebar'
import AdminTopbar from '@/components/admin/layout/AdminTopbar'

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex" style={{ background: '#F1F5F9' }}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
