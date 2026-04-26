import { useState } from 'react'
import { CreditCard, Banknote, Smartphone } from 'lucide-react'
import Button from '@/components/common/Button'

const PAYMENT_METHODS = [
  { id: 'cash',  label: 'الدفع عند الاستلام', desc: 'ادفع نقداً عند استلام طلبك',  icon: Banknote,    available: true },
  { id: 'card',  label: 'بطاقة بنكية',         desc: 'فيزا / ماستركارد / مدى',       icon: CreditCard,  available: true },
  { id: 'apple', label: 'Apple Pay',            desc: 'أسرع وأسهل طريقة للدفع',       icon: Smartphone,  available: false },
]

export default function PaymentStep({ onNext, onBack, defaultMethod }) {
  const [method, setMethod] = useState(defaultMethod ?? 'cash')

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="font-bold text-lg flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-green-600" /> طريقة الدفع
      </h2>

      <div className="space-y-3">
        {PAYMENT_METHODS.map(({ id, label, desc, icon: Icon, available }) => (
          <label key={id}
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
              !available ? 'opacity-50 cursor-not-allowed' :
              method === id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}>
            <input
              type="radio"
              value={id}
              checked={method === id}
              disabled={!available}
              onChange={() => available && setMethod(id)}
              className="hidden"
            />
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${method === id ? 'text-green-700' : 'text-gray-700'}`}>{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            {!available && (
              <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full">قريباً</span>
            )}
            {method === id && available && (
              <div className="w-5 h-5 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </label>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onBack} className="flex-1">السابق</Button>
        <Button onClick={() => onNext({ paymentMethod: method })} className="flex-1">
          التالي — مراجعة الطلب
        </Button>
      </div>
    </div>
  )
}
