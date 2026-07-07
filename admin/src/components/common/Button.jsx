import { cn } from '@/utils/cn'
import Spinner from './Spinner'

const variants = {
  primary: {
    className: 'text-white border-0',
    style: {
      background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
      boxShadow: '0 6px 20px rgba(99,102,241,0.45)',
    },
    hoverStyle: {
      background: 'linear-gradient(135deg, #5558E8 0%, #4338CA 100%)',
      boxShadow: '0 8px 24px rgba(99,102,241,0.55)',
    },
  },
  danger: {
    className: 'text-white border-0',
    style: {
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      boxShadow: '0 6px 20px rgba(239,68,68,0.40)',
    },
  },
  success: {
    className: 'text-white border-0',
    style: {
      background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
      boxShadow: '0 6px 20px rgba(34,197,94,0.40)',
    },
  },
  outline: {
    className: 'text-indigo-600 bg-white border-2 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50',
    style: {},
  },
  ghost: {
    className: 'text-gray-600 hover:bg-gray-100 border border-transparent',
    style: {},
  },
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size    = 'md',
  loading = false,
  disabled = false,
  className,
  style: extraStyle,
  ...props
}) {
  const v = variants[variant] ?? variants.primary

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-200 active:scale-95',
        v.className,
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className,
      )}
      style={{ ...v.style, ...extraStyle }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
