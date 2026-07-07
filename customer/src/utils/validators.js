import { z } from 'zod'

export const phoneSchema = z.string().regex(/^05\d{8}$/, 'رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام')

export const loginSchema = z.object({
  phone:    phoneSchema,
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
})

export const registerSchema = z.object({
  name:            z.string().min(2, 'الاسم مطلوب'),
  phone:           phoneSchema,
  password:        z.string().min(6),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
})

export const productSchema = z.object({
  name:        z.string().min(2),
  price:       z.coerce.number().positive(),
  stock:       z.coerce.number().int().min(0),
  description: z.string().optional(),
  categoryId:  z.string().optional(),
})
