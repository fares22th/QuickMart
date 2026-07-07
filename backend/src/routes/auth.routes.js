import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { signAccess, signRefresh, verifyRefresh } from '../lib/jwt.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

// Normalize Saudi phone to 05xxxxxxxx; leave other countries unchanged
function normalizePhone(phone) {
  if (!phone) return phone
  phone = String(phone).replace(/[\s\-()]/g, '')
  if (phone.startsWith('+966')) {
    const local = phone.slice(4)
    return local.startsWith('0') ? local : '0' + local
  }
  if (phone.startsWith('00966')) {
    const local = phone.slice(5)
    return local.startsWith('0') ? local : '0' + local
  }
  return phone
}

// ── Register ──────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, password, role = 'customer' } = req.body
    const phone = normalizePhone(req.body.phone)
    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' })
    }
    const exists = await prisma.user.findUnique({ where: { phone } })
    if (exists) return res.status(409).json({ error: 'رقم الهاتف مسجل مسبقاً' })

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, phone, password: hashed, role },
    })

    // If registering as seller, create store placeholder
    if (role === 'seller') {
      await prisma.store.create({
        data: { sellerId: user.id, storeName: `متجر ${name}` },
      })
    }

    const payload = { id: user.id, role: user.role }
    const accessToken  = signAccess(payload)
    const refreshToken = signRefresh(payload)

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    })

    res.status(201).json({
      user:  { id: user.id, name: user.name, phone: user.phone, role: user.role, avatar: user.avatar },
      token: accessToken,
      refreshToken,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ── Login ─────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone)
    const { password } = req.body
    const user = await prisma.user.findUnique({ where: { phone } })
    if (!user) return res.status(401).json({ error: 'رقم الهاتف أو كلمة المرور غير صحيحة' })
    if (user.status === 'banned') return res.status(403).json({ error: 'تم حظر هذا الحساب' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'رقم الهاتف أو كلمة المرور غير صحيحة' })

    const payload = { id: user.id, role: user.role }
    const accessToken  = signAccess(payload)
    const refreshToken = signRefresh(payload)

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        type: user.role === 'customer' ? 'customer' : 'seller',
        message: `${user.name} سجّل الدخول`,
        userId: user.id,
      },
    }).catch(() => {})

    res.json({
      user:  { id: user.id, name: user.name, phone: user.phone, role: user.role, avatar: user.avatar },
      token: accessToken,
      refreshToken,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ── Refresh Token ─────────────────────────────────────────
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(401).json({ error: 'مطلوب' })

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ error: 'الجلسة منتهية' })
    }

    const payload = verifyRefresh(refreshToken)
    const newAccess = signAccess({ id: payload.id, role: payload.role })

    res.json({ token: newAccess })
  } catch {
    res.status(401).json({ error: 'الجلسة منتهية' })
  }
})

// ── Logout ────────────────────────────────────────────────
router.post('/logout', authenticate, async (req, res) => {
  const { refreshToken } = req.body
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } }).catch(() => {})
  }
  res.json({ success: true })
})

// ── Me ────────────────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, phone: true, email: true, role: true, avatar: true, status: true },
    })
    if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' })
    res.json(user)
  } catch {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

export default router
