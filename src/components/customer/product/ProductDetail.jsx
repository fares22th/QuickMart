import { useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/utils/formatPrice'
import ProductImages from './ProductImages'
import QuantitySelector from './QuantitySelector'
import Button from '@/components/common/Button'
import StarRating from '@/components/common/StarRating'

export default function ProductDetail({ product }) {
  const [qty, setQty] = useState(1)
  const { addItem } = useCartStore()

  if (!product) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ProductImages images={product.images} />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="flex items-center gap-2">
          <StarRating value={product.rating} readonly />
          <span className="text-sm text-gray-500">({product.reviewsCount} تقييم)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <p className="text-gray-600">{product.description}</p>
        <QuantitySelector value={qty} onChange={setQty} max={product.stock} />
        <Button className="w-full" onClick={() => { for (let i = 0; i < qty; i++) addItem(product) }}>
          أضف إلى السلة
        </Button>
      </div>
    </div>
  )
}
