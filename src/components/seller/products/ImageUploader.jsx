import { useState, useRef, useCallback } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'

export default function ImageUploader({ onChange, existingUrls = [] }) {
  const [files, setFiles]       = useState([])
  const [previews, setPreviews] = useState(existingUrls)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const addFiles = useCallback((incoming) => {
    const newFiles    = [...files, ...incoming]
    const newPreviews = [...existingUrls, ...newFiles.map(f => URL.createObjectURL(f))]
    setFiles(newFiles)
    setPreviews(newPreviews)
    onChange?.(newFiles, previews.filter(u => !u.startsWith('blob:')))
  }, [files, existingUrls, onChange])

  const remove = (i) => {
    const newPreviews = previews.filter((_, idx) => idx !== i)
    const blobCount  = previews.slice(0, i).filter(u => u.startsWith('blob:')).length
    const newFiles   = files.filter((_, fi) => fi !== blobCount)
    setPreviews(newPreviews)
    setFiles(newFiles)
    onChange?.(newFiles, newPreviews.filter(u => !u.startsWith('blob:')))
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (dropped.length) addFiles(dropped)
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        صور المنتج
        <span className="text-gray-400 font-normal mr-1">(حتى ٥ صور)</span>
      </label>

      <div className="flex flex-wrap gap-3 mb-3">
        {previews.map((url, i) => (
          <div key={i}
            className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            {i === 0 && (
              <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                رئيسية
              </span>
            )}
            <button type="button" onClick={() => remove(i)}
              className="absolute top-1 left-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {previews.length < 5 && (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`w-24 h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all select-none
              ${dragging
                ? 'border-[#00C896] bg-[#E6FAF5] text-[#00C896]'
                : 'border-gray-200 text-gray-400 hover:border-[#00C896] hover:text-[#00C896] hover:bg-[#f0fdf9]'}`}>
            {dragging ? <ImageIcon className="w-6 h-6" /> : <Upload className="w-5 h-5" />}
            <span className="text-[11px] font-medium">{dragging ? 'أفلت هنا' : 'إضافة'}</span>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400">الصورة الأولى ستكون الصورة الرئيسية للمنتج</p>
      <input ref={inputRef} type="file" multiple accept="image/*"
        onChange={(e) => addFiles(Array.from(e.target.files))}
        className="hidden" />
    </div>
  )
}
