import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { authenticate, requireCustomer } from '../middleware/auth.middleware.js'

const router = Router()

// ── Stores ────────────────────────────────────────────────
router.get('/stores', async (req, res) => {
  try {
    const { search, category, city, page = 1, limit = 20 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const where = {
      status: 'active',
      ...(search && { storeName: { contains: search, mode: 'insensitive' } }),
      ...(category && { category }),
      ...(city && { city }),
    }

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where, skip, take: Number(limit),
        orderBy: { rating: 'desc' },
        include: { _count: { select: { products: true } } },
      }),
      prisma.store.count({ where }),
    ])

    res.json({ stores, total, totalPages: Math.ceil(total / Number(limit)) })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/stores/:id', async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { products: true, reviews: true } } },
    })
    if (!store) return res.status(404).json({ error: 'المتجر غير موجود' })
    res.json(store)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Products ──────────────────────────────────────────────
router.get('/products', async (req, res) => {
  try {
    const { search, category, storeId, minPrice, maxPrice, sort = 'newest', page = 1, limit = 20 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const where = {
      isActive: true,
      store: { status: 'active' },
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(category && { category }),
      ...(storeId && { storeId }),
      ...(minPrice && { price: { gte: Number(minPrice) } }),
      ...(maxPrice && { price: { ...(minPrice ? { gte: Number(minPrice) } : {}), lte: Number(maxPrice) } }),
    }

    const orderBy = {
      newest:    { createdAt: 'desc' },
      priceAsc:  { price: 'asc' },
      priceDesc: { price: 'desc' },
      rating:    { rating: 'desc' },
      sales:     { salesCount: 'desc' },
    }[sort] ?? { createdAt: 'desc' }

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take: Number(limit), orderBy }),
      prisma.product.count({ where }),
    ])

    res.json({ products, total, totalPages: Math.ceil(total / Number(limit)) })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { store: { select: { id: true, storeName: true, logo: true, rating: true, deliveryTime: true, city: true } } },
    })
    if (!product) return res.status(404).json({ error: 'المنتج غير موجود' })
    res.json(product)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Reviews ───────────────────────────────────────────────
router.get('/products/:id/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const where = {
      productId: req.params.id,
      ...(rating && { rating: Number(rating) }),
    }
    const [reviews, total, agg] = await Promise.all([
      prisma.review.findMany({
        where, skip, take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { customer: { select: { name: true, avatar: true } } },
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({ where: { productId: req.params.id }, _avg: { rating: true } }),
    ])
    res.json({ reviews, total, totalPages: Math.ceil(total / Number(limit)), avgRating: agg._avg.rating ?? 0 })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/products/:id/reviews', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body
    const product = await prisma.product.findUnique({ where: { id: req.params.id } })
    if (!product) return res.status(404).json({ error: 'المنتج غير موجود' })

    const review = await prisma.review.upsert({
      where: { productId_customerId: { productId: req.params.id, customerId: req.user.id } },
      create: { productId: req.params.id, storeId: product.storeId, customerId: req.user.id, rating, comment },
      update: { rating, comment },
    })

    // Update product rating
    const agg = await prisma.review.aggregate({ where: { productId: req.params.id }, _avg: { rating: true }, _count: true })
    await prisma.product.update({
      where: { id: req.params.id },
      data: { rating: agg._avg.rating ?? 0, ratingCount: agg._count },
    })

    res.status(201).json(review)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Orders ────────────────────────────────────────────────
router.get('/orders', authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const where = {
      customerId: req.user.id,
      ...(status && { status }),
    }
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where, skip, take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          items: { include: { product: { select: { name: true, images: true } } } },
          store: { select: { storeName: true, logo: true } },
          driver: { include: { user: { select: { name: true, phone: true } } } },
        },
      }),
      prisma.order.count({ where }),
    ])
    res.json({ orders, total, totalPages: Math.ceil(total / Number(limit)) })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/orders/:id', authenticate, async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, customerId: req.user.id },
      include: {
        items: true,
        store: { select: { storeName: true, logo: true, phone: true } },
        address: true,
        driver: { include: { user: { select: { name: true, phone: true } } } },
      },
    })
    if (!order) return res.status(404).json({ error: 'الطلب غير موجود' })
    res.json(order)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/orders', authenticate, async (req, res) => {
  try {
    let { storeId, addressId, items, notes, couponCode, paymentMethod = 'cash', address } = req.body

    if (!items?.length) return res.status(400).json({ error: 'لا توجد منتجات في الطلب' })

    // Derive storeId from first product if not provided
    if (!storeId) {
      const fp = await prisma.product.findUnique({ where: { id: items[0].productId }, select: { storeId: true } })
      storeId = fp?.storeId
    }
    if (!storeId) return res.status(400).json({ error: 'لم يتم تحديد المتجر' })

    // Create address on-the-fly if raw address object provided
    if (!addressId && address?.city) {
      const created = await prisma.address.create({
        data: {
          userId:   req.user.id,
          city:     address.city     ?? '',
          district: address.district ?? '',
          street:   address.street   ?? '',
          building: address.building ?? '',
          notes:    address.details  ?? address.notes ?? '',
          label:    'توصيل',
        },
      })
      addressId = created.id
    }

    // Get store settings
    const store = await prisma.store.findUnique({ where: { id: storeId } })
    if (!store || store.status !== 'active') return res.status(400).json({ error: 'المتجر غير متاح' })

    // Validate & compute items
    let subtotal = 0
    const orderItems = []
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product || product.stock < item.qty) {
        return res.status(400).json({ error: `المنتج "${product?.name}" غير متوفر بالكمية المطلوبة` })
      }
      subtotal += product.price * item.qty
      orderItems.push({ productId: product.id, name: product.name, image: product.images?.[0], price: product.price, qty: item.qty })
    }

    // Apply coupon
    let discount = 0
    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: { storeId, code: couponCode, active: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
      })
      if (coupon && subtotal >= coupon.minOrder) {
        discount = coupon.type === 'percent'
          ? (subtotal * coupon.value) / 100
          : Math.min(coupon.value, subtotal)
        await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } })
      }
    }

    const deliveryFee = store.deliveryFee ?? 10
    const total = subtotal - discount + deliveryFee

    // Get platform commission rate
    const settings = await prisma.platformSettings.findUnique({ where: { id: 'singleton' } })
    const commissionRate = settings?.commissionRate ?? 10

    // Create order + update stock
    const order = await prisma.$transaction(async (tx) => {
      const o = await tx.order.create({
        data: {
          customerId: req.user.id,
          storeId,
          addressId: addressId || null,
          subtotal,
          deliveryFee,
          discount,
          total,
          couponCode,
          notes,
          paymentMethod,
          items: { create: orderItems },
        },
        include: { items: true },
      })

      // Deduct stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.qty }, salesCount: { increment: item.qty } },
        })
      }

      // Create commission record
      await tx.commission.create({
        data: {
          orderId: o.id,
          storeId,
          orderTotal: total,
          rate: commissionRate,
          commission: (total * commissionRate) / 100,
        },
      })

      // Add to pending balance
      const sellerAmount = total - (total * commissionRate) / 100
      await tx.balance.upsert({
        where: { storeId },
        create: { storeId, pending: sellerAmount },
        update: { pending: { increment: sellerAmount } },
      })

      return o
    })

    // Log activity
    await prisma.activityLog.create({
      data: { type: 'order', message: `طلب جديد #${order.id} من المتجر "${store.storeName}"`, userId: req.user.id },
    }).catch(() => {})

    res.status(201).json(order)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

