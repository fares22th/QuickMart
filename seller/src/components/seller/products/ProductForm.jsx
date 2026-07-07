import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { createMyProduct, updateMyProduct } from '@/api/seller.api'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import ImageUploader from './ImageUploader'

const CATEGORIES = [
  { value: 'fruits',       label: '🍎 فواكه' },
  { value: 'vegetables',   label: '🥦 خضروات' },
  { value: 'meat',         label: '🍗 لحوم ودواجن' },
  { value: 'dairy',        label: '🥛 ألبان وأجبان' },
  { value: 'bakery',       label: '🥖 مخبوزات' },
  { value: 'drinks',       label: '🥤 مشروبات' },
  { value: 'sweets',       label: '🍰 حلويات' },
  { value: 'care',         label: '🧴 عناية شخصية' },
  { value: 'electronics',  label: '📱 إلكترونيات' },
  { value: 'home',         label: '🏠 منزل ومطبخ' },
  { value: 'fashion',      label: '👗 ملابس' },
  { value: 'organic',      label: '🌿 منتجات عضوية' },
]

const schema = z.object({
  name:         z.string().min(2, 'اسم المنتج مطلوب (حرفان على الأقل)'),
  price:        z.coerce.number().positive('السعر يجب أن يكون أكبر من صفر'),
  comparePrice: z.coerce.number().min(0).optional(),
  stock:        z.coerce.number().int().min(0, 'الكمية لا يمكن أن تكون سالبة'),
  category:     z.string().min(1, 'اختر فئة المنتج'),
  description:  z.string().optional(),
  unit:         z.string().optional(),
})

export default function ProductForm({ product, onSuccess }) {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [imageFiles, setImageFiles] = useState(product?.images ?? [])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          name:         product.name,
          price:        product.price,
          comparePrice: product.comparePrice ?? '',
          stock:        product.stock,
          category:     product.category,
          description:  product.description ?? '',
          unit:         product.unit ?? '',
        }
      : { unit: 'قطعة' },
  })

  const createMut = useMutation({
    mutationFn: createMyProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seller-products'] })
      qc.invalidateQueries({ queryKey: ['seller-stats'] })
      toast.success('تم إضافة المنتج بنجاح')
      onSuccess?.()
    },
    onError: () => toast.error('تعذّر إضافة المنتج'),
  })

  const updateMut = useMutation({
    mutationFn: (data) => updateMyProduct(product.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seller-products'] })
      qc.invalidateQueries({ queryKey: ['seller-product', product.id] })
      toast.success('تم تحديث المنتج')
      onSuccess?.()
    },
    onError: () => toast.error('تعذّر تحديث المنتج'),
  })

  const onSubmit = (data) => {
    const payload = { ...data, images: imageFiles }
    if (product) {
      updateMut.mutate(payload)
    } else {
      createMut.mutate(payload)
    }
  }

  const isPending = createMut.isPending || updateMut.isPending || isSubmitting

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
      {/* Images */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">صور المنتج</h3>
        <ImageUploader
          existingImages={product?.images ?? []}
          onChange={setImageFiles}
        />
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800 mb-2">المعلومات الأساسية</h3>

        <Input
          label="اسم المنتج *"
          placeholder="مثال: تفاح أحمر طازج"
          error={errors.name?.message}
          {...register('name')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الفئة *</label>
          <select
            {...register('category')}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-primary focus:outline-none bg-white"
          >
            <option value="">— اختر الفئة —</option>
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="وصف تفصيلي للمنتج، مكوناته، مميزاته..."
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-primary focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Pricing & stock */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800 mb-2">السعر والمخزون</h3>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="السعر (ر.س) *"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.price?.message}
            {...register('price')}
          />
          <Input
            label="السعر قبل الخصم (اختياري)"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.comparePrice?.message}
            {...register('comparePrice')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="الكمية المتاحة *"
            type="number"
            placeholder="0"
            error={errors.stock?.message}
            {...register('stock')}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">وحدة القياس</label>
            <select
              {...register('unit')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-primary focus:outline-none bg-white"
            >
              <option value="قطعة">قطعة</option>
              <option value="كيلو">كيلو</option>
              <option value="غرام">غرام</option>
              <option value="لتر">لتر</option>
              <option value="علبة">علبة</option>
              <option value="باكيت">باكيت</option>
              <option value="حبة">حبة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" loading={isPending} className="flex-1">
          {product ? 'حفظ التعديلات' : 'إضافة المنتج'}
        </Button>
        <button
          type="button"
          onClick={() => navigate('/seller/products')}
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          إلغاء
        </button>
      </div>
    </form>
  )
}
