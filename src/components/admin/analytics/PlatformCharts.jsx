import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function PlatformCharts({ data = [] }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold mb-4">نمو المنصة</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="orders"    stroke="#00C896" strokeWidth={2} name="الطلبات" />
          <Line type="monotone" dataKey="revenue"   stroke="#6366F1" strokeWidth={2} name="الإيرادات" />
          <Line type="monotone" dataKey="customers" stroke="#F59E0B" strokeWidth={2} name="العملاء" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
