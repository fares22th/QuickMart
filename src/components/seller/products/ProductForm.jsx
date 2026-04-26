import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2, Tag, X, AlertCircle } from 'lucide-react'
import { getCategories } from '@/api/categories.api'
import { getMyStore } from '@/api/stores.api'
import { createProduct, updateProduct, uploadProductImages, isValidUuid } from '@/api/products.api'
import ImageUploader from './ImageUploader'

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
// category_id MUST be z.string() — NOT z.coerce.number().
// The categories table uses UUID primary keys. z.coerce.number("") → 0, and
// z.coerce.number("<uuid-string>") → NaN, both break Supabase's uuid column.
// ---------------------------------------------------------------------------
const schema = z.object({
  name:        z.string().min(2, 'اسم المنتج مطلوب'),
  description: z.string().min(10, 'الوصف يجب ألا يقل عن ١٠ أحرف'),
  price:       z.coerce.number().positive('السعر يجب أن يكون موجباً'),
  discount:    z.coerce.number().min(0).max(100).default(0),
  stock:       z.coerce.number().int().min(0, 'الكمية لا تقل عن صفر'),
  unit:        z.string().default('قطعة'),
  // Keep as string — UUID or "" (empty = no category, stripped before submit)
  category_id: z.string().optional(),
  is_new:      z.boolean().default(false),
  is_featured: z.boolean().default(false),
})

const UNITS = ['قطعة', 'كيلو', 'غرام', 'لتر', 'مل', 'علبة', 'كرتون', 'دستة', 'متر']

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------
function Field({ label, error, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />{error}
        </p>
      )}
    </div>
  )
}

