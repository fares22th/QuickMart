import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { getOrdersTimeSeries, getCustomerGrowth, getOrdersByStatus } from '@/api/admin.api'
import { formatPrice } from '@/utils/formatPrice'

const PERIODS = [
  { label: '٧ أيام',  days: 7  },
  { label: '٣٠ يوم', days: 30 },
  { label: '٩٠ يوم', days: 90 },
]

const STATUS_COLORS = {
  pending:          '#F59E0B',
  confirmed:        '#3B82F6',
  preparing:        '#8B5CF6',
  out_for_delivery: '#06B6D4',
  delivered:        '#22C55E',
  cancelled:        '#EF4444',
}
const STATUS_LABELS = {
  pending: 'انتظار', confirmed: 'مؤكد', preparing: 'تحضير',
  out_for_delivery: 'في الطريق', delivered: 'مُسلَّم', cancelled: 'ملغي',
}

function ChartCard({ title, children, action }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-800">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )
}

function PeriodSelector({ value, onChange }) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
      {PERIODS.map(p => (
        <button key={p.days} onClick={() => onChange(p.days)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
          style={value === p.days
            ? { background: '#fff', color: '#1e293b', boxShadow: '0 1px 4px rgba(0,0,0,.1)' }
            : { color: '#64748b' }}>
          {p.label}
        </button>
      ))}
    </div>
  )
}

const dateLabel = (d) => {
  const date = new Date(d)
  return `${date.getDate()}/${date.getMonth() + 1}`
}

export default function PlatformCharts() {
  const [orderDays, setOrderDays]    = useState(30)
  const [customerDays, setCustomerDays] = useState(30)

  const { data: orderSeries = [], isLoading: l1 } = useQuery({
    queryKey: ['orders-series', orderDays],
    queryFn:  () => getOrdersTimeSeries(orderDays),
  })
  const { data: customerSeries = [], isLoading: l2 } = useQuery({
    queryKey: ['customer-growth', customerDays],
    queryFn:  () => getCustomerGrowth(customerDays),
  })
  const { data: statusData = [], isLoading: l3 } = useQuery({
    queryKey: ['orders-by-status'],
    queryFn:  getOrdersByStatus,
  })

  const orderChartData  = orderSeries.map(d => ({ ...d, date: dateLabel(d.date) }))
  const customerChartData = customerSeries.map(d => ({ ...d, date: dateLabel(d.date) }))
  const pieData = statusData.map(d => ({ ...d, name: STATUS_LABELS[d.status] ?? d.status, fill: STATUS_COLORS[d.status] ?? '#94a3b8' }))

  const totalRevenue = orderSeries.reduce((s, d) => s + d.revenue, 0)
  const totalOrders  = orderSeries.reduce((s, d) => s + d.orders,  0)

  return (
    <div className="space-y-6">

      {/* Revenue + Orders Chart */}
      <ChartCard
        title="الإيرادات والطلبات"
        action={<PeriodSelector value={orderDays} onChange={setOrderDays} />}>
        <div className="flex gap-6 mb-4">
          <div>
            <p className="text-xs text-gray-400">إجمالي الإيرادات</p>
            <p className="text-xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">إجمالي الطلبات</p>
            <p className="text-xl font-bold text-gray-900">{totalOrders.toLocaleString('ar-SA')}</p>
          </div>
        </div>
        {l1 ? <div className="h-56 bg-gray-50 rounded-xl animate-pulse" /> : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={orderChartData}>
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00C896" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00C896" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="orders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis yAxisId="left"  tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v, n) => n === 'revenue' ? formatPrice(v) : v} labelStyle={{ direction: 'rtl' }} />
              <Legend />
              <Area yAxisId="left"  type="monotone" dataKey="revenue" stroke="#00C896" fill="url(#revenue)" strokeWidth={2} name="الإيرادات" />
              <Area yAxisId="right" type="monotone" dataKey="orders"  stroke="#6366F1" fill="url(#orders)"  strokeWidth={2} name="الطلبات"   />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Customer Growth */}
        <ChartCard
          title="نمو العملاء"
          action={<PeriodSelector value={customerDays} onChange={setCustomerDays} />}>
          {l2 ? <div className="h-52 bg-gray-50 rounded-xl animate-pulse" /> : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={customerChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="عملاء جدد" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Orders by Status Pie */}
        <ChartCard title="توزيع حالات الطلبات">
          {l3 ? <div className="h-52 bg-gray-50 rounded-xl animate-pulse" /> : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={210}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                    dataKey="count" paddingAngle={3}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {pieData.map(d => (
                  <div key={d.status} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.fill }} />
                      <span className="text-gray-600">{d.name}</span>
                    </div>
                    <span className="font-bold text-gray-800">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  )
}
