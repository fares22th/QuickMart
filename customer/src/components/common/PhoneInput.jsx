import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Check } from 'lucide-react'

export const COUNTRIES = [
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'السعودية',    placeholder: '5xxxxxxxx' },
  { code: 'YE', dial: '+967', flag: '🇾🇪', name: 'اليمن',       placeholder: '7xxxxxxxx' },
  { code: 'JO', dial: '+962', flag: '🇯🇴', name: 'الأردن',      placeholder: '7xxxxxxxx' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'الإمارات',    placeholder: '5xxxxxxxx' },
  { code: 'KW', dial: '+965', flag: '🇰🇼', name: 'الكويت',      placeholder: '9xxxxxxx'  },
  { code: 'QA', dial: '+974', flag: '🇶🇦', name: 'قطر',         placeholder: '7xxxxxxx'  },
  { code: 'BH', dial: '+973', flag: '🇧🇭', name: 'البحرين',     placeholder: '3xxxxxxx'  },
  { code: 'OM', dial: '+968', flag: '🇴🇲', name: 'عُمان',       placeholder: '9xxxxxxx'  },
  { code: 'EG', dial: '+20',  flag: '🇪🇬', name: 'مصر',         placeholder: '10xxxxxxx' },
  { code: 'IQ', dial: '+964', flag: '🇮🇶', name: 'العراق',      placeholder: '7xxxxxxxx' },
  { code: 'SY', dial: '+963', flag: '🇸🇾', name: 'سوريا',       placeholder: '9xxxxxxx'  },
  { code: 'LB', dial: '+961', flag: '🇱🇧', name: 'لبنان',       placeholder: '7xxxxxxx'  },
  { code: 'PS', dial: '+970', flag: '🇵🇸', name: 'فلسطين',      placeholder: '5xxxxxxxx' },
  { code: 'LY', dial: '+218', flag: '🇱🇾', name: 'ليبيا',       placeholder: '9xxxxxxx'  },
  { code: 'TN', dial: '+216', flag: '🇹🇳', name: 'تونس',        placeholder: '2xxxxxxx'  },
  { code: 'DZ', dial: '+213', flag: '🇩🇿', name: 'الجزائر',     placeholder: '5xxxxxxxx' },
  { code: 'MA', dial: '+212', flag: '🇲🇦', name: 'المغرب',      placeholder: '6xxxxxxxx' },
  { code: 'SD', dial: '+249', flag: '🇸🇩', name: 'السودان',     placeholder: '9xxxxxxx'  },
  { code: 'SO', dial: '+252', flag: '🇸🇴', name: 'الصومال',     placeholder: '6xxxxxxx'  },
  { code: 'MR', dial: '+222', flag: '🇲🇷', name: 'موريتانيا',   placeholder: '2xxxxxxx'  },
  { code: 'TR', dial: '+90',  flag: '🇹🇷', name: 'تركيا',       placeholder: '5xxxxxxxxx' },
  { code: 'PK', dial: '+92',  flag: '🇵🇰', name: 'باكستان',     placeholder: '3xxxxxxxxx' },
  { code: 'IN', dial: '+91',  flag: '🇮🇳', name: 'الهند',       placeholder: '9xxxxxxxxx' },
  { code: 'GB', dial: '+44',  flag: '🇬🇧', name: 'المملكة المتحدة', placeholder: '7xxxxxxxxx' },
  { code: 'US', dial: '+1',   flag: '🇺🇸', name: 'أمريكا',      placeholder: 'xxxxxxxxxx' },
]

/**
 * PhoneInput — حقل إدخال الهاتف مع اختيار رمز الدولة
 *
 * Props:
 *  - value          : قيمة رقم الهاتف (بدون رمز الدولة)
 *  - onChange       : دالة تُستدعى بـ (phone, dialCode, country)
 *  - defaultCountry : رمز الدولة الافتراضية (e.g. 'SA')
 *  - error          : نص رسالة الخطأ
 *  - label          : العنوان (افتراضي: "رقم الهاتف")
 *  - name           : اسم الحقل للـ form (اختياري)
 */
export default function PhoneInput({
  value = '',
  onChange,
  defaultCountry = 'SA',
  error,
  label = 'رقم الهاتف',
  name,
  ...rest
}) {
  const [selected, setSelected]   = useState(() => COUNTRIES.find(c => c.code === defaultCountry) ?? COUNTRIES[0])
  const [open, setOpen]           = useState(false)
  const [search, setSearch]       = useState('')
  const dropdownRef               = useRef(null)
  const searchRef                 = useRef(null)

  // Full phone value: dial + local number
  const fullPhone = `${selected.dial}${value}`

  const filtered = COUNTRIES.filter(c =>
    c.name.includes(search) || c.dial.includes(search) || c.code.toLowerCase().includes(search.toLowerCase())
  )

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Focus search on open
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50)
  }, [open])

  const selectCountry = (country) => {
    setSelected(country)
    setOpen(false)
    setSearch('')
    onChange?.(value, country.dial, country)
  }

  const handlePhoneChange = (e) => {
    const v = e.target.value.replace(/\D/g, '')
    onChange?.(v, selected.dial, selected)
  }

  const hasError = !!error
  const borderCls = hasError
    ? 'border-red-400 focus-within:ring-red-200'
    : 'border-gray-200 focus-within:border-primary focus-within:ring-primary/20'

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      )}

      <div className={`relative flex items-center border rounded-2xl overflow-visible transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-0 ${borderCls}`} ref={dropdownRef}>

        {/* ── Country selector button ── */}
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 hover:bg-gray-100 border-l border-gray-200 shrink-0 transition-colors select-none rounded-r-2xl"
          style={{ borderLeft: 'none', borderRight: '1px solid #e5e7eb' }}
        >
          <span className="text-lg leading-none">{selected.flag}</span>
          <span className="text-sm font-medium text-gray-700 min-w-[2.8rem] text-left" dir="ltr">{selected.dial}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* ── Phone number input ── */}
        <input
          type="tel"
          inputMode="numeric"
          placeholder={selected.placeholder}
          dir="ltr"
          value={value}
          onChange={handlePhoneChange}
          name={name}
          className="flex-1 px-4 py-3 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
          {...rest}
        />

        {/* ── Dropdown ── */}
        {open && (
          <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="ابحث عن الدولة..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Country list */}
            <div className="overflow-y-auto max-h-60">
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-6">لا توجد نتائج</p>
              ) : (
                filtered.map(country => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => selectCountry(country)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-right"
                  >
                    <span className="text-xl shrink-0">{country.flag}</span>
                    <span className="flex-1 text-sm font-medium text-gray-700">{country.name}</span>
                    <span className="text-sm text-gray-400 font-mono shrink-0" dir="ltr">{country.dial}</span>
                    {selected.code === country.code && (
                      <Check className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden input for form libraries (react-hook-form) */}
      {name && (
        <input type="hidden" name={`${name}_full`} value={fullPhone} readOnly />
      )}

      {/* Error */}
      {hasError && (
        <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
