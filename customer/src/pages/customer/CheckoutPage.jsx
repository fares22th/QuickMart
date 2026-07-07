import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, CreditCard, CheckCircle, ShoppingBag, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import AddressStep from '@/components/customer/checkout/AddressStep'
import PaymentStep from '@/components/customer/checkout/PaymentStep'
import OrderSummaryStep from '@/components/customer/checkout/OrderSummaryStep'
import { formatPrice } from '@/utils/formatPrice'

const STEPS = [
  { label: 'العنوان',       icon: MapPin },
  { label: 'الدفع',         icon: CreditCard },
  { label: 'مراجعة الطلب', icon: CheckCircle },
]

const DELIVERY_FEE = 15

export default function CheckoutPage() {
  const { items } = useCartStore()
  const [step, setStep]               = useState(0)
  const [address, setAddress]         = useState(null)
  const [paymentMethod, setPayment]   = useState('cash')

  /* ── Guard: empty cart ── */
  if (!items.length) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center" dir="rtl">
        <div className="w-24 h-24 mx-auto mb-5 rounded-3xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(0,200,150,0.1), rgba(0,200,150,0.05))' }}>
          <ShoppingBag className="w-12 h-12" style={{ color: '#00C896', opacity: 0.4 }} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">السلة فارغة</h2>
        <p className="text-gray-400 text-sm mb-7">أضف منتجات إلى سلتك أولاً لإتمام الطلب</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #00C896, #00A878)', boxShadow: '0 8px 20px rgba(0,200,150,0.3)' }}
        >
          <ShoppingBag className="w-4 h-4" />
          تسوق الآن
        </Link>
      </div>
    )
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const total    = subtotal + DELIVERY_FEE

  return (
    <div className="max-w-5xl mx-auto px-4 py-6" dir="rtl">

      {/* Page header */}
      <div className="flex items-center gap-3 mb-7">
        <Link to="/cart" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">إتمام الطلب</h1>
          <p className="text-sm text-gray-400 mt-0.5">أكمل الخطوات لتأكيد طلبك</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-start mb-8">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const done   = i < step
          const active = i === step
          return (
            <div key={s.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2 shrink-0 w-12">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: done
                      ? '#00C896'
                      : active
                        ? 'linear-gradient(135deg, #00C896, #00A878)'
                        : '#F1F5F9',
                    boxShadow: active ? '0 4px 14px rgba(0,200,150,0.35)' : undefined,
                  }}
                >
                  {done
                    ? <CheckCircle className="w-5 h-5 text-white" />
                    : <Icon className="w-5 h-5" style={{ color: active ? 'white' : '#94A3B8' }} />
                  }
                </div>
                <span
                  className="text-[11px] font-semibold whitespace-nowrap"
                  style={{ color: active ? '#00C896' : done ? '#059669' : '#94A3B8' }}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-1 mb-6 rounded-full transition-all duration-500"
                  style={{ background: i < step ? '#00C896' : '#E2E8F0' }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Content + sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Step content ── */}
        <div className="flex-1 min-w-0">
          {step === 0 && (
            <AddressStep
              defaultValues={address}
              onNext={(data) => { setAddress(data); setStep(1) }}
            />
          )}
          {step === 1 && (
            <PaymentStep
              defaultMethod={paymentMethod}
              onNext={(data) => { setPayment(data.paymentMethod); setStep(2) }}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <OrderSummaryStep
              address={address}
              paymentMethod={paymentMethod}
              onBack={() => setStep(1)}
            />
          )}
        </div>

        {/* ── Order summary sidebar (desktop, steps 0 & 1 only) ── */}
        {step < 2 && (
          <div className="hidden lg:block w-72 shrink-0">
            <div
              className="bg-white rounded-2xl p-5 shadow-sm sticky top-24 space-y-3 border border-gray-50"
            >
              <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2 pb-1">
                <ShoppingBag className="w-4 h-4" style={{ color: '#00C896' }} />
                ملخص الطلب ({items.length} منتج)
              </h3>

              {/* Items mini list */}
              <div className="space-y-2.5 max-h-52 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        : <ShoppingBag className="w-4 h-4 text-gray-300" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">×{item.qty}</p>
                    </div>
                    <p className="text-xs font-bold text-gray-700 shrink-0">
                      {formatPrice(item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>المجموع الفرعي</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>التوصيل</span>
                  <span>{formatPrice(DELIVERY_FEE)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1 border-t">
                  <span className="text-gray-900">الإجمالي</span>
                  <span style={{ color: '#00C896' }}>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Progress hint */}
              <div
                className="rounded-xl px-3 py-2.5 text-xs text-center font-medium"
                style={{ background: 'rgba(0,200,150,0.07)', color: '#059669' }}
              >
                {step === 0 ? '📍 أدخل عنوان التوصيل للمتابعة' : '💳 اختر طريقة الدفع للمتابعة'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
