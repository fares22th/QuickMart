import { useState } from 'react'
import { Plus } from 'lucide-react'
import CouponCard from '@/components/seller/offers/CouponCard'
import CouponForm from '@/components/seller/offers/CouponForm'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'

export default function SellerOffersPage() {
  const [showForm, setShowForm] = useState(false)
  const coupons = []

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">العروض والكوبونات</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 ml-1" /> إضافة كوبون
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(c => <CouponCard key={c.id} coupon={c} />)}
      </div>
      <Modal open={showForm} onClose={() => setShowForm(false)} title="كوبون جديد">
        <CouponForm onSuccess={() => setShowForm(false)} />
      </Modal>
    </div>
  )
}
