import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/useCartStore'
import CartItem from '@/components/customer/cart/CartItem'
import CartSummary from '@/components/customer/cart/CartSummary'
import EmptyState from '@/components/common/EmptyState'
import Button from '@/components/common/Button'

export default function CartPage() {
  const { items } = useCartStore()

  if (!items.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <EmptyState message="سلة التسوق فارغة" />
        <div className="text-center mt-4">
          <Link to="/">
            <Button>تسوق الآن</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">سلة التسوق</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-3">
          {items.map(item => <CartItem key={item.id} item={item} />)}
        </div>
        <div className="w-full lg:w-80">
          <CartSummary />
        </div>
      </div>
    </div>
  )
}
