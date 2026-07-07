import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus, Search, Package, LayoutGrid, List } from 'lucide-react'
import { getMyProducts, deleteMyProduct } from '@/api/seller.api'
import ProductManageCard from '@/components/seller/products/ProductManageCard'
import ProductsListRow from '@/components/seller/products/ProductsListRow'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import Pagination from '@/components/common/Pagination'
import Button from '@/components/common/Button'

const CATEGORIES = [
  { value: '', label: 'كل الفئات' },
  { value: 'fruits',      label: 'فواكه' },
  { value: 'vegetables',  label: 'خضروات' },
  { value: 'meat',        label: 'لحوم' },
  { value: 'dairy',       label: 'ألبان' },
  { value: 'drinks',      label: 'مشروبات' },
  { value: 'sweets',      label: 'حلويات' },
  { value: 'electronics', label: 'إلكترونيات' },
  { value: 'home',        label: 'منزل' },
]

function ProductsSkeleton({ view }) {
  if (view === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-sm divide-y">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
            <div className="w-14 h-14 bg-gray-100 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-48" />
              <div className="h-3 bg-gray-100 rounded w-24" />
            </div>
            <div className="h-6 bg-gray-100 rounded w-20" />
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm animate-pulse">
          <div className="h-40 bg-gray-100 rounded-t-2xl" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-5 bg-gray-100 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SellerProductsPage() {
  const qc = useQueryClient()
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage]         = useState(1)
  const [view, setView]         = useState('grid')
  const [deleteId, setDeleteId] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['seller-products', { search, category, page }],
    queryFn:  () => getMyProducts({ search, category, page, limit: 12 }),
    keepPreviousData: true,
  })

  const deleteMut = useMutation({
    mutationFn: deleteMyProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seller-products'] })
      qc.invalidateQueries({ queryKey: ['seller-stats'] })
      toast.success('تم حذف المنتج')
      setDeleteId(null)
    },
    onError: () => toast.error('تعذّر حذف المنتج'),
  })

  const products    = data?.products ?? []
  const totalPages  = data?.totalPages ?? 1
  const totalCount  = data?.total ?? 0

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h1>
          {!isLoading && (
            <p className="text-sm text-gray-400 mt-0.5">{totalCount} منتج</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link to="/seller/products/add">
            <Button>
              <Plus className="w-4 h-4 ml-1" />
              إضافة منتج
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="بحث عن منتج..."
            className="w-full pr-9 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none bg-white"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          {CATEGORIES.map(c => (
            <button
              key={c.value}
              onClick={() => { setCategory(c.value); setPage(1) }}
              className={`px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                category === c.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex bg-gray-100 rounded-xl p-0.5 shrink-0">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow' : 'text-gray-400'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow' : 'text-gray-400'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products */}
      {isLoading ? (
        <ProductsSkeleton view={view} />
      ) : !products.length ? (
        <EmptyState icon={Package} title="لا توجد منتجات" message="أضف منتجك الأول لتبدأ البيع" />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <ProductManageCard key={p.id} product={p} onDelete={setDeleteId} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm divide-y">
          {products.map(p => (
            <ProductsListRow key={p.id} product={p} onDelete={setDeleteId} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="حذف المنتج"
        message="هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="نعم، احذف"
        onConfirm={() => deleteMut.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMut.isPending}
        danger
      />
    </div>
  )
}
