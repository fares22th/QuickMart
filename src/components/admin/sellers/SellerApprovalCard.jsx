import { Link } from 'react-router-dom'
import { Store, MapPin, Tag, Phone, CheckCircle, XCircle, ExternalLink } from 'lucide-react'

const STATUS_META = {
  pending:   { label: 'معلق',   color: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-400' },
  active:    { label: 'نشط',    color: 'bg-green-50 text-green-700 ring-green-200',  dot: 'bg-green-500' },
  rejected:  { label: 'مرفوض', color: 'bg-red-50 text-red-700 ring-red-200',       dot: 'bg-red-500'   },
  suspended: { label: 'موقوف', color: 'bg-slate-50 text-slate-600 ring-slate-200', dot: 'bg-slate-400' },
}

export default function SellerApprovalCard({ seller, onApprove, onReject }) {
  const meta = STATUS_META[seller?.status] ?? STATUS_META.pending

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Cover strip */}
      <div className="h-2 w-full"
        style={{ background: seller?.status === 'active' ? '#16a34a' : seller?.status === 'pending' ? '#f59e0b' : '#ef4444' }} />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
            {seller?.logo_url
              ? <img src={seller.logo_url} alt="" className="w-full h-full rounded-xl object-cover" />
              : <Store className="w-5 h-5 text-gray-400" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 truncate">{seller?.storeName ?? seller?.name ?? '—'}</p>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ring-1 mt-1 ${meta.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2.5 text-sm">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Tag className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{seller?.category ?? '—'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{seller?.city ?? '—'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 col-span-2">
            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span dir="ltr">{seller?.seller_profiles?.phone ?? seller?.phone ?? '—'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          {seller?.status === 'pending' && (
            <>
              <button onClick={onApprove}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 active:scale-95">
                <CheckCircle className="w-3.5 h-3.5" /> موافقة
              </button>
              <button onClick={onReject}
                className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-red-200 active:scale-95">
                <XCircle className="w-3.5 h-3.5" /> رفض
              </button>
            </>
          )}
          {seller?.id && (
            <Link to={`/admin/sellers/${seller.id}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold transition-colors border border-gray-100">
              <ExternalLink className="w-3.5 h-3.5" /> تفاصيل
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
