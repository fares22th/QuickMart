import { CheckCircle, Circle } from 'lucide-react'

const STEPS = [
  { id: 'confirmed', label: 'تم تأكيد الطلب' },
  { id: 'preparing', label: 'جاري التحضير' },
  { id: 'shipped',   label: 'في الطريق إليك' },
  { id: 'delivered', label: 'تم التوصيل' },
]

export default function OrderSteps({ currentStep = 'preparing' }) {
  const currentIndex = STEPS.findIndex(s => s.id === currentStep)

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm mt-4">
      <h3 className="font-bold mb-4">حالة الطلب</h3>
      <div className="space-y-3">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center gap-3">
            {i <= currentIndex
              ? <CheckCircle className="w-5 h-5 text-primary shrink-0" />
              : <Circle className="w-5 h-5 text-gray-300 shrink-0" />
            }
            <span className={`text-sm ${i <= currentIndex ? 'font-medium text-gray-800' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
