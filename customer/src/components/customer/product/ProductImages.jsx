import { useState } from 'react'

export default function ProductImages({ images = [] }) {
  const [active, setActive] = useState(0)

  return (
    <div className="space-y-3">
      <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        {images[active] && <img src={images[active]} alt="" className="w-full h-full object-cover" />}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === active ? 'border-primary' : 'border-transparent'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
