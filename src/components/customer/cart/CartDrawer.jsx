import { useCartStore } from '@/store/useCartStore'
import Drawer from '@/components/common/Drawer'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import EmptyState from '@/components/common/EmptyState'
import { ShoppingCart } from 'lucide-react'

export default function CartDrawer() {
  const { items, isOpen, close } = useCartStore()

  return (
    <Drawer open={isOpen} onClose={close} title="سلة التسوق" side="right">
      {!items.length
        ? <EmptyState message="السلة فارغة" icon={ShoppingCart} />
        : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map(item => <CartItem key={item.id} item={item} compact />)}
            </div>
            <div className="p-4 border-t">
              <CartSummary />
            </div>
          </div>
        )
      }
    </Drawer>
  )
}
