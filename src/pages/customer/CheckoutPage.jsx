import { useState } from 'react'
import AddressStep from '@/components/customer/checkout/AddressStep'
import PaymentStep from '@/components/customer/checkout/PaymentStep'
import OrderSummaryStep from '@/components/customer/checkout/OrderSummaryStep'

const STEPS = ['العنوان', 'الدفع', 'مراجعة الطلب']

export default function CheckoutPage() {
  const [step, setStep] = useState(0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">إتمام الطلب</h1>

      <div className="flex items-center mb-8 gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${i <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i + 1}
            </div>
            <span className={`text-sm ${i === step ? 'font-bold text-primary' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-gray-200 min-w-4" />}
          </div>
        ))}
      </div>

      {step === 0 && <AddressStep onNext={() => setStep(1)} />}
      {step === 1 && <PaymentStep onNext={() => setStep(2)} onBack={() => setStep(0)} />}
      {step === 2 && <OrderSummaryStep onBack={() => setStep(1)} />}
    </div>
  )
}
