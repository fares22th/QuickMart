import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getMyBalance, getMyPayments, requestWithdrawal } from '@/api/seller.api'
import EmptyState from '@/components/common/EmptyState'
import { formatPrice } from '@/utils/formatPrice'
import { formatDate } from '@/utils/formatDate'
import { CreditCard, ArrowDownLeft } from 'lucide-react'

const TYPE_COLORS = {
  credit:   { bg: 'bg-green-50',  text: 'text-green-600',  prefix: '+' },
  debit:    { bg: 'bg-red-50',    text: 'text-red-500',    prefix: '-' },
  withdrawal: { bg: 'bg-blue-50', text: 'text-blue-600',   prefix: '' },
}

function PaymentRow({ payment }) {
  const style = TYPE_COLORS[payment.type] ?? TYPE_COLORS.debit
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${style.bg}`}>
          <CreditCard className={`w-4 h-4 ${style.text}`} />
        </div>
        <div>
          <p className="font-medium text-gray-800 text-sm">{payment.description}</p>
          <p className="text-xs text-gray-400">{formatDate(payment.date)}</p>
        </div>
      </div>
      <p className={`font-bold text-sm ${style.text}`}>
        {style.prefix}{formatPrice(payment.amount)}
      </p>
    </div>
  )
}

export default function SellerPaymentsPage() {
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [showWithdraw,   setShowWithdraw]   = useState(false)

  const { data: balance, isLoading: balanceLoading, refetch: refetchBalance } = useQuery({
    queryKey: ['seller-balance'],
    queryFn:  getMyBalance,
  })

  const { data, isLoading: paymentsLoading } = useQuery({
    queryKey: ['seller-payments'],
    queryFn:  () => getMyPayments({ limit: 30 }),
  })

  const withdrawMut = useMutation({
    mutationFn: (amount) => requestWithdrawal(amount),
    onSuccess: () => {
      refetchBalance()
      toast.success('تم إرسال طلب السحب')
      setShowWithdraw(false)
      setWithdrawAmount('')
    },
    onError: () => toast.error('تعذّر إرسال طلب السحب'),
  })

  const payments = data?.payments ?? []
  const available = balance?.available ?? 0
  const pending   = balance?.pending ?? 0

  return (
    <div className="space-y-5" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900">المدفوعات والرصيد</h1>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-500">الرصيد المتاح للسحب</p>
          {balanceLoading
            ? <div className="h-10 bg-gray-100 animate-pulse rounded-xl w-32 mt-2" />
            : <p className="text-3xl font-bold text-primary mt-1">{formatPrice(available)}</p>
          }
          <button
            onClick={() => setShowWithdraw(v => !v)}
            className="mt-3 flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
          >
            <ArrowDownLeft className="w-4 h-4" />
            طلب سحب
          </button>

          {showWithdraw && (
            <div className="mt-3 flex gap-2">
              <input
                type="number"
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
                placeholder="المبلغ (ر.س)"
                max={available}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <button
                onClick={() => {
                  const amt = Number(withdrawAmount)
                  if (!amt || amt > available) {
                    toast.error('مبلغ غير صحيح')
                    return
                  }
                  withdrawMut.mutate(amt)
                }}
                disabled={withdrawMut.isPending}
                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {withdrawMut.isPending ? '...' : 'سحب'}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-500">قيد المعالجة</p>
          {balanceLoading
            ? <div className="h-10 bg-gray-100 animate-pulse rounded-xl w-32 mt-2" />
            : <p className="text-3xl font-bold text-orange-500 mt-1">{formatPrice(pending)}</p>
          }
          <p className="text-xs text-gray-400 mt-1">يتم تحرير الرصيد بعد تأكيد التوصيل</p>
        </div>
      </div>

      {/* Payments history */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <h3 className="font-bold text-gray-800">سجل المعاملات</h3>
        </div>

        {paymentsLoading ? (
          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
                <div className="w-9 h-9 bg-gray-100 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-48" />
                  <div className="h-3 bg-gray-100 rounded w-24" />
                </div>
                <div className="h-5 bg-gray-100 rounded w-20" />
              </div>
            ))}
          </div>
        ) : !payments.length ? (
          <EmptyState icon={CreditCard} title="لا توجد معاملات" message="ستظهر هنا معاملاتك المالية" />
        ) : (
          <div className="divide-y">
            {payments.map(p => <PaymentRow key={p.id} payment={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
