-- Payment & Subscription Tables
-- Run via /admin/ SQL Runner

-- Purchases (order records)
CREATE TABLE IF NOT EXISTS purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trade_no text UNIQUE NOT NULL,
  line_user_id text NOT NULL,
  product_type text NOT NULL,
  book_slugs text[] DEFAULT '{}',
  amount int NOT NULL,
  status text DEFAULT 'pending',
  ecpay_trade_no text DEFAULT '',
  rtn_code int,
  rtn_msg text DEFAULT '',
  payment_type text DEFAULT '',
  paid_at text,
  invoice_no text DEFAULT '',
  invoice_date text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Subscriptions (monthly unlimited)
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  line_user_id text NOT NULL,
  plan text DEFAULT 'monthly',
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "purchases_service_all" ON purchases FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "subscriptions_service_all" ON subscriptions FOR ALL USING (auth.role() = 'service_role');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(line_user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_trade ON purchases(trade_no);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(line_user_id);
