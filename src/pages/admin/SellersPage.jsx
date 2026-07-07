import SellersTable from '@/components/admin/sellers/SellersTable'
import SearchInput from '@/components/common/SearchInput'

export default function AdminSellersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">إدارة البائعين</h1>
      <SearchInput placeholder="بحث عن بائع..." />
      <SellersTable />
    </div>
  )
}
