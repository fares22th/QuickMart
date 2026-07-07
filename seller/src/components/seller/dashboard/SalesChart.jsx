import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts'
import { formatPrice } from '@/utils/formatPrice'
import { BarChart2, Activity } from 'lucide-react'

const PERIODS = [
  { key: 'week',  label: 'أسبوع' },
  { key: 'month', label: 'شهر'   },
  { key: 'year',  label: 'سنة'   },
]

const FALLBACK_WEEK = [
  { label: 'السبت',    sales: 0, orders: 0 },
  { label: 'الأحد',    sales: 0, orders: 0 },
  { label: 'الإثنين',  sales: 0, orders: 0 },
  { label: 'الثلاثاء', sales: 0, orders: 0 },
  { label: 'الأربعاء', sales: 0, orders: 0 },
  { label: 'الخميس',   sales: 0, orders: 0 },
  { label: 'الجمعة',   sales: 0, orders: 0 },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-3 text-sm" dir="rtl">
      <p className="font-bold text-gray-700 mb-2 text-xs">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-500 text-xs">{p.name}:</span>
          <span className="font-bold text-gray-800 text-xs">
            {p.dataKey === 'sales' ? formatPrice(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function SalesChart({ chartData, isLoading, onPeriodChange }) {
  const [period, setPeriod] = useState('week')
  const [type,   setType]   = useState('area')

  const data = chartData?.[period] ?? FALLBACK_WEEK

  const handlePeriod = (p) => {
    setPeriod(p)
    onPeriodChange?.(p)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-extrabold text-gray-900">رسم المبيعات</h3>
            <p className="text-xs text-gray-400 mt-0.5">أداء المبيعات خلال الفترة المحددة</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Chart type toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-0.5 gap-0.5">
              <button
                onClick={() => setType('area')}
                className={`p-1.5 rounded-lg transition-all ${type === 'area' ? 'bg-white shadow text-gray-700' : 'text-gray-400'}`}
                title="منطقة"
              >
                <Activity className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setType('bar')}
                className={`p-1.5 rounded-lg transition-all ${type === 'bar' ? 'bg-white shadow text-gray-700' : 'text-gray-400'}`}
                title="أعمدة"
              >
                <BarChart2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Period selector */}
            <div className="flex bg-gray-100 rounded-xl p-0.5 gap-0.5">
              {PERIODS.map(p => (
                <button
                  key={p.key}
                  onClick={() => handlePeriod(p.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    period === p.key
                      ? 'text-white shadow'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  style={period === p.key ? { background: 'linear-gradient(135deg, #00C896, #00A878)' } : {}}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-2 pb-5">
        {isLoading ? (
          <div className="h-[220px] bg-gray-50 rounded-xl animate-pulse mx-3" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            {type === 'area' ? (
              <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00C896" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00C896" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone" dataKey="sales" name="المبيعات"
                  stroke="#00C896" fill="url(#salesGrad)"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#00C896', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 5.5, fill: '#00C896', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" name="المبيعات" fill="#00C896" radius={[6, 6, 0, 0]}
                  maxBarSize={40} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
