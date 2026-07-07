import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#00C896', '#6366F1', '#F59E0B', '#EC4899', '#3B82F6']

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 px-3 py-2 text-sm" dir="rtl">
      <p className="font-bold text-gray-800">{name}</p>
      <p className="text-xs text-gray-500 mt-0.5">{value} مبيعة</p>
    </div>
  )
}

export default function CategoryDonut({ data = [] }) {
  const hasData = data.length > 0
  const chartData = hasData ? data : [{ name: 'لا يوجد', value: 1 }]
  const total = data.reduce((s, d) => s + (d.value ?? 0), 0)

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-extrabold text-gray-900">المبيعات بالفئة</h3>
        <p className="text-xs text-gray-400 mt-0.5">توزيع المبيعات على الفئات</p>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%" cy="50%"
              innerRadius={52} outerRadius={78}
              dataKey="value"
              paddingAngle={hasData ? 3 : 0}
              strokeWidth={0}
            >
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={hasData ? COLORS[i % COLORS.length] : '#F3F4F6'}
                />
              ))}
            </Pie>
            {hasData && <Tooltip content={<CustomTooltip />} />}
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xl font-extrabold text-gray-900">{total || '—'}</p>
          <p className="text-[10px] text-gray-400 font-medium">إجمالي</p>
        </div>
      </div>

      {/* Legend */}
      {hasData && (
        <div className="mt-4 space-y-2">
          {data.slice(0, 4).map((item, i) => {
            const pct = total ? Math.round((item.value / total) * 100) : 0
            return (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="text-xs text-gray-600 flex-1 truncate">{item.name}</span>
                <span className="text-xs font-bold text-gray-800">{pct}%</span>
              </div>
            )
          })}
        </div>
      )}

      {!hasData && (
        <p className="text-center text-xs text-gray-400 mt-2">لا توجد بيانات بعد</p>
      )}
    </div>
  )
}
