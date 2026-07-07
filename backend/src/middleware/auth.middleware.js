import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'

export function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'غير مصرح' })
  }

  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: 'الجلسة منتهية، يرجى تسجيل الدخول مجدداً' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ error: 'غير مصرح بالوصول' })
    }
    next()
  }
}

export const requireSeller = requireRole('seller')
export const requireAdmin  = requireRole('admin')
export const requireCustomer = requireRole('customer', 'seller', 'admin')
