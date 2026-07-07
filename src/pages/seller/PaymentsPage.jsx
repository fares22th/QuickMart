import EmptyState from '@/components/common/EmptyState'
import { formatPrice } from '@/utils/formatPrice'
import { formatDate } from '@/utils/formatDate'

export default function SellerPaymentsPage() {
  const payments = []

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">المدفوعات</h1>
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-gray-500 text-sm">الرصيد المتاح</p>
        <p className="text-3xl font-bold text-primary mt-1">{formatPrice(0)}</p>
      </div>
      {!payments.length
        ? <EmptyState message="لا توجد مدفوعات" />
        : payments.map(p => (
          <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm flex justify-between">
            <div>
              <p className="font-medium">{p.description}</p>
              <p className="text-sm text-gray-500">{formatDate(p.date)}</p>
            </div>
            <p className={`font-bold ${p.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
              {p.type === 'credit' ? '+' : '-'}{formatPrice(p.amount)}
            </p>
          </div>
        ))
      }
    </div>
  )
}
