import Button from '@/components/common/Button'

export default function SellerApprovalCard({ seller, onApprove, onReject }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><p className="text-gray-500">اسم البائع</p><p className="font-medium">{seller?.name ?? '—'}</p></div>
        <div><p className="text-gray-500">المتجر</p><p className="font-medium">{seller?.storeName ?? '—'}</p></div>
        <div><p className="text-gray-500">الجوال</p><p className="font-medium">{seller?.phone ?? '—'}</p></div>
        <div><p className="text-gray-500">رقم السجل</p><p className="font-medium">{seller?.crNumber ?? '—'}</p></div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button onClick={onApprove} className="flex-1">قبول</Button>
        <Button variant="danger" onClick={onReject} className="flex-1">رفض</Button>
      </div>
    </div>
  )
}
