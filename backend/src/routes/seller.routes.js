import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { authenticate, requireSeller } from '../middleware/auth.middleware.js'
import { getIO } from '../lib/socketio.js'

const router = Router()
router.use(authenticate, requireSeller)

// Helper: get storeId for current seller
async function getStoreId(userId) {
  const store = await prisma.store.findUnique({ where: { sellerId: userId }, select: { id: true } })
  if (!store) throw Object.assign(new Error('المتجر غير موجود'), { status: 404 })
  return store.id
}

// ── Stats / Dashboard ─────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const storeId = await getStoreId(req.user.id)

    const [store, totalOrders, pendingOrders, deliveredOrders, totalProducts, balance, reviews, customers] = await Promise.all([
      prisma.store.findUnique({ where: { id: storeId }, select: { rating: true, ratingCount: true } }),
      prisma.order.count({ where: { storeId } }),
      prisma.order.count({ where: { storeId, status: 'pending' } }),
      prisma.order.count({ where: { storeId, status: 'delivered' } }),
      prisma.product.count({ where: { storeId } }),
      prisma.balance.findUnique({ where: { storeId } }),
      prisma.review.aggregate({ where: { storeId }, _avg: { rating: true } }),
      prisma.order.groupBy({ by: ['customerId'], where: { storeId } }),
    ])

    const revenueResult = await prisma.order.aggregate({
      where: { storeId, status: 'delivered' },
      _sum: { total: true },
    })

    const recentOrders = await prisma.order.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { customer: { select: { name: true } } },
    })

    const salesByCategory = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: { order: { storeId } },
      _sum: { qty: true },
    }).then(async (items) => {
      const productIds = items.map(i => i.productId)
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, category: true },
      })
      const catMap = {}
      items.forEach(item => {
        const product = products.find(p => p.id === item.productId)
        const cat = product?.category ?? 'أخرى'
        catMap[cat] = (catMap[cat] ?? 0) + (item._sum.qty ?? 0)
      })
      return Object.entries(catMap).map(([name, value]) => ({ name, value }))
    })

    res.json({
      totalOrders,
      revenue: revenueResult._sum.total ?? 0,
      avgRating: store?.rating ?? 0,
      totalProducts,
      pendingOrders,
      deliveredOrders,
      totalCustomers: customers.length,
      growth: 0,
      recentOrders: recentOrders.map(o => ({ ...o, customerName: o.customer.name })),
      salesByCategory,
    })
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

