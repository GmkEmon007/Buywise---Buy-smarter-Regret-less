CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  canonical_url TEXT,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  image_url TEXT,
  current_price NUMERIC(10,2),
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  rating NUMERIC(3,2),
  title TEXT,
  body TEXT NOT NULL,
  sentiment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buy_score INT NOT NULL CHECK (buy_score BETWEEN 0 AND 100),
  regret_score INT NOT NULL CHECK (regret_score BETWEEN 0 AND 100),
  trust_score INT NOT NULL CHECK (trust_score BETWEEN 0 AND 100),
  sentiment JSONB NOT NULL,
  pros JSONB NOT NULL,
  cons JSONB NOT NULL,
  complaints JSONB NOT NULL,
  risks JSONB NOT NULL,
  summary TEXT NOT NULL,
  alternatives JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS price_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_analyses_product_created ON analyses(product_id, created_at DESC);
