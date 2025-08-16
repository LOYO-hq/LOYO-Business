-- Create stamp_requests table for managing stamp approval workflow
CREATE TABLE IF NOT EXISTS stamp_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_stamp_id UUID NOT NULL REFERENCES customer_stamps(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  stamp_number INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'snoozed')),
  is_new_customer BOOLEAN DEFAULT FALSE,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  denied_at TIMESTAMP WITH TIME ZONE,
  snoozed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_stamp_requests_business_id ON stamp_requests(business_id);
CREATE INDEX IF NOT EXISTS idx_stamp_requests_status ON stamp_requests(status);
CREATE INDEX IF NOT EXISTS idx_stamp_requests_customer_stamp_id ON stamp_requests(customer_stamp_id);
CREATE INDEX IF NOT EXISTS idx_stamp_requests_requested_at ON stamp_requests(requested_at);

-- Add avatar_url column to customers table if it doesn't exist
ALTER TABLE customers ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add qr_code_data column to stamp_cards table for QR validation
ALTER TABLE stamp_cards ADD COLUMN IF NOT EXISTS qr_code_data JSONB;

-- Enable realtime for stamp_requests
ALTER PUBLICATION supabase_realtime ADD TABLE stamp_requests;
