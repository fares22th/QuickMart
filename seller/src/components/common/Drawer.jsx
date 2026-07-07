import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Drawer({ open, onClose, title, side = 'right', children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
      <div className={`fixed top-0 ${side === 'right' ? 'right-0' : 'left-0'} h-full w-80 bg-white z-50 shadow-2xl transition-transform duration-300
        ${open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-65px)]">{children}</div>
      </div>
    </>
  )
}
