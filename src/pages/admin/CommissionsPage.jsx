import CommissionBars from '@/components/admin/commissions/CommissionBars'
import PaymentsSummary from '@/components/admin/commissions/PaymentsSummary'

export default function AdminCommissionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">العمولات والمدفوعات</h1>
      <PaymentsSummary />
      <CommissionBars />
    </div>
  )
}
