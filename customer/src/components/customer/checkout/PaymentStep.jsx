import { useState } from 'react'
import { CreditCard, Banknote, ChevronRight, ArrowLeft, ShieldCheck } from 'lucide-react'

const PAYMENT_METHODS = [
  {
    id:    'cash',
    label: 'الدفع عند الاستلام',
    desc:  'ادفع نقداً عند وصول طلبك',
    icon:  Banknote,
    color: '#059669',
    bg:    '#ECFDF5',
    border:'#6EE7B7',
  },
  {
    id:    'card',
    label: 'بطاقة ائتمان / مدى',
    desc:  'فيزا، ماستركارد، مدى',
    icon:  CreditCard,
    color: '#2563EB',
    bg:    '#EFF6FF',
    border:'#93C5FD',
  },
]

export default function PaymentStep({ onNext, onBack, defaultMethod = 'cash' }) {
  const [method, setMethod] = useState(defaultMethod)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">

      <h2 className="font-extrabold text-lg flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #00C896, #00A878)' }}>
          <CreditCard className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
        </div>
        طريقة الدفع
      </h2>

      <div className="space-y-3">
        {PAYMENT_METHODS.map(({ id, label, desc, icon: Icon, color, bg, border }) => {
          const selected = method === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setMethod(id)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-right"
              style={{
                borderColor: selected ? border : '#F1F5F9',
                background:  selected ? bg : '#FAFAFA',
                boxShadow:   selected ? `0 4px 16px ${color}22` : undefined,
              }}
            >
              {/* Radio indicator */}
              <span
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                style={{
                  borderColor: selected ? color : '#CBD5E1',
                  background:  selected ? color : 'white',
                }}
              >
                {selected && <span className="w-2 h-2 rounded-full bg-white" />}
              </span>

              {/* Icon */}
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: selected ? `${color}18` : '#F1F5F9' }}
              >
                <Icon className="w-5 h-5" style={{ color: selected ? color : '#94A3B8' }} />
              </span>

              {/* Text */}
              <div className="flex-1 min-w-0 text-start">
                <p className="font-bold text-sm" style={{ color: selected ? '#0F172A' : '#475569' }}>{label}</p>
                <p className="text-xs mt-0.5" style={{ color: selected ? color : '#94A3B8' }}>{desc}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2.5">
        <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
        جميع المعاملات مشفّرة وآمنة بالكامل
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-1">
        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 px-4 py-4 rounded-2xl text-sm font-bold border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
          السابق
        </button>

        {/* Next — prominent */}
        <button
          type="button"
          onClick={() => onNext({ paymentMethod: method })}
          className="flex-1 py-4 rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.97] hover:opacity-95"
          style={{
            background: 'linear-gradient(135deg, #00C896 0%, #059669 100%)',
            boxShadow: '0 8px 28px rgba(0,200,150,0.5)',
          }}
        >
          التالي — مراجعة الطلب
          <ArrowLeft className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  )
}
