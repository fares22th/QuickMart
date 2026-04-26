import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const DUMMY_DATA = [
  { day: 'السبت', sales: 0 },
  { day: 'الأحد', sales: 0 },
  { day: 'الإثنين', sales: 0 },
  { day: 'الثلاثاء', sales: 0 },
  { day: 'الأربعاء', sales: 0 },
  { day: 'الخميس', sales: 0 },
  { day: 'الجمعة', sales: 0 },
]

export default function SalesChart() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold mb-4">المبيعات هذا الأسبوع</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={DUMMY_DATA}>
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00C896" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#00C896" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Area type="monotone" dataKey="sales" stroke="#00C896" fill="url(#salesGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
