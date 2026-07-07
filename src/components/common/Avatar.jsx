import { cn } from '@/utils/cn'

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' }

export default function Avatar({ src, name, size = 'md', className }) {
  const initials = name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'

  return src
    ? <img src={src} alt={name} className={cn('rounded-full object-cover', sizes[size], className)} />
    : (
      <div className={cn('rounded-full bg-primary text-white flex items-center justify-center font-bold', sizes[size], className)}>
        {initials}
      </div>
    )
}
