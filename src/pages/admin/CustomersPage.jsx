import SearchInput from '@/components/common/SearchInput'
import EmptyState from '@/components/common/EmptyState'
import Avatar from '@/components/common/Avatar'
import { Link } from 'react-router-dom'

export default function AdminCustomersPage() {
  const customers = []

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">إدارة العملاء</h1>
      <SearchInput placeholder="بحث عن عميل..." />
      {!customers.length
        ? <EmptyState message="لا يوجد عملاء" />
        : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {customers.map(c => (
              <Link key={c.id} to={`/admin/customers/${c.id}`} className="flex items-center gap-3 p-4 border-b hover:bg-gray-50">
                <Avatar name={c.name} />
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.phone}</p>
                </div>
              </Link>
            ))}
          </div>
        )
      }
    </div>
  )
}