router.get('/stats/sales', async (req, res) => {
  try {
    const storeId = await getStoreId(req.user.id)
    const { period = 'week' } = req.query

    const days = period === 'year' ? 365 : period === 'month' ? 30 : 7
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const orders = await prisma.order.findMany({
      where: { storeId, createdAt: { gte: since } },
      select: { total: true, createdAt: true },
    })

    // Group by day label
    const grouped = {}
    orders.forEach(o => {
      const d = new Date(o.createdAt)
      const key = period === 'year'
        ? d.toLocaleString('ar-SA', { month: 'short' })
        : d.toLocaleString('ar-SA', { weekday: 'short' })
      grouped[key] = { sales: (grouped[key]?.sales ?? 0) + o.total, orders: (grouped[key]?.orders ?? 0) + 1 }
    })

    const chartData = Object.entries(grouped).map(([label, v]) => ({ label, ...v }))
    res.json({ [period]: chartData })
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

// ── Products ──────────────────────────────────────────────
router.get('/products', async (req, res) => {
  try {
    const storeId = await getStoreId(req.user.id)
    const { search, category, page = 1, limit = 12 } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const where = {
      storeId,
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(category && { category }),
    }
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.product.count({ where }),
    ])
    res.json({ products, total, totalPages: Math.ceil(total / Number(limit)) })
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

router.get('/products/:id', async (req, res) => {
  try {
    const storeId = await getStoreId(req.user.id)
    const product = await prisma.product.findFirst({ where: { id: req.params.id, storeId } })
    if (!product) return res.status(404).json({ error: 'المنتج غير موجود' })
    res.json(product)
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

router.post('/products', async (req, res) => {
  try {
    const storeId = await getStoreId(req.user.id)
    const { name, description, price, comparePrice, stock, unit, category, images } = req.body
    const product = await prisma.product.create({
      data: { storeId, name, description, price: Number(price), comparePrice: comparePrice ? Number(comparePrice) : null, stock: Number(stock), unit, category, images: images ?? [] },
    })
    res.status(201).json(product)
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

router.put('/products/:id', async (req, res) => {
  try {
    const storeId = await getStoreId(req.user.id)
    const { name, description, price, comparePrice, stock, unit, category, images } = req.body
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { name, description, price: Number(price), comparePrice: comparePrice ? Number(comparePrice) : null, stock: Number(stock), unit, category, images: images ?? [] },
    })
    res.json(product)
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

router.delete('/products/:id', async (req, res) => {
  try {
    const storeId = await getStoreId(req.user.id)
    await prisma.product.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

router.patch('/products/:id/stock', async (req, res) => {
  try {
    await prisma.product.update({
      where: { id: req.params.id },
      data: { stock: Number(req.body.stock) },
    })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Orders ────────────────────────────────────────────────
router.get('/orders', async (req, res) => {
  try {
    const storeId = await getStoreId(req.user.id)
    const { status, search, page = 1, limit = 15 } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const where = {
      storeId,
      ...(status && { status }),
      ...(search && {
        OR: [
          { customer: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    }
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where, skip, take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { name: true, phone: true } },
          items: true,
          address: true,
          driver: { include: { user: { select: { name: true, phone: true } } } },
        },
      }),
      prisma.order.count({ where }),
    ])

    const counts = await prisma.order.groupBy({
      by: ['status'],
      where: { storeId },
      _count: true,
    })
    const countsMap = Object.fromEntries(counts.map(c => [c.status, c._count]))

    res.json({
      orders: orders.map(o => ({
        ...o,
        customerName: o.customer?.name,
        customerPhone: o.customer?.phone,
        addressText: o.address
          ? [o.address.city, o.address.district, o.address.street].filter(Boolean).join(' - ')
          : null,
        driverName: o.driver?.user?.name ?? null,
        driverPhone: o.driver?.user?.phone ?? null,
      })),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      counts: countsMap,
    })
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

router.get('/orders/:id', async (req, res) => {
  try {
    const storeId = await getStoreId(req.user.id)
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, storeId },
      include: {
        customer: { select: { name: true, phone: true } },
        items: true,
        address: true,
      },
    })
    if (!order) return res.status(404).json({ error: 'الطلب غير موجود' })
    res.json({ ...order, customerName: order.customer.name })
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

router.patch('/orders/:id/status', async (req, res) => {
  try {
    const storeId = await getStoreId(req.user.id)
    const { status } = req.body

    // Check if a driver has taken this order — if so, only driver can advance shipped/delivered
    const current = await prisma.order.findFirst({
      where: { id: req.params.id, storeId },
      select: { driverId: true, status: true },
    })
    if (!current) return res.status(404).json({ error: 'الطلب غير موجود' })

    if (current.driverId && ['shipped', 'delivered'].includes(status)) {
      return res.status(403).json({ error: 'هذا الطلب مع مندوب التوصيل — لا يمكنك تغيير حالته' })
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    })

    // 🔔 Real-time: notify customer & seller immediately
    const io = getIO()
    io.to(`order:${order.id}`).emit('order:status', {
      orderId:   order.id,
      status,
      updatedAt: new Date().toISOString(),
    })
    io.to(`store:${storeId}`).emit('order:updated', {
      orderId: order.id,
      status,
    })
    // Notify online drivers when order is ready for pickup
    if (status === 'preparing') {
      io.to('drivers:online').emit('order:available', { orderId: order.id })
    }

    // Release balance when delivered
    if (status === 'delivered') {
      const commission = await prisma.commission.findUnique({ where: { orderId: order.id } })
      const sellerAmount = order.total - (commission?.commission ?? 0)
      await prisma.balance.update({
        where: { storeId },
        data: { pending: { decrement: sellerAmount }, available: { increment: sellerAmount } },
      }).catch(() => {})
    }

    res.json(order)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Store (Settings) ──────────────────────────────────────
router.get('/store', async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { sellerId: req.user.id },
    })
    if (!store) return res.status(404).json({ error: 'المتجر غير موجود' })
    res.json(store)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put('/store', async (req, res) => {
  try {
    const { storeName, description, category, city, address, phone, email, deliveryTime, minOrder } = req.body
    const store = await prisma.store.update({
      where: { sellerId: req.user.id },
      data: { storeName, description, category, city, address, phone, email, deliveryTime, minOrder: minOrder ? Number(minOrder) : undefined },
    })
    res.json(store)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Coupons ───────────────────────────────────────────────
router.get('/coupons', async (req, res) => {
  try {
    const storeId = await getStoreId(req.user.id)
    const coupons = await prisma.coupon.findMany({ where: { storeId }, orderBy: { createdAt: 'desc' } })
    res.json(coupons)
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

router.post('/coupons', async (req, res) => {
  try {
    const storeId = await getStoreId(req.user.id)
    const { code, type, value, minOrder, maxUses, expiresAt } = req.body
    const coupon = await prisma.coupon.create({
      data: { storeId, code: code.toUpperCase(), type, value: Number(value), minOrder: minOrder ? Number(minOrder) : 0, maxUses: maxUses ? Number(maxUses) : null, expiresAt: expiresAt ? new Date(expiresAt) : null },
    })
    res.status(201).json(coupon)
  } catch (e) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'الكود مستخدم مسبقاً' })
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

router.delete('/coupons/:id', async (req, res) => {
  try {
    await prisma.coupon.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.patch('/coupons/:id', async (req, res) => {
  try {
    const coupon = await prisma.coupon.update({
      where: { id: req.params.id },
      data: { active: req.body.active },
    })
    res.json(coupon)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Reviews ───────────────────────────────────────────────
router.get('/reviews', async (req, res) => {
  try {
    const storeId = await getStoreId(req.user.id)
    const { search, rating, page = 1, limit = 10 } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const where = {
      storeId,
      ...(rating && { rating: Number(rating) }),
      ...(search && { customer: { name: { contains: search, mode: 'insensitive' } } }),
    }
    const [reviews, total, agg] = await Promise.all([
      prisma.review.findMany({
        where, skip, take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { name: true } },
          product: { select: { name: true } },
        },
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({ where: { storeId }, _avg: { rating: true } }),
    ])
    res.json({
      reviews: reviews.map(r => ({ ...r, customerName: r.customer.name, productName: r.product.name })),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      avgRating: agg._avg.rating ?? 0,
    })
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

router.post('/reviews/:id/reply', async (req, res) => {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { reply: req.body.reply },
    })
    res.json(review)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Balance / Payments ────────────────────────────────────
router.get('/balance', async (req, res) => {
  try {
    const storeId = await getStoreId(req.user.id)
    const balance = await prisma.balance.findUnique({ where: { storeId } })
    res.json({ available: balance?.available ?? 0, pending: balance?.pending ?? 0 })
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

router.get('/payments', async (req, res) => {
  try {
    const storeId = await getStoreId(req.user.id)
    const balance = await prisma.balance.findUnique({ where: { storeId } })
    if (!balance) return res.json({ payments: [] })

    const transactions = await prisma.balanceTransaction.findMany({
      where: { balanceId: balance.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    res.json({ payments: transactions.map(t => ({ ...t, date: t.createdAt })) })
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

router.post('/withdrawals', async (req, res) => {
  try {
    const storeId = await getStoreId(req.user.id)
    const amount = Number(req.body.amount)
    const balance = await prisma.balance.findUnique({ where: { storeId } })
    if (!balance || balance.available < amount) {
      return res.status(400).json({ error: 'الرصيد غير كافٍ' })
    }
    await prisma.$transaction([
      prisma.balance.update({ where: { storeId }, data: { available: { decrement: amount } } }),
      prisma.balanceTransaction.create({
        data: { balanceId: balance.id, type: 'withdrawal', amount, description: 'طلب سحب' },
      }),
    ])
    res.json({ success: true })
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

export default router
