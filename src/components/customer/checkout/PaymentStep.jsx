import { useState } from 'react'
import { CreditCard, Banknote } from 'lucide-react'
import Button from '@/components/common/Button'

const PAYMENT_METHODS = [
  { id: 'cash',   label: 'الدفع عند الاستلام', icon: Banknote },
  { id: 'card',   label: 'بطاقة ائتمان',        icon: CreditCard },
]

export default function PaymentStep({ onNext, onBack }) {
  const [method, setMethod] = useState('cash')

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="font-bold text-lg">طريقة الدفع</h2>
      {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
        <label key={id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors
          ${method === id ? 'border-primary bg-primary-light' : 'border-gray-200 hover:border-gray-300'}`}>
          <input type="radio" value={id} checked={method === id} onChange={() => setMethod(id)} className="hidden" />
          <Icon className={`w-5 h-5 ${method === id ? 'text-primary' : 'text-gray-500'}`} />
          <span className="font-medium">{label}</span>
        </label>
      ))}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">السابق</Button>
        <Button onClick={() => onNext({ paymentMethod: method })} className="flex-1">التالي</Button>
      </div>
    </div>
  )
}
