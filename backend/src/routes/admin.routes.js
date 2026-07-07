import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js'
import { getIO } from '../lib/socketio.js'

const router = Router()
router.use(authenticate, requireAdmin)

// ── Overview / Dashboard ──────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [
      totalSellers,
      pendingSellers,
      totalCustomers,
      activeDrivers,
      todayOrders,
      openDisputes,
      totalRevenue,
      avgRatingAgg,
    ] = await Promise.all([
      prisma.store.count({ where: { status: 'active' } }),
      prisma.store.count({ where: { status: 'pending' } }),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.driver.count({ where: { isAvailable: true } }),
      prisma.order.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
      prisma.dispute.count({ where: { status: 'open' } }),
      prisma.commission.aggregate({ _sum: { commission: true } }),
      prisma.store.aggregate({ _avg: { rating: true } }),
    ])

    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const monthRevenue = await prisma.commission.aggregate({
      where: { createdAt: { gte: monthStart } },
      _sum: { commission: true },
    })

    res.json({
      totalSellers,
      pendingSellers,
      totalCustomers,
      activeDrivers,
      todayOrders,
      openDisputes,
      monthRevenue: monthRevenue._sum.commission ?? 0,
      totalRevenue: totalRevenue._sum.commission ?? 0,
      avgRating: Number((avgRatingAgg._avg.rating ?? 0).toFixed(1)),
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Activity Feed ─────────────────────────────────────────
router.get('/activity', async (req, res) => {
  try {
    const activities = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: { user: { select: { name: true, avatar: true } } },
    })
    res.json(activities.map(a => ({ ...a, userName: a.user?.name })))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Alerts ────────────────────────────────────────────────
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(alerts)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/alerts/:id', async (req, res) => {
  try {
    await prisma.alert.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Analytics ─────────────────────────────────────────────
router.get('/analytics', async (req, res) => {
  try {
    const { period = 'week' } = req.query
    const days = period === 'year' ? 365 : period === 'month' ? 30 : 7
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const [orders, commissions, newCustomers, newSellers] = await Promise.all([
      prisma.order.findMany({ where: { createdAt: { gte: since } }, select: { total: true, createdAt: true } }),
      prisma.commission.findMany({ where: { createdAt: { gte: since } }, select: { commission: true, createdAt: true } }),
      prisma.user.count({ where: { role: 'customer', createdAt: { gte: since } } }),
      prisma.store.count({ where: { createdAt: { gte: since } } }),
    ])

    const grouped = {}
    orders.forEach(o => {
      const d = new Date(o.createdAt)
      const key = period === 'year'
        ? d.toLocaleString('ar-SA', { month: 'short' })
        : d.toLocaleString('ar-SA', { weekday: 'short' })
      grouped[key] = {
        revenue: (grouped[key]?.revenue ?? 0) + o.total,
        orders:  (grouped[key]?.orders ?? 0) + 1,
      }
    })

    commissions.forEach(c => {
      const d = new Date(c.createdAt)
      const key = period === 'year'
        ? d.toLocaleString('ar-SA', { month: 'short' })
        : d.toLocaleString('ar-SA', { weekday: 'short' })
      if (grouped[key]) grouped[key].commission = (grouped[key].commission ?? 0) + c.commission
    })

    const chartData = Object.entries(grouped).map(([label, v]) => ({ label, ...v }))

    res.json({
      chartData,
      summary: {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((s, o) => s + o.total, 0),
        totalCommission: commissions.reduce((s, c) => s + c.commission, 0),
        newCustomers,
        newSellers,
      },
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/analytics/by-category', async (req, res) => {
  try {
    const result = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { qty: true },
    })

    const productIds = result.map(r => r.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, category: true },
    })

    const catMap = {}
    result.forEach(item => {
      const p = products.find(p => p.id === item.productId)
      const cat = p?.category ?? 'أخرى'
      catMap[cat] = (catMap[cat] ?? 0) + (item._sum.qty ?? 0)
    })

    res.json(Object.entries(catMap).map(([name, value]) => ({ name, value })))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Sellers ───────────────────────────────────────────────
router.get('/sellers', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 15 } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const where = {
      ...(status && { status }),
      ...(search && { storeName: { contains: search, mode: 'insensitive' } }),
    }
    const [sellers, total] = await Promise.all([
      prisma.store.findMany({
        where, skip, take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          seller: { select: { name: true, phone: true, email: true, createdAt: true } },
          _count: { select: { products: true, orders: true } },
        },
      }),
      prisma.store.count({ where }),
    ])

    const countsMap = await prisma.store.groupBy({ by: ['status'], _count: true })
      .then(arr => Object.fromEntries(arr.map(c => [c.status, c._count])))

    res.json({ sellers, total, totalPages: Math.ceil(total / Number(limit)), counts: countsMap })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/sellers/:id', async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: req.params.id },
      include: {
        seller: { select: { id: true, name: true, phone: true, email: true, createdAt: true } },
        _count: { select: { products: true, orders: true, reviews: true } },
      },
    })
    if (!store) return res.status(404).json({ error: 'المتجر غير موجود' })

    const revenueAgg = await prisma.order.aggregate({
      where: { storeId: req.params.id, status: 'delivered' },
      _sum: { total: true },
    })

    res.json({ ...store, totalRevenue: revenueAgg._sum.total ?? 0 })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/sellers/:id/approve', async (req, res) => {
  try {
    const store = await prisma.store.update({
      where: { id: req.params.id },
      data: { status: 'active' },
    })
    await prisma.activityLog.create({
      data: { type: 'seller', message: `تمت الموافقة على متجر "${store.storeName}"`, userId: req.user.id },
    }).catch(() => {})
    res.json(store)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/sellers/:id/reject', async (req, res) => {
  try {
    const store = await prisma.store.update({
      where: { id: req.params.id },
      data: { status: 'rejected', rejectionReason: req.body.reason },
    })
    res.json(store)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/sellers/:id/suspend', async (req, res) => {
  try {
    const store = await prisma.store.update({
      where: { id: req.params.id },
      data: { status: 'suspended' },
    })
    res.json(store)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/sellers/:id/activate', async (req, res) => {
  try {
    const store = await prisma.store.update({
      where: { id: req.params.id },
      data: { status: 'active' },
    })
    res.json(store)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Customers ─────────────────────────────────────────────
router.get('/customers', async (req, res) => {
  try {
    const { search, status, page = 1, limit = 15 } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const where = {
      role: 'customer',
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ],
      }),
    }
    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where, skip, take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, phone: true, email: true, status: true, avatar: true, createdAt: true, _count: { select: { orders: true } } },
      }),
      prisma.user.count({ where }),
    ])
    res.json({ customers, total, totalPages: Math.ceil(total / Number(limit)) })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, name: true, phone: true, email: true, status: true, avatar: true, createdAt: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { store: { select: { storeName: true } } },
        },
        _count: { select: { orders: true } },
      },
    })
    if (!customer) return res.status(404).json({ error: 'العميل غير موجود' })

    const spendAgg = await prisma.order.aggregate({
      where: { customerId: req.params.id, status: 'delivered' },
      _sum: { total: true },
    })

    res.json({ ...customer, totalSpend: spendAgg._sum.total ?? 0 })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/customers/:id/ban', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status: 'banned' },
      select: { id: true, status: true },
    })
    res.json(user)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/customers/:id/unban', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status: 'active' },
      select: { id: true, status: true },
    })
    res.json(user)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Orders ────────────────────────────────────────────────
