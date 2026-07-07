import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Package, MapPin, CheckCircle, ChevronRight } from 'lucide-react'
import { getOrderHistory } from '@/api/driver.api'

function formatPrice(n) {
  return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(n ?? 0)
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function OrderHistoryPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['order-history', page],
    queryFn: () => getOrderHistory(page),
    keepPreviousData: true,
  })

  const orders     = data?.orders ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="flex flex-col min-h-dvh pb-24" dir="rtl" style={{ background: '#0F0800' }}>
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{ background: 'linear-gradient(160deg, #1A0900 0%, #0F0800 100%)' }}
      >
        <h1 className="text-2xl font-black text-white mb-1">سجل التوصيلات</h1>
        <p className="text-gray-500 text-sm">{data?.total ?? 0} توصيلة منجزة</p>
      </div>

      <div className="flex-1 px-5 pt-2">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-3xl p-4 animate-pulse" style={{ background: '#1C1009', height: 100 }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4"
              style={{ background: '#1C1009', border: '1px solid #2E1A00' }}
            >
              <Package className="w-10 h-10 text-gray-600" />
            </div>
            <p className="text-gray-400 font-bold">لا يوجد سجل</p>
            <p className="text-gray-600 text-sm mt-1">ستظهر توصيلاتك المنجزة هنا</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(o => (
              <div
                key={o.id}
                className="rounded-3xl p-4 flex items-center gap-3"
                style={{ background: '#1C1009', border: '1px solid #2E1A00' }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: '#062E1A' }}
                >
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white text-sm truncate">{o.store?.storeName}</p>
                    <span className="text-orange-400 font-black text-sm shrink-0 mr-2">{formatPrice(o.total)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {o.address && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-600" />
                        <span className="text-gray-500 text-xs truncate">
                          {[o.address.city, o.address.district].filter(Boolean).join(' - ')}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs mt-1">{formatDate(o.updatedAt)}</p>
                </div>
                <div
                  className="shrink-0 text-xs font-bold px-2 py-1 rounded-xl"
                  style={{ background: '#1A3D2A', color: '#22C55E' }}
                >
                  +10 ر.س
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 py-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-30"
              style={{ background: '#1C1009', color: '#F97316', border: '1px solid #2E1A00' }}
            >
              السابق
            </button>
            <span className="text-gray-500 text-sm">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-30"
              style={{ background: '#1C1009', color: '#F97316', border: '1px solid #2E1A00' }}
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
