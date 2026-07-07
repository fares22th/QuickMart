import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function GeoMap({ data = [] }) {
  const hasData = data.length > 0

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">توزيع الطلبات حسب المدينة</h3>
      {!hasData ? (
        <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 text-sm">
          لا توجد بيانات جغرافية بعد
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="city" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value) => [`${value} طلب`, 'الطلبات']}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="orders" fill="#6366F1" radius={[6, 6, 0, 0]} name="الطلبات" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
