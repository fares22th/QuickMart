import { useState, useRef } from 'react'
import { ImagePlus, X, Camera } from 'lucide-react'
import { toast } from 'sonner'

const MAX_IMAGES = 5
const MAX_SIZE_MB = 2

export default function ImageUploader({ existingImages = [], onChange }) {
  const [images, setImages] = useState(existingImages)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        reject(new Error(`الصورة أكبر من ${MAX_SIZE_MB}MB`))
        return
      }
      const reader = new FileReader()
      reader.onload  = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const processFiles = async (files) => {
    const remaining = MAX_IMAGES - images.length
    const toProcess = files.slice(0, remaining)
    if (!toProcess.length) return
    setLoading(true)
    try {
      const base64s = await Promise.all(toProcess.map(toBase64))
      const updated = [...images, ...base64s]
      setImages(updated)
      onChange?.(updated)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files)
    await processFiles(files)
    e.target.value = ''
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    await processFiles(files)
  }

  const remove = (i) => {
    const updated = images.filter((_, idx) => idx !== i)
    setImages(updated)
    onChange?.(updated)
  }

  return (
    <div className="space-y-3">
      {/* Preview grid */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative group">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm">
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Delete button */}
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-600 z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {/* Main badge */}
              {i === 0 && (
                <span
                  className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-white text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap shadow"
                  style={{ background: 'linear-gradient(135deg, #00C896, #00A878)' }}
                >
                  رئيسية
                </span>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
          ))}

          {/* Add more button (compact) */}
          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all"
              style={{ borderColor: '#00C896', background: 'rgba(0,200,150,0.04)', color: '#00A878' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00C896', borderTopColor: 'transparent' }} />
              ) : (
                <>
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-xs font-semibold">إضافة</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Drop zone — shown only when no images yet */}
      {images.length === 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className="relative cursor-pointer rounded-2xl border-2 border-dashed transition-all overflow-hidden"
          style={{
            borderColor: dragging ? '#00C896' : '#D1D5DB',
            background: dragging ? 'rgba(0,200,150,0.06)' : '#FAFAFA',
            minHeight: 140,
          }}
        >
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center select-none">
            {loading ? (
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-3"
                style={{ borderColor: '#00C896', borderTopColor: 'transparent' }} />
            ) : (
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md"
                style={{ background: 'linear-gradient(135deg, #00C896, #00A878)' }}
              >
                <ImagePlus className="w-7 h-7 text-white" />
              </div>
            )}
            <p className="text-sm font-semibold text-gray-700">
              اسحب الصور هنا أو <span style={{ color: '#00C896' }}>اختر من الجهاز</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP • حد أقصى {MAX_SIZE_MB}MB للصورة</p>
          </div>

          {/* Animated border glow on drag */}
          {dragging && (
            <div className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ boxShadow: 'inset 0 0 0 2px #00C896' }} />
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFiles}
        className="hidden"
      />

      <p className="text-xs" style={{ color: '#9CA3AF' }}>
        {images.length}/{MAX_IMAGES} صور • الصورة الأولى هي الرئيسية للمنتج
      </p>
    </div>
  )
}
