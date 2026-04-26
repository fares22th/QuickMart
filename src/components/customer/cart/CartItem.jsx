import { Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/utils/formatPrice'
import QuantitySelector from '../product/QuantitySelector'

export default function CartItem({ item, compact = false }) {
  const { removeItem, updateQty } = useCartStore()

  return (
    <div className="flex gap-3 bg-white rounded-2xl p-3 shadow-sm">
      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.name}</p>
        <p className="text-primary font-bold text-sm mt-1">{formatPrice(item.price)}</p>
        {!compact && (
          <div className="flex items-center justify-between mt-2">
            <QuantitySelector value={item.qty} onChange={qty => updateQty(item.id, qty)} />
            <button onClick={() => removeItem(item.id)} className="p-1.5 text-red-400 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      {compact && (
        <div className="shrink-0 text-right">
          <span className="text-sm text-gray-500">x{item.qty}</span>
          <p className="font-bold text-sm text-primary">{formatPrice(item.price * item.qty)}</p>
        </div>
      )}
    </div>
  )
}
