import DisputeCard from '@/components/admin/disputes/DisputeCard'
import EmptyState from '@/components/common/EmptyState'

export default function AdminDisputesPage() {
  const disputes = []

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">النزاعات</h1>
      {!disputes.length
        ? <EmptyState message="لا توجد نزاعات" />
        : disputes.map(d => <DisputeCard key={d.id} dispute={d} />)
      }
    </div>
  )
}
