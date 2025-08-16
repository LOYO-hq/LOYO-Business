CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  address TEXT NOT NULL,
  suburb TEXT NOT NULL,
  state TEXT NOT NULL,
  postcode TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  description TEXT,
  plan_type TEXT NOT NULL DEFAULT 'trial',
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stamp_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  stamps_required INTEGER NOT NULL DEFAULT 10,
  reward_description TEXT NOT NULL,
  background_color TEXT DEFAULT '#3B82F6',
  text_color TEXT DEFAULT '#FFFFFF',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_stamps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  stamp_card_id UUID NOT NULL REFERENCES stamp_cards(id) ON DELETE CASCADE,
  stamps_earned INTEGER DEFAULT 0,
  stamps_redeemed INTEGER DEFAULT 0,
  last_stamp_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, stamp_card_id)
);

CREATE TABLE IF NOT EXISTS stamp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_stamp_id UUID NOT NULL REFERENCES customer_stamps(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed')),
  stamps_count INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

alter publication supabase_realtime add table businesses;
alter publication supabase_realtime add table stamp_cards;
alter publication supabase_realtime add table customers;
alter publication supabase_realtime add table customer_stamps;
alter publication supabase_realtime add table stamp_transactions;