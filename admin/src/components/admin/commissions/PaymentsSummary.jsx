import { formatPrice } from '@/utils/formatPrice'

export default function PaymentsSummary({ data = {} }) {
  const items = [
    { label: 'إجمالي العمولات', value: data.totalCommissions ?? 0 },
    { label: 'مدفوع للبائعين',  value: data.paidToSellers ?? 0 },
    { label: 'إيرادات المنصة',  value: data.platformRevenue ?? 0 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map(({ label, value }) => (
        <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-admin mt-1">{formatPrice(value)}</p>
        </div>
      ))}
    </div>
  )
}