router.patch('/orders/:id/cancel', authenticate, async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, customerId: req.user.id },
    })
    if (!order) return res.status(404).json({ error: 'الطلب غير موجود' })
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ error: 'لا يمكن إلغاء الطلب في هذه المرحلة' })
    }
    await prisma.order.update({ where: { id: order.id }, data: { status: 'cancelled' } })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Wishlist ──────────────────────────────────────────────
router.get('/wishlist', authenticate, async (req, res) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(items.map(i => i.product))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/wishlist/:productId', authenticate, async (req, res) => {
  try {
    await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: req.user.id, productId: req.params.productId } },
      create: { userId: req.user.id, productId: req.params.productId },
      update: {},
    })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/wishlist/:productId', authenticate, async (req, res) => {
  try {
    await prisma.wishlistItem.deleteMany({
      where: { userId: req.user.id, productId: req.params.productId },
    })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Addresses ─────────────────────────────────────────────
router.get('/addresses', authenticate, async (req, res) => {
  const items = await prisma.address.findMany({
    where: { userId: req.user.id },
    orderBy: { isDefault: 'desc' },
  })
  res.json(items)
})

router.post('/addresses', authenticate, async (req, res) => {
  try {
    const { label, city, district, street, building, notes, isDefault, lat, lng } = req.body
    if (isDefault) {
      await prisma.address.updateMany({ where: { userId: req.user.id }, data: { isDefault: false } })
    }
    const address = await prisma.address.create({
      data: { userId: req.user.id, label, city, district, street, building, notes, isDefault: !!isDefault, lat, lng },
    })
    res.status(201).json(address)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put('/addresses/:id', authenticate, async (req, res) => {
  try {
    const { label, city, district, street, building, notes, isDefault, lat, lng } = req.body
    if (isDefault) {
      await prisma.address.updateMany({ where: { userId: req.user.id }, data: { isDefault: false } })
    }
    const address = await prisma.address.update({
      where: { id: req.params.id },
      data: { label, city, district, street, building, notes, isDefault: !!isDefault, lat, lng },
    })
    res.json(address)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/addresses/:id', authenticate, async (req, res) => {
  await prisma.address.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

// ── Profile ───────────────────────────────────────────────
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, email, avatar } = req.body
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email, avatar },
      select: { id: true, name: true, phone: true, email: true, role: true, avatar: true },
    })
    res.json(user)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Coupon Validation ─────────────────────────────────────
router.post('/coupons/validate', authenticate, async (req, res) => {
  try {
    const { code, storeId, subtotal } = req.body
    const coupon = await prisma.coupon.findFirst({
      where: {
        storeId, code, active: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        AND: [
          { OR: [{ maxUses: null }, { maxUses: { gt: prisma.coupon.fields.usedCount } }] },
        ],
      },
    })
    if (!coupon) return res.status(404).json({ error: 'الكوبون غير صالح أو منتهي الصلاحية' })
    if (subtotal < coupon.minOrder) {
      return res.status(400).json({ error: `الحد الأدنى للطلب ${coupon.minOrder} ر.س` })
    }
    const discount = coupon.type === 'percent'
      ? (subtotal * coupon.value) / 100
      : Math.min(coupon.value, subtotal)

    res.json({ coupon, discount })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
