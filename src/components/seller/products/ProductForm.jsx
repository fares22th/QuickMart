import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import ImageUploader from './ImageUploader'

const schema = z.object({
  name:        z.string().min(2, 'الاسم مطلوب'),
  price:       z.coerce.number().positive('السعر يجب أن يكون موجباً'),
  stock:       z.coerce.number().int().min(0),
  description: z.string().optional(),
})

export default function ProductForm({ product, onSuccess }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: product,
  })

  const onSubmit = async (data) => {
    console.log('Save product:', data)
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
      <ImageUploader />
      <Input label="اسم المنتج" error={errors.name?.message} {...register('name')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="السعر (ر.س)" type="number" step="0.01" error={errors.price?.message} {...register('price')} />
        <Input label="الكمية" type="number" error={errors.stock?.message} {...register('stock')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
        <textarea
          {...register('description')}
          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-primary focus:outline-none resize-none h-28"
          placeholder="وصف المنتج..."
        />
      </div>
      <Button type="submit" loading={isSubmitting} className="w-full">
        {product ? 'حفظ التعديلات' : 'إضافة المنتج'}
      </Button>
    </form>
  )
}