router.get('/orders', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 15 } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { customer: { name: { contains: search, mode: 'insensitive' } } },
          { store: { storeName: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    }
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where, skip, take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { name: true } },
          store: { select: { storeName: true } },
        },
      }),
      prisma.order.count({ where }),
    ])

    const countsMap = await prisma.order.groupBy({ by: ['status'], _count: true })
      .then(arr => Object.fromEntries(arr.map(c => [c.status, c._count])))

    res.json({ orders, total, totalPages: Math.ceil(total / Number(limit)), counts: countsMap })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Commissions ───────────────────────────────────────────
router.get('/commissions', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const [commissions, total, summary] = await Promise.all([
      prisma.commission.findMany({
        skip, take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { store: { select: { storeName: true } } },
      }),
      prisma.commission.count(),
      prisma.commission.aggregate({ _sum: { commission: true, orderTotal: true } }),
    ])

    const byStore = await prisma.commission.groupBy({
      by: ['storeId'],
      _sum: { commission: true, orderTotal: true },
      _count: true,
      orderBy: { _sum: { commission: 'desc' } },
      take: 10,
    })

    const storeIds = byStore.map(s => s.storeId)
    const stores = await prisma.store.findMany({ where: { id: { in: storeIds } }, select: { id: true, storeName: true } })
    const storeMap = Object.fromEntries(stores.map(s => [s.id, s.storeName]))

    res.json({
      commissions,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      summary: {
        totalCommission: summary._sum.commission ?? 0,
        totalOrderValue: summary._sum.orderTotal ?? 0,
      },
      byStore: byStore.map(b => ({
        storeId: b.storeId,
        storeName: storeMap[b.storeId] ?? '–',
        commission: b._sum.commission ?? 0,
        orderTotal: b._sum.orderTotal ?? 0,
        orderCount: b._count,
      })),
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/commissions/summary', async (req, res) => {
  try {
    const [allTime, month, byStore] = await Promise.all([
      prisma.commission.aggregate({ _sum: { commission: true, orderTotal: true } }),
      prisma.commission.aggregate({
        where: { createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
        _sum: { commission: true },
      }),
      prisma.commission.groupBy({
        by: ['storeId'],
        _sum: { commission: true },
        _count: true,
        orderBy: { _sum: { commission: 'desc' } },
        take: 5,
      }),
    ])

    const storeIds = byStore.map(s => s.storeId)
    const stores = await prisma.store.findMany({ where: { id: { in: storeIds } }, select: { id: true, storeName: true } })
    const storeMap = Object.fromEntries(stores.map(s => [s.id, s.storeName]))

    res.json({
      totalCommission: allTime._sum.commission ?? 0,
      totalOrderValue: allTime._sum.orderTotal ?? 0,
      monthCommission: month._sum.commission ?? 0,
      topStores: byStore.map(b => ({
        storeId: b.storeId,
        storeName: storeMap[b.storeId] ?? '–',
        commission: b._sum.commission ?? 0,
        orderCount: b._count,
      })),
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Disputes ──────────────────────────────────────────────
router.get('/disputes', async (req, res) => {
  try {
    const { status, page = 1, limit = 15 } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const where = { ...(status && { status }) }

    const [disputes, total] = await Promise.all([
      prisma.dispute.findMany({
        where, skip, take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          order: { include: { store: { select: { storeName: true } } } },
          customer: { select: { name: true } },
        },
      }),
      prisma.dispute.count({ where }),
    ])

    res.json({ disputes, total, totalPages: Math.ceil(total / Number(limit)) })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/disputes/:id/resolve', async (req, res) => {
  try {
    const dispute = await prisma.dispute.update({
      where: { id: req.params.id },
      data: { status: 'resolved', resolution: req.body.note, resolvedAt: new Date() },
    })
    res.json(dispute)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/disputes/:id/reject', async (req, res) => {
  try {
    const dispute = await prisma.dispute.update({
      where: { id: req.params.id },
      data: { status: 'rejected', resolution: req.body.reason, resolvedAt: new Date() },
    })
    res.json(dispute)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Drivers ───────────────────────────────────────────────
router.get('/drivers', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 15 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const where = search
      ? { user: { OR: [{ name: { contains: search, mode: 'insensitive' } }, { phone: { contains: search } }] } }
      : {}

    const [drivers, total] = await Promise.all([
      prisma.driver.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
        include: {
          user: { select: { name: true, phone: true, avatar: true } },
          orders: {
            where: { status: { in: ['preparing', 'shipped'] } },
            take: 1,
            select: { id: true, status: true, store: { select: { storeName: true } } },
          },
        },
      }),
      prisma.driver.count({ where }),
    ])

    const mapped = drivers.map(d => ({
      id: d.id,
      name: d.user.name,
      phone: d.user.phone,
      avatar: d.user.avatar,
      vehicle: d.vehicleType,
      vehiclePlate: d.vehiclePlate,
      city: null,
      deliveriesCount: d.deliveriesCount,
      isAvailable: d.isAvailable,
      status: d.isAvailable ? 'online' : 'offline',
      activeOrder: d.orders[0] ?? null,
    }))

    res.json({ drivers: mapped, total, totalPages: Math.ceil(total / Number(limit)) })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Unassigned orders ready for driver pickup
router.get('/orders/unassigned', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { status: 'preparing', driverId: null },
      orderBy: { createdAt: 'asc' },
      include: {
        store: { select: { storeName: true } },
        address: true,
      },
    })
    res.json(orders)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Manually assign driver to order
router.patch('/orders/:id/assign-driver', async (req, res) => {
  try {
    const { driverId } = req.body
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: { user: { select: { name: true } } },
    })
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { driverId },
    })
    try {
      const io = getIO()
      io.to(`order:${order.id}`)
        .emit('order:driver_assigned', { orderId: order.id, driverName: driver?.user?.name })
      io.to('drivers:online').emit('order:taken', { orderId: order.id })
    } catch {}
    res.json(order)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/drivers', async (req, res) => {
  try {
    const { name, phone, vehicleType, vehiclePlate } = req.body
    const hashed = await bcrypt.hash('Driver@123', 10)

    const user = await prisma.user.create({
      data: { name, phone, password: hashed, role: 'driver' },
    })

    const driver = await prisma.driver.create({
      data: { userId: user.id, vehicleType, vehiclePlate },
      include: { user: { select: { name: true, phone: true } } },
    })

    res.status(201).json(driver)
  } catch (e) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'رقم الهاتف مسجل مسبقاً' })
    res.status(500).json({ error: e.message })
  }
})

router.delete('/drivers/:id', async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({ where: { id: req.params.id } })
    if (driver) {
      await prisma.driver.delete({ where: { id: req.params.id } })
      await prisma.user.delete({ where: { id: driver.userId } }).catch(() => {})
    }
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Ads ───────────────────────────────────────────────────
router.get('/ads', async (req, res) => {
  try {
    const ads = await prisma.ad.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(ads)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/ads', async (req, res) => {
  try {
    const { title, subtitle, image, link, color, position, startAt, endAt } = req.body
    const ad = await prisma.ad.create({
      data: { title, subtitle, image, link, color, position, startAt: startAt ? new Date(startAt) : null, endAt: endAt ? new Date(endAt) : null },
    })
    res.status(201).json(ad)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put('/ads/:id', async (req, res) => {
  try {
    const { title, subtitle, image, link, color, position, startAt, endAt } = req.body
    const ad = await prisma.ad.update({
      where: { id: req.params.id },
      data: { title, subtitle, image, link, color, position, startAt: startAt ? new Date(startAt) : null, endAt: endAt ? new Date(endAt) : null },
    })
    res.json(ad)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.patch('/ads/:id', async (req, res) => {
  try {
    const ad = await prisma.ad.update({
      where: { id: req.params.id },
      data: { active: req.body.active },
    })
    res.json(ad)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/ads/:id', async (req, res) => {
  try {
    await prisma.ad.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Platform Settings ─────────────────────────────────────
router.get('/settings', async (req, res) => {
  try {
    const settings = await prisma.platformSettings.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton' },
      update: {},
    })
    res.json(settings)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put('/settings', async (req, res) => {
  try {
    const settings = await prisma.platformSettings.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...req.body },
      update: req.body,
    })
    res.json(settings)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
