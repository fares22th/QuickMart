import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getTopStores } from '@/api/admin.api'
import { formatPrice } from '@/utils/formatPrice'

const COLORS = ['#00C896', '#6366F1', '#F59E0B', '#EF4444', '#3B82F6']

export default function RevenueByCategory() {
  const { data: topStores = [], isLoading } = useQuery({
    queryKey: ['top-stores'],
    queryFn:  () => getTopStores(8),
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Top Stores Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-5">أفضل المتاجر أداءً</h3>
        {isLoading ? <div className="h-52 bg-gray-50 rounded-xl animate-pulse" /> : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topStores} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => formatPrice(v)} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
              <Tooltip formatter={v => formatPrice(v)} />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]} name="الإيرادات">
                {topStores.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Stores Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4">تفاصيل أداء المتاجر</h3>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}
          </div>
        ) : topStores.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">لا توجد بيانات بعد</p>
        ) : (
          <div className="space-y-3">
            {topStores.map((store, i) => (
              <div key={store.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: COLORS[i % COLORS.length] }}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{store.name}</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${topStores[0]?.revenue ? (store.revenue / topStores[0].revenue) * 100 : 0}%`,
                        background: COLORS[i % COLORS.length],
                      }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-800">{formatPrice(store.revenue)}</p>
                  <p className="text-xs text-gray-400">{store.orders} طلب</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
