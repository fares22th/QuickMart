import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import AddressStep from '@/components/customer/checkout/AddressStep'
import PaymentStep from '@/components/customer/checkout/PaymentStep'
import OrderSummaryStep from '@/components/customer/checkout/OrderSummaryStep'

const STEPS = [
  { label: 'العنوان',      icon: '📍' },
  { label: 'الدفع',        icon: '💳' },
  { label: 'مراجعة الطلب', icon: '✅' },
]

export default function CheckoutPage() {
  const [step,    setStep]    = useState(0)
  const [address, setAddress] = useState(null)
  const [payment, setPayment] = useState(null)

  const handleAddressNext = (data) => {
    setAddress(data)
    setStep(1)
  }

  const handlePaymentNext = (data) => {
    setPayment(data)
    setStep(2)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">إتمام الطلب</h1>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i < step
                  ? 'bg-green-600 text-white shadow-md shadow-green-200'
                  : i === step
                    ? 'bg-green-600 text-white ring-4 ring-green-100'
                    : 'bg-gray-100 text-gray-400'
              }`}>
                {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${i === step ? 'text-green-600' : i < step ? 'text-gray-600' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-4 transition-colors duration-300 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {step === 0 && <AddressStep onNext={handleAddressNext} defaultValues={address} />}
      {step === 1 && <PaymentStep onNext={handlePaymentNext} onBack={() => setStep(0)} defaultMethod={payment?.paymentMethod} />}
      {step === 2 && (
        <OrderSummaryStep
          address={address}
          paymentMethod={payment?.paymentMethod}
          onBack={() => setStep(1)}
        />
      )}
    </div>
  )
}
