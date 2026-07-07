import { Outlet } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'

export default function DriverLayout() {
  return (
    <div className="min-h-dvh flex flex-col" dir="rtl">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
