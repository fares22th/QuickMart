import { Link } from 'react-router-dom'
import { Heart, User, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useAuthStore } from '@/store/useAuthStore'

export default function NavActions() {
  const { items } = useCartStore()
  const { user } = useAuthStore()
  const totalItems = items.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-xl">
        <Heart className="w-5 h-5 text-gray-600" />
      </Link>
      <Link to={user ? '/profile' : '/login'} className="p-2 hover:bg-gray-100 rounded-xl">
        <User className="w-5 h-5 text-gray-600" />
      </Link>
      <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-xl">
        <ShoppingCart className="w-5 h-5 text-gray-600" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
            {totalItems}
          </span>
        )}
      </Link>
    </div>
  )
}
