import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus, Tag } from 'lucide-react'
import { getMyCoupons, createMyCoupon, deleteMyCoupon, toggleCoupon } from '@/api/seller.api'
import CouponCard from '@/components/seller/offers/CouponCard'
import CouponForm from '@/components/seller/offers/CouponForm'
import Modal from '@/components/common/Modal'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import EmptyState from '@/components/common/EmptyState'
import Button from '@/components/common/Button'

function CouponsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border-2 border-dashed border-gray-100 animate-pulse">
          <div className="h-6 bg-gray-100 rounded w-32 mb-3" />
          <div className="h-4 bg-gray-100 rounded w-24 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-20" />
        </div>
      ))}
    </div>
  )
}

export default function SellerOffersPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm]   = useState(false)
  const [deleteId, setDeleteId]   = useState(null)

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['seller-coupons'],
    queryFn:  getMyCoupons,
  })

  const createMut = useMutation({
    mutationFn: createMyCoupon,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seller-coupons'] })
      toast.success('تم إنشاء الكوبون')
      setShowForm(false)
    },
    onError: () => toast.error('تعذّر إنشاء الكوبون'),
  })

  const deleteMut = useMutation({
    mutationFn: deleteMyCoupon,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seller-coupons'] })
      toast.success('تم حذف الكوبون')
      setDeleteId(null)
    },
    onError: () => toast.error('تعذّر حذف الكوبون'),
  })

  const toggleMut = useMutation({
    mutationFn: ({ id, active }) => toggleCoupon(id, active),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seller-coupons'] })
      toast.success('تم تحديث حالة الكوبون')
    },
    onError: () => toast.error('تعذّر تحديث الكوبون'),
  })

  const active   = coupons.filter(c => c.active !== false)
  const inactive = coupons.filter(c => c.active === false)

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">العروض والكوبونات</h1>
          <p className="text-sm text-gray-400 mt-0.5">{coupons.length} كوبون</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 ml-1" />
          كوبون جديد
        </Button>
      </div>

      {isLoading ? (
        <CouponsSkeleton />
      ) : !coupons.length ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-gray-300" />
          </div>
          <p className="font-bold text-gray-700 text-lg mb-1">لا توجد كوبونات بعد</p>
          <p className="text-gray-400 text-sm mb-4">أنشئ كوبون خصم لاستقطاب عملاء جدد</p>
          <Button onClick={() => setShowForm(true)}>إنشاء أول كوبون</Button>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div>
              <h2 className="font-bold text-gray-700 mb-3">كوبونات نشطة ({active.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {active.map(c => (
                  <CouponCard
                    key={c.id}
                    coupon={c}
                    onDelete={() => setDeleteId(c.id)}
                    onToggle={() => toggleMut.mutate({ id: c.id, active: false })}
                  />
                ))}
              </div>
            </div>
          )}

          {inactive.length > 0 && (
            <div>
              <h2 className="font-bold text-gray-400 mb-3">كوبونات غير نشطة ({inactive.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
                {inactive.map(c => (
                  <CouponCard
                    key={c.id}
                    coupon={c}
                    onDelete={() => setDeleteId(c.id)}
                    onToggle={() => toggleMut.mutate({ id: c.id, active: true })}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="إنشاء كوبون جديد">
        <CouponForm
          onSubmit={(data) => createMut.mutate(data)}
          isLoading={createMut.isPending}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="حذف الكوبون"
        message="هل تريد حذف هذا الكوبون؟ لن يتمكن العملاء من استخدامه بعد الآن."
        confirmLabel="نعم، احذف"
        onConfirm={() => deleteMut.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMut.isPending}
        danger
      />
    </div>
  )
}
