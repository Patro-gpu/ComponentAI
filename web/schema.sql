-- ComponentAI Supabase Schema
-- Run this in Supabase SQL Editor

-- 1. Components history
CREATE TABLE components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  component_type TEXT NOT NULL,
  framework TEXT NOT NULL,
  prompt TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_components_user_id ON components(user_id);
CREATE INDEX idx_components_created_at ON components(created_at DESC);

-- 2. Usage tracking
CREATE TABLE usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- format: '2026-05'
  count INTEGER DEFAULT 0,
  UNIQUE(user_id, month)
);

-- 3. Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Rate limit: 20 free generations/month
CREATE OR REPLACE FUNCTION check_usage_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_month TEXT := to_char(now(), 'YYYY-MM');
  usage_count INTEGER;
  user_plan TEXT;
BEGIN
  SELECT plan INTO user_plan FROM subscriptions WHERE user_id = NEW.user_id;
  -- Pro/Team have unlimited
  IF user_plan = 'pro' OR user_plan = 'team' THEN RETURN NEW; END IF;

  SELECT count INTO usage_count FROM usage
  WHERE user_id = NEW.user_id AND month = current_month;

  IF usage_count >= 20 THEN
    RAISE EXCEPTION 'Free tier limit (20/month) reached. Upgrade to Pro.';
  END IF;

  INSERT INTO usage (user_id, month, count) VALUES (NEW.user_id, current_month, 1)
  ON CONFLICT (user_id, month) DO UPDATE SET count = usage.count + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_usage_limit
  BEFORE INSERT ON components
  FOR EACH ROW EXECUTE FUNCTION check_usage_limit();

-- 5. Row Level Security
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own components"
  ON components FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own usage"
  ON usage FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own subscription"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);