const inp = (err) =>
  `w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all
   ${err
     ? 'border-red-400 focus:ring-2 focus:ring-red-100'
     : 'border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/10'}`

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ProductForm({ product, onSuccess }) {
  const qc = useQueryClient()
  const [newFiles, setNewFiles] = useState([])
  const [keptUrls, setKeptUrls] = useState(product?.images ?? [])
  const [tags,     setTags]     = useState(product?.tags ?? [])
  const [tagInput, setTagInput] = useState('')

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn:  getCategories,
  })

  const { data: store, isLoading: storeLoading, error: storeError } = useQuery({
    queryKey: ['my-store'],
    queryFn:  getMyStore,
  })

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          ...product,
          discount:    product.discount ?? 0,
          // category_id from DB is a UUID string — pass it as-is
          category_id: product.category_id ?? '',
        }
      : {
          discount:    0,
          stock:       0,
          unit:        'قطعة',
          is_new:      false,
          is_featured: false,
          category_id: '',
        },
  })

  useEffect(() => {
    if (product) {
      setKeptUrls(product.images ?? [])
      setTags(product.tags ?? [])
    }
  }, [product])

  // -------------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------------
  const mutation = useMutation({
    mutationFn: async (formData) => {
      // Guard: store must be loaded and have a real UUID
      if (!store?.id) throw new Error('لم يتم العثور على متجرك — حاول تحديث الصفحة')
      if (!isValidUuid(store.id)) throw new Error(`معرّف المتجر غير صالح: "${store.id}"`)

      // Build base payload — intentionally exclude category_id if empty/invalid
      const base = {
        name:        formData.name,
        description: formData.description,
        price:       formData.price,
        discount:    formData.discount ?? 0,
        stock:       formData.stock,
        unit:        formData.unit,
        is_new:      formData.is_new,
        is_featured: formData.is_featured,
        store_id:    store.id,
        tags,
      }

      // Only attach category_id when it is a valid UUID
      if (isValidUuid(formData.category_id)) {
        base.category_id = formData.category_id
      }

      console.debug('[ProductForm] base payload →', base)

      if (product) {
        // --- UPDATE flow ---
        let imageUrls = [...keptUrls]
        if (newFiles.length) {
          const uploaded = await uploadProductImages(product.id, newFiles)
          imageUrls = [...imageUrls, ...uploaded]
        }
        return updateProduct(product.id, { ...base, images: imageUrls })
      }

      // --- CREATE flow: two-phase so images are stored under the real UUID ---
      // Phase 1: insert row without images to get a real UUID from Supabase
      const created = await createProduct({ ...base, images: [] })

      // Phase 2: upload images using the real product UUID, then update
      if (newFiles.length) {
        const uploaded = await uploadProductImages(created.id, newFiles)
        return updateProduct(created.id, { images: uploaded })
      }

      return created
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seller-products'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success(product ? 'تم تحديث المنتج ✓' : 'تم إضافة المنتج بنجاح ✓')
      if (!product) {
        reset()
        setNewFiles([])
        setKeptUrls([])
        setTags([])
      }
      onSuccess?.()
    },

    onError: (err) => {
      console.error('[ProductForm] submit error:', err)
      toast.error(err.message || 'حدث خطأ غير متوقع')
    },
  })

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags(p => [...p, t])
      setTagInput('')
    }
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  if (storeLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex items-center justify-center gap-3 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">جاري تحميل بيانات المتجر...</span>
      </div>
    )
  }

  if (storeError || !store) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="font-bold text-red-600 mb-1">تعذّر تحميل بيانات المتجر</p>
        <p className="text-sm text-gray-500">
          {storeError?.message || 'يجب إنشاء متجرك أولاً قبل إضافة منتجات'}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(d => mutation.mutateAsync(d))}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6"
    >
      {/* Images */}
      <ImageUploader
        existingUrls={keptUrls}
        onChange={(files, kept) => { setNewFiles(files); setKeptUrls(kept) }}
      />

      {/* Name */}
      <Field label="اسم المنتج" error={errors.name?.message}>
        <input
          placeholder="مثال: تفاح أحمر طازج ١ كيلو"
          className={inp(errors.name)}
          {...register('name')}
        />
      </Field>

      {/* Description */}
      <Field
        label="وصف المنتج"
        error={errors.description?.message}
        hint="اشرح مميزات المنتج، مكوناته، طريقة الاستخدام..."
      >
        <textarea
          rows={4}
          placeholder="أضف وصفاً تفصيلياً يساعد المشتري على اتخاذ قراره..."
          className={`${inp(errors.description)} resize-none`}
          {...register('description')}
        />
      </Field>

      {/* Price + Discount + Stock + Unit */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Field label="السعر (ر.س)" error={errors.price?.message}>
          <input type="number" step="0.01" placeholder="0.00"
            className={inp(errors.price)} {...register('price')} />
        </Field>
        <Field label="الخصم %" error={errors.discount?.message} hint="0 = لا خصم">
          <input type="number" min="0" max="100" placeholder="0"
            className={inp(errors.discount)} {...register('discount')} />
        </Field>
        <Field label="الكمية" error={errors.stock?.message}>
          <input type="number" min="0" placeholder="0"
            className={inp(errors.stock)} {...register('stock')} />
        </Field>
        <Field label="الوحدة" error={errors.unit?.message}>
          <select className={inp(errors.unit)} {...register('unit')}>
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </Field>
      </div>

      {/* Category — value is UUID string or "" */}
      <Field label="التصنيف" error={errors.category_id?.message}>
        <select className={inp(errors.category_id)} {...register('category_id')}>
          <option value="">— اختر التصنيف (اختياري) —</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
          ))}
        </select>
      </Field>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          الكلمات المفتاحية
          <span className="text-gray-400 font-normal mr-1">(تساعد على البحث)</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(t => (
            <span key={t}
              className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
              <Tag className="w-3 h-3" />{t}
              <button
                type="button"
                onClick={() => setTags(p => p.filter(x => x !== t))}
                className="hover:text-red-500 transition-colors ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            placeholder="أضف كلمة ثم Enter..."
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-600"
          />
          <button type="button" onClick={addTag}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors">
            إضافة
          </button>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-6 py-2 border-t border-gray-50">
        {[
          { name: 'is_new',      label: 'منتج جديد',  desc: 'يظهر شارة "جديد"' },
          { name: 'is_featured', label: 'منتج مميز',  desc: 'يظهر في المقترحات' },
        ].map(({ name, label, desc }) => (
          <label key={name} className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only peer" {...register(name)} />
              <div className="w-10 h-6 bg-gray-200 peer-checked:bg-green-600 rounded-full transition-colors" />
              <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow transition-all peer-checked:translate-x-[-100%] peer-checked:right-auto peer-checked:left-0.5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={mutation.isPending || isSubmitting}
        className="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/25"
      >
        {mutation.isPending
          ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري الحفظ...</>
          : product ? 'حفظ التعديلات' : 'إضافة المنتج'}
      </button>
    </form>
  )
}
