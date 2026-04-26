-- ============================================================
-- QuickMart — Supabase Schema
-- الصق هذا الملف كاملاً في Supabase → SQL Editor → Run
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- للبحث النصي

-- ============================================================
-- PROFILES  (يمتد auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  role        TEXT DEFAULT 'customer' CHECK (role IN ('customer','seller','admin','driver')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: إنشاء profile تلقائياً عند التسجيل
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, name, phone, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  emoji       TEXT,
  color       TEXT DEFAULT '#00C896',
  bg          TEXT DEFAULT '#E6FAF5',
  is_active   BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STORES
-- ============================================================
CREATE TABLE IF NOT EXISTS stores (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id        UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE,
  description     TEXT,
  category        TEXT,
  city            TEXT,
  logo_url        TEXT,
  image_url       TEXT,
  rating          DECIMAL(2,1) DEFAULT 0,
  reviews_count   INTEGER DEFAULT 0,
  delivery_time   INTEGER DEFAULT 30,
  delivery_fee    DECIMAL(10,2) DEFAULT 0,
  min_order       DECIMAL(10,2) DEFAULT 0,
  is_open         BOOLEAN DEFAULT true,
  is_featured     BOOLEAN DEFAULT false,
  cr_number       TEXT,
  national_id     TEXT,
  status          TEXT DEFAULT 'active' CHECK (status IN ('pending','active','suspended')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  store_id        UUID REFERENCES stores(id) ON DELETE CASCADE,
  category_id     INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  price           DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  discount        INTEGER DEFAULT 0 CHECK (discount BETWEEN 0 AND 100),
  stock           INTEGER DEFAULT 0,
  unit            TEXT DEFAULT 'قطعة',
  images          TEXT[] DEFAULT '{}',
  rating          DECIMAL(2,1) DEFAULT 0,
  reviews_count   INTEGER DEFAULT 0,
  is_available    BOOLEAN DEFAULT true,
  is_featured     BOOLEAN DEFAULT false,
  is_new          BOOLEAN DEFAULT false,
  tags            TEXT[] DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index للبحث النصي
CREATE INDEX IF NOT EXISTS products_name_trgm ON products USING GIN (name gin_trgm_ops);

-- ============================================================
-- ADDRESSES
-- ============================================================
CREATE TABLE IF NOT EXISTS addresses (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label       TEXT DEFAULT 'المنزل',
  city        TEXT,
  district    TEXT,
  street      TEXT,
  building    TEXT,
  lat         DECIMAL(10,6),
  lng         DECIMAL(10,6),
  is_default  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  store_id        UUID REFERENCES stores(id) ON DELETE SET NULL,
  address_id      UUID REFERENCES addresses(id) ON DELETE SET NULL,
  status          TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending','confirmed','preparing','out_for_delivery','delivered','cancelled')),
  subtotal        DECIMAL(10,2) DEFAULT 0,
  delivery_fee    DECIMAL(10,2) DEFAULT 0,
  discount        DECIMAL(10,2) DEFAULT 0,
  total           DECIMAL(10,2) DEFAULT 0,
  payment_method  TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash','card','wallet')),
  payment_status  TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','refunded')),
  notes           TEXT,
  driver_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  delivered_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  qty         INTEGER NOT NULL CHECK (qty > 0),
  subtotal    DECIMAL(10,2) NOT NULL
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  store_id    UUID REFERENCES stores(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (product_id, user_id)
);

-- ============================================================
-- WISHLISTS
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlists (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- ============================================================
-- COUPONS
-- ============================================================
CREATE TABLE IF NOT EXISTS coupons (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  store_id    UUID REFERENCES stores(id) ON DELETE CASCADE,
  code        TEXT UNIQUE NOT NULL,
  type        TEXT CHECK (type IN ('percentage','fixed')),
  value       DECIMAL(10,2) NOT NULL,
  min_order   DECIMAL(10,2) DEFAULT 0,
  max_uses    INTEGER,
  uses        INTEGER DEFAULT 0,
  expires_at  TIMESTAMPTZ,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INVITE CODES (للأدمن)
-- ============================================================
CREATE TABLE IF NOT EXISTS invite_codes (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code        TEXT UNIQUE NOT NULL,
  role        TEXT DEFAULT 'admin',
  used        BOOLEAN DEFAULT false,
  used_by     UUID REFERENCES profiles(id),
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores     ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews    ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists  ENABLE ROW LEVEL SECURITY;

-- Categories & Coupons: public read
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);

-- Profiles
CREATE POLICY "profiles_own"    ON profiles FOR ALL  USING (auth.uid() = id);
CREATE POLICY "profiles_public" ON profiles FOR SELECT USING (true);

-- Stores: public read, owner write
CREATE POLICY "stores_public_read"  ON stores FOR SELECT USING (true);
CREATE POLICY "stores_owner_write"  ON stores FOR ALL    USING (auth.uid() = owner_id);

-- Products: public read, store owner write
CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);
CREATE POLICY "products_owner_write" ON products FOR ALL
  USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));

-- Addresses: own only
CREATE POLICY "addresses_own" ON addresses FOR ALL USING (auth.uid() = user_id);

-- Orders: customer own + store owner
CREATE POLICY "orders_customer" ON orders FOR ALL USING (auth.uid() = customer_id);
CREATE POLICY "orders_store"    ON orders FOR SELECT
  USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));

-- Order items: via order
CREATE POLICY "order_items_read" ON order_items FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid()));

