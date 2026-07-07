import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // ── Admin ─────────────────────────────────────────────
  const adminPass = await bcrypt.hash('Admin@123', 12)
  const admin = await prisma.user.upsert({
    where:  { phone: '0500000000' },
    create: { name: 'مدير النظام', phone: '0500000000', password: adminPass, role: 'admin', status: 'active' },
    update: {},
  })
  console.log('✅ Admin created:', admin.phone)

  // ── Platform Settings ─────────────────────────────────
  await prisma.platformSettings.upsert({
    where:  { id: 'singleton' },
    create: { id: 'singleton', commissionRate: 10, maintenanceMode: false, allowNewSellers: true, supportPhone: '920000000', supportEmail: 'support@quickmart.sa' },
    update: {},
  })

  // ── Sellers ───────────────────────────────────────────
  const sellerPass = await bcrypt.hash('Seller@123', 12)

  const seller1 = await prisma.user.upsert({
    where:  { phone: '0511111111' },
    create: { name: 'محمد العمري', phone: '0511111111', password: sellerPass, role: 'seller', status: 'active' },
    update: {},
  })

  const store1 = await prisma.store.upsert({
    where:  { sellerId: seller1.id },
    create: {
      sellerId: seller1.id, storeName: 'سوبر ماركت العمري', category: 'supermarket',
      city: 'الرياض', address: 'حي النزهة، شارع الأمير سلطان',
      phone: '0511111111', status: 'active', deliveryTime: '30-45', deliveryFee: 15,
      rating: 4.5, ratingCount: 120,
      description: 'أفضل سوبر ماركت في الرياض، نوفر أجود المنتجات بأسعار منافسة',
    },
    update: {},
  })

  const seller2 = await prisma.user.upsert({
    where:  { phone: '0522222222' },
    create: { name: 'سارة الأحمدي', phone: '0522222222', password: sellerPass, role: 'seller', status: 'active' },
    update: {},
  })

  const store2 = await prisma.store.upsert({
    where:  { sellerId: seller2.id },
    create: {
      sellerId: seller2.id, storeName: 'مخبزة الأصالة', category: 'bakery',
      city: 'جدة', address: 'حي الروضة، شارع فلسطين',
      phone: '0522222222', status: 'active', deliveryTime: '20-30', deliveryFee: 10,
      rating: 4.8, ratingCount: 85,
      description: 'مخبزة متخصصة في المعجنات والخبز الطازج يومياً',
    },
    update: {},
  })

  // Pending seller
  const seller3 = await prisma.user.upsert({
    where:  { phone: '0533333333' },
    create: { name: 'خالد المطيري', phone: '0533333333', password: sellerPass, role: 'seller', status: 'active' },
    update: {},
  })

  await prisma.store.upsert({
    where:  { sellerId: seller3.id },
    create: {
      sellerId: seller3.id, storeName: 'صيدلية الشفاء', category: 'pharmacy',
      city: 'الدمام', address: 'حي العزيزية',
      phone: '0533333333', status: 'pending', deliveryTime: '45-60', deliveryFee: 20,
    },
    update: {},
  })

  // ── Products ──────────────────────────────────────────
  const products1 = [
    { name: 'حليب طازج ١ لتر',        category: 'dairy',     price: 5.5, stock: 200, unit: 'قطعة',  description: 'حليب طازج كامل الدسم',          images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'] },
    { name: 'بيض دجاج طازج ١٢ حبة',   category: 'dairy',     price: 18,  stock: 150, unit: 'كرتون', description: 'بيض طازج مباشر من المزرعة',      images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400'] },
    { name: 'دجاج مبرد ١ كيلو',        category: 'meat',      price: 24, comparePrice: 28, stock: 80, unit: 'كيلو',  description: 'دجاج طازج مبرد', images: ['https://images.unsplash.com/photo-1604503468506-a8da13d11d36?w=400'] },
    { name: 'أرز بسمتي ٥ كيلو',        category: 'grains',    price: 45,  stock: 100, unit: 'كيس',   description: 'أرز بسمتي فاخر',                images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'] },
    { name: 'زيت زيتون بكر ٧٥٠ مل',   category: 'oils',      price: 65, comparePrice: 75, stock: 60, unit: 'زجاجة', description: 'زيت زيتون بكر ممتاز', images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'] },
    { name: 'طماطم طازجة ١ كيلو',      category: 'vegetables', price: 8,  stock: 300, unit: 'كيلو',  description: 'طماطم طازجة يومية',             images: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400'] },
    { name: 'موز ١ كيلو',              category: 'fruits',    price: 12,  stock: 200, unit: 'كيلو',  description: 'موز حلو ناضج',                  images: ['https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400'] },
    { name: 'ماء معدني ١٫٥ لتر',       category: 'beverages', price: 3,   stock: 500, unit: 'زجاجة', description: 'مياه معدنية نقية',              images: ['https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400'] },
  ]

  for (const p of products1) {
    await prisma.product.upsert({
      where: { storeId_name: { storeId: store1.id, name: p.name } },
      create: { storeId: store1.id, ...p, isActive: true, salesCount: Math.floor(Math.random() * 100) },
      update: { images: p.images },
    }).catch(() => {})
  }

  const products2 = [
    { name: 'خبز عربي طازج ٥ أرغفة',   category: 'bakery', price: 6,  stock: 100, unit: 'كيس',   description: 'خبز عربي طازج من الفرن',    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'] },
    { name: 'كرواسون بالزبدة ٦ حبات',  category: 'bakery', price: 22, comparePrice: 26, stock: 50, unit: 'علبة', description: 'كرواسون فرنسي طازج', images: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'] },
    { name: 'كعك الشاي المنزلي',        category: 'sweets', price: 35, stock: 40,  unit: 'كيلو',  description: 'كعك شاي تقليدي',           images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'] },
    { name: 'سمبوسة لحم ١٢ حبة',       category: 'bakery', price: 28, stock: 60,  unit: 'علبة',  description: 'سمبوسة لحم محلية الصنع',   images: ['https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'] },
  ]

  for (const p of products2) {
    await prisma.product.upsert({
      where: { storeId_name: { storeId: store2.id, name: p.name } },
      create: { storeId: store2.id, ...p, isActive: true, salesCount: Math.floor(Math.random() * 50) },
      update: { images: p.images },
    }).catch(() => {})
  }

  // ── Customer ───────────────────────────────────────────
  const customerPass = await bcrypt.hash('Customer@123', 12)
  await prisma.user.upsert({
    where:  { phone: '0555555555' },
    create: { name: 'أحمد التجريبي', phone: '0555555555', password: customerPass, role: 'customer', status: 'active' },
    update: {},
  })

  // ── Driver ────────────────────────────────────────────
  const driverPass = await bcrypt.hash('Driver@123', 12)
  const driverUser = await prisma.user.upsert({
    where:  { phone: '0544444444' },
    create: { name: 'فهد السائق', phone: '0544444444', password: driverPass, role: 'driver', status: 'active' },
    update: {},
  })

  await prisma.driver.upsert({
    where:  { userId: driverUser.id },
    create: { userId: driverUser.id, vehicleType: 'دراجة نارية', vehiclePlate: 'أ ب ج 1234', isAvailable: true },
    update: {},
  })

  // ── Platform Settings Alerts ───────────────────────────
  await prisma.alert.upsert({
    where:  { id: 'seed-alert-1' },
    create: { id: 'seed-alert-1', type: 'warning', title: 'مبيعات منخفضة', message: 'انخفض حجم المبيعات بنسبة 15% عن الأسبوع الماضي', severity: 'medium' },
    update: {},
  })

  await prisma.alert.upsert({
    where:  { id: 'seed-alert-2' },
    create: { id: 'seed-alert-2', type: 'info', title: 'بائع جديد', message: 'تم تسجيل متجر جديد يحتاج إلى مراجعة وموافقة', severity: 'low' },
    update: {},
  })

  console.log('✅ Seed completed successfully!')
  console.log('')
  console.log('📋 Accounts:')
  console.log('   Admin:    phone=0500000000   password=Admin@123')
  console.log('   Seller 1: phone=0511111111   password=Seller@123')
  console.log('   Seller 2: phone=0522222222   password=Seller@123')
  console.log('   Customer: phone=0555555555   password=Customer@123')
}

main()
  .catch(e => { console.error('❌ Seed error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
