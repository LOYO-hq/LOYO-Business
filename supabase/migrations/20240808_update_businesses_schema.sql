ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS abn TEXT,
ADD COLUMN IF NOT EXISTS acn TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_name TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_email TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS secondary_contact_name TEXT,
ADD COLUMN IF NOT EXISTS secondary_contact_email TEXT,
ADD COLUMN IF NOT EXISTS secondary_contact_phone TEXT;

CREATE TABLE IF NOT EXISTS business_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  crop_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

alter publication supabase_realtime add table business_logos;