-- Reviews: public read, own write
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_own_write"   ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wishlists: own only
CREATE POLICY "wishlists_own" ON wishlists FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- SEED DATA — Categories
-- ============================================================
INSERT INTO categories (name, slug, emoji, color, bg, sort_order) VALUES
  ('مطاعم',       'restaurants',  '🍕', '#FF6B35', '#FFF0EB', 1),
  ('خضروات',      'vegetables',   '🥦', '#22C55E', '#F0FDF4', 2),
  ('لحوم',        'meat',         '🥩', '#EF4444', '#FEF2F2', 3),
  ('ألبان',       'dairy',        '🥛', '#3B82F6', '#EFF6FF', 4),
  ('مشروبات',     'drinks',       '🥤', '#8B5CF6', '#F5F3FF', 5),
  ('حلويات',      'sweets',       '🍰', '#EC4899', '#FDF2F8', 6),
  ('مخبوزات',     'bakery',       '🥐', '#F59E0B', '#FFFBEB', 7),
  ('عناية',       'care',         '🧴', '#06B6D4', '#ECFEFF', 8),
  ('إلكترونيات',  'electronics',  '📱', '#6366F1', '#EEF2FF', 9),
  ('منزل',        'home',         '🏠', '#14B8A6', '#F0FDFA', 10),
  ('ملابس',       'fashion',      '👗', '#F472B6', '#FDF4FF', 11),
  ('عضوي',        'organic',      '🌿', '#00C896', '#E6FAF5', 12)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED DATA — Demo Stores
-- ============================================================
INSERT INTO stores (id, name, slug, description, category, city, rating, delivery_time, delivery_fee, min_order, is_open, is_featured, status) VALUES
  (uuid_generate_v4(), 'مطعم البيت السعودي',  'al-bayt-restaurant', 'أفضل المأكولات السعودية الأصيلة', 'مطاعم', 'الرياض', 4.9, 25, 0,  30, true,  true,  'active'),
  (uuid_generate_v4(), 'سوق الخضار الطازج',   'fresh-vegetables',   'خضروات وفواكه طازجة يومياً',       'خضروات', 'الرياض', 4.7, 30, 5,  20, true,  true,  'active'),
  (uuid_generate_v4(), 'متجر الإلكترونيات',   'tech-store',         'أحدث الأجهزة الإلكترونية',         'إلكترونيات', 'جدة',   4.8, 45, 10, 50, true,  false, 'active'),
  (uuid_generate_v4(), 'مخبز الفرن الحجري',   'stone-bakery',       'خبز ومعجنات طازجة كل يوم',         'مخبوزات', 'الرياض', 4.6, 20, 0,  15, false, false, 'active'),
  (uuid_generate_v4(), 'صيدلية الرعاية',      'care-pharmacy',      'أدوية ومستلزمات طبية',              'صحة وجمال', 'جدة',  4.9, 35, 0,  0,  true,  true,  'active'),
  (uuid_generate_v4(), 'بقالة النجمة',        'najma-grocery',      'كل احتياجاتك اليومية',             'بقالة', 'الرياض', 4.5, 20, 5,  25, true,  false, 'active')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED DATA — Demo Products (بدون store_id لأنه UUID ديناميكي)
-- سيتم إضافة المنتجات من لوحة البائع
-- ============================================================

-- ============================================================
-- SEED DATA — Invite Code للأدمن (كود تجريبي)
-- ============================================================
INSERT INTO invite_codes (code, role, expires_at) VALUES
  ('ADMIN-2024-QUICKMART', 'admin', NOW() + INTERVAL '1 year')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- شغّل هذا منفصلاً في Supabase Dashboard → Storage:
-- 1. أنشئ bucket اسمه: "products"   (public: true)
-- 2. أنشئ bucket اسمه: "stores"     (public: true)
-- 3. أنشئ bucket اسمه: "avatars"    (public: true)
