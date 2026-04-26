import { useParams } from 'react-router-dom'
import SellerApprovalCard from '@/components/admin/sellers/SellerApprovalCard'
import Spinner from '@/components/common/Spinner'

export default function SellerDetailPage() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">تفاصيل البائع #{id}</h1>
      <SellerApprovalCard sellerId={id} />
    </div>
  )
}
