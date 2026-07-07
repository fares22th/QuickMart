import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { authenticate, requireRole } from '../middleware/auth.middleware.js'
import { getIO } from '../lib/socketio.js'

const router = Router()
router.use(authenticate, requireRole('driver'))

const ORDER_INCLUDE = {
  store: { select: { storeName: true, address: true, city: true, phone: true, logo: true } },
  customer: { select: { name: true, phone: true } },
  address: true,
  items: true,
}

async function getDriverRecord(userId) {
  return prisma.driver.findUnique({ where: { userId } })
}

// ── Profile ───────────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { userId: req.user.id },
      include: {
        user: { select: { id: true, name: true, phone: true, avatar: true } },
        orders: {
          where: { status: { in: ['preparing', 'shipped'] } },
          take: 1,
          include: ORDER_INCLUDE,
        },
      },
    })
    if (!driver) return res.status(404).json({ error: 'لم يتم العثور على بيانات السائق' })
    res.json({ ...driver, activeOrder: driver.orders[0] ?? null })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Online / Offline toggle ───────────────────────────────
router.patch('/availability', async (req, res) => {
  try {
    const { isAvailable } = req.body
    const driver = await prisma.driver.update({
      where: { userId: req.user.id },
      data: { isAvailable },
    })
    try {
      getIO().to('admin:drivers').emit('driver:status', { driverId: driver.id, isAvailable })
    } catch {}
    res.json({ isAvailable: driver.isAvailable })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Available orders (preparing, no driver yet) ───────────
router.get('/orders/available', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { status: 'preparing', driverId: null },
      orderBy: { createdAt: 'asc' },
      include: ORDER_INCLUDE,
    })
    res.json(orders)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── My active order ───────────────────────────────────────
router.get('/orders/active', async (req, res) => {
  try {
    const driver = await getDriverRecord(req.user.id)
    if (!driver) return res.status(404).json({ error: 'سائق غير موجود' })

    const order = await prisma.order.findFirst({
      where: { driverId: driver.id, status: { in: ['preparing', 'shipped'] } },
      include: ORDER_INCLUDE,
    })
    res.json(order)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Accept an order ───────────────────────────────────────
router.post('/orders/:id/accept', async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { userId: req.user.id },
      include: { user: { select: { name: true } } },
    })
    if (!driver) return res.status(404).json({ error: 'سائق غير موجود' })

    const existing = await prisma.order.findFirst({
      where: { driverId: driver.id, status: { in: ['preparing', 'shipped'] } },
    })
    if (existing) return res.status(400).json({ error: 'لديك طلب نشط بالفعل' })

    const order = await prisma.order.update({
      where: { id: req.params.id, status: 'preparing', driverId: null },
      data: { driverId: driver.id },
      include: ORDER_INCLUDE,
    })

    try {
      const io = getIO()
      // Notify the customer their order has a driver
      io.to(`order:${order.id}`)
        .emit('order:driver_assigned', { orderId: order.id, driverName: driver.user?.name })
      // Tell other online drivers this order is gone
      io.to('drivers:online').emit('order:taken', { orderId: order.id })
    } catch {}

    res.json(order)
  } catch (e) {
    if (e.code === 'P2025') return res.status(409).json({ error: 'هذا الطلب لم يعد متاحاً' })
    res.status(500).json({ error: e.message })
  }
})

// ── Update status: shipped | delivered ────────────────────
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const driver = await getDriverRecord(req.user.id)
    if (!driver) return res.status(404).json({ error: 'سائق غير موجود' })

    const { status } = req.body
    if (!['shipped', 'delivered'].includes(status)) {
      return res.status(400).json({ error: 'حالة غير صالحة' })
    }

    const order = await prisma.order.update({
      where: { id: req.params.id, driverId: driver.id },
      data: { status },
      include: { store: { select: { id: true } } },
    })

    if (status === 'delivered') {
      await prisma.driver.update({
        where: { id: driver.id },
        data: { deliveriesCount: { increment: 1 } },
      })
    }

    try {
      const io = getIO()
      io.to(`order:${order.id}`).emit('order:status', {
        orderId: order.id,
        status,
        updatedAt: new Date().toISOString(),
      })
      io.to(`store:${order.store.id}`).emit('order:updated', { orderId: order.id, status })
    } catch {}

    res.json({ success: true, status })
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'الطلب غير موجود' })
    res.status(500).json({ error: e.message })
  }
})

// ── Order history ─────────────────────────────────────────
router.get('/orders/history', async (req, res) => {
  try {
    const driver = await getDriverRecord(req.user.id)
    if (!driver) return res.status(404).json({ error: 'سائق غير موجود' })

    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = 20
    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { driverId: driver.id, status: 'delivered' },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        include: { store: { select: { storeName: true, logo: true } }, address: true },
      }),
      prisma.order.count({ where: { driverId: driver.id, status: 'delivered' } }),
    ])

    res.json({ orders, total, totalPages: Math.ceil(total / limit), page })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Earnings ──────────────────────────────────────────────
router.get('/earnings', async (req, res) => {
  try {
    const driver = await getDriverRecord(req.user.id)
    if (!driver) return res.status(404).json({ error: 'سائق غير موجود' })

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const FEE = 10 // SAR per delivery

    const [todayCount, weekCount, monthCount] = await Promise.all([
      prisma.order.count({ where: { driverId: driver.id, status: 'delivered', updatedAt: { gte: today } } }),
      prisma.order.count({ where: { driverId: driver.id, status: 'delivered', updatedAt: { gte: weekStart } } }),
      prisma.order.count({ where: { driverId: driver.id, status: 'delivered', updatedAt: { gte: monthStart } } }),
    ])

    const recent = await prisma.order.findMany({
      where: { driverId: driver.id, status: 'delivered' },
      orderBy: { updatedAt: 'desc' },
      take: 7,
      select: { updatedAt: true, deliveryFee: true },
    })

    res.json({
      todayEarnings: todayCount * FEE,
      weekEarnings: weekCount * FEE,
      monthEarnings: monthCount * FEE,
      totalEarnings: driver.deliveriesCount * FEE,
      todayDeliveries: todayCount,
      weekDeliveries: weekCount,
      monthDeliveries: monthCount,
      totalDeliveries: driver.deliveriesCount,
      recentOrders: recent,
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
