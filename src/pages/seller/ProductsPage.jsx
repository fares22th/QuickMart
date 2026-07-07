import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import ProductsGrid from '@/components/seller/products/ProductsGrid'
import ImportExcelBtn from '@/components/seller/products/ImportExcelBtn'
import Button from '@/components/common/Button'

export default function SellerProductsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
        <div className="flex gap-2">
          <ImportExcelBtn />
          <Link to="/seller/products/add">
            <Button><Plus className="w-4 h-4 ml-1" /> إضافة منتج</Button>
          </Link>
        </div>
      </div>
      <ProductsGrid />
    </div>
  )
}
