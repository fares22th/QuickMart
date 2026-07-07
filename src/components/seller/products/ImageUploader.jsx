import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'

export default function ImageUploader({ onChange }) {
  const [previews, setPreviews] = useState([])
  const inputRef = useRef()

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    const urls = files.map(f => URL.createObjectURL(f))
    setPreviews(prev => [...prev, ...urls])
    onChange?.(files)
  }

  const remove = (i) => setPreviews(prev => prev.filter((_, idx) => idx !== i))

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">صور المنتج</label>
      <div className="flex flex-wrap gap-3">
        {previews.map((url, i) => (
          <div key={i} className="relative w-20 h-20">
            <img src={url} alt="" className="w-full h-full object-cover rounded-xl" />
            <button type="button" onClick={() => remove(i)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"
        >
          <Upload className="w-5 h-5" />
          <span className="text-xs mt-1">إضافة</span>
        </button>
      </div>
      <input ref={inputRef} type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
    </div>
  )
}
