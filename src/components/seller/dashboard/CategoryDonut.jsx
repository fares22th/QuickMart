import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#00C896', '#FF6B35', '#6366F1', '#F59E0B', '#EC4899']

export default function CategoryDonut({ data = [] }) {
  const sample = data.length ? data : [{ name: 'لا يوجد بيانات', value: 1 }]

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold mb-4">المبيعات حسب الفئة</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={sample} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
            {sample.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
