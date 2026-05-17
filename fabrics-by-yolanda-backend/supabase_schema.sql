-- ═══════════════════════════════════════════════════════════
--  FABRICS BY YOLANDA — SUPABASE DATABASE SCHEMA
--  Paste this entire file into: Supabase → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ─── PROFILES (extends Supabase auth.users) ─────────────────
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  phone         TEXT,
  address       TEXT,
  city          TEXT,
  state         TEXT,
  role          TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ─── CATEGORIES ─────────────────────────────────────────────
CREATE TABLE categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL UNIQUE,         -- e.g. "Brocade", "Silk"
  slug          TEXT NOT NULL UNIQUE,         -- e.g. "brocade", "silk"
  description   TEXT,
  image_url     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ─── PRODUCTS ───────────────────────────────────────────────
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT,
  price_per_yard  NUMERIC(12,2) NOT NULL,       -- price in Naira
  width_inches    INTEGER,                       -- fabric width e.g. 54, 60
  fabric_type     TEXT,                          -- e.g. "Woven Brocade"
  color           TEXT,
  stock_yards     NUMERIC(10,2) DEFAULT 0,       -- available yards
  min_order_yards NUMERIC(5,2) DEFAULT 1,
  is_featured     BOOLEAN DEFAULT FALSE,
  is_active       BOOLEAN DEFAULT TRUE,
  badge           TEXT,                          -- "New", "Hot", "Bestseller"
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ─── PRODUCT IMAGES ─────────────────────────────────────────
CREATE TABLE product_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,                     -- Supabase Storage URL
  alt_text    TEXT,
  is_primary  BOOLEAN DEFAULT FALSE,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ─── ORDERS ─────────────────────────────────────────────────
CREATE TABLE orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number      TEXT UNIQUE NOT NULL,          -- e.g. FBY-2025-00001
  status            TEXT DEFAULT 'pending'
                    CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled','refunded')),
  -- Customer details (snapshot at time of order)
  customer_name     TEXT NOT NULL,
  customer_email    TEXT NOT NULL,
  customer_phone    TEXT,
  -- Shipping address
  shipping_address  TEXT NOT NULL,
  shipping_city     TEXT NOT NULL,
  shipping_state    TEXT NOT NULL,
  -- Pricing
  subtotal          NUMERIC(12,2) NOT NULL,
  shipping_fee      NUMERIC(12,2) DEFAULT 0,
  total             NUMERIC(12,2) NOT NULL,
  -- Payment
  payment_ref       TEXT,                          -- Paystack reference
  payment_status    TEXT DEFAULT 'unpaid'
                    CHECK (payment_status IN ('unpaid','paid','failed','refunded')),
  paid_at           TIMESTAMPTZ,
  -- Notes
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);


-- ─── ORDER ITEMS ────────────────────────────────────────────
CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id      UUID REFERENCES products(id) ON DELETE SET NULL,
  -- Snapshot of product at time of order
  product_name    TEXT NOT NULL,
  price_per_yard  NUMERIC(12,2) NOT NULL,
  yards_ordered   NUMERIC(10,2) NOT NULL,
  line_total      NUMERIC(12,2) NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ─── CART ───────────────────────────────────────────────────
CREATE TABLE cart_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  yards       NUMERIC(10,2) NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);


-- ─── NEWSLETTER SUBSCRIBERS ─────────────────────────────────
CREATE TABLE newsletter_subscribers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE NOT NULL,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ─── CUSTOM ORDER REQUESTS ──────────────────────────────────
CREATE TABLE custom_orders (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  fabric_desc   TEXT NOT NULL,       -- what fabric they want
  quantity      TEXT,                -- approximate yards
  budget        TEXT,                -- approximate budget
  deadline      DATE,
  status        TEXT DEFAULT 'new'
                CHECK (status IN ('new','reviewed','quoted','accepted','rejected')),
  admin_notes   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ═══════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS) — Very important!
-- ═══════════════════════════════════════════════════════════

ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images     ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_orders      ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
CREATE POLICY "Users can view own profile"   ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products & Categories: anyone can read, only admins can write
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can view categories"      ON categories FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view product images"  ON product_images FOR SELECT USING (TRUE);

-- Orders: users see only their own
CREATE POLICY "Users can view own orders"   ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders"     ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own items"    ON order_items FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- Cart: users manage their own cart
CREATE POLICY "Users manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Newsletter: anyone can subscribe
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers FOR INSERT WITH CHECK (TRUE);

-- Custom orders: users see their own, anyone can create
CREATE POLICY "Anyone can submit custom order"   ON custom_orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can view own custom orders" ON custom_orders FOR SELECT USING (auth.uid() = user_id);


-- ═══════════════════════════════════════════════════════════
--  FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  count_today INTEGER;
  order_num TEXT;
  year_str TEXT;
BEGIN
  SELECT COUNT(*) INTO count_today FROM orders
  WHERE DATE(created_at) = CURRENT_DATE;
  order_num := 'FBY-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD((count_today + 1)::TEXT, 5, '0');
  NEW.order_number := order_num;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Auto update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at  BEFORE UPDATE ON products  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_orders_updated_at    BEFORE UPDATE ON orders    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_profiles_updated_at  BEFORE UPDATE ON profiles  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ═══════════════════════════════════════════════════════════
--  SEED DATA — Starter Categories
-- ═══════════════════════════════════════════════════════════
INSERT INTO categories (name, slug, description) VALUES
  ('Brocade',  'brocade',  'Richly woven fabrics with raised patterns'),
  ('Silk',     'silk',     'Luxurious natural silk fabrics'),
  ('Velvet',   'velvet',   'Soft, plush velvet fabrics'),
  ('Ankara',   'ankara',   'Bold African print fabrics'),
  ('Lace',     'lace',     'Elegant lace and guipure fabrics'),
  ('Chiffon',  'chiffon',  'Light, sheer flowing fabrics');
