-- Add QR code columns to businesses table
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS qr_code_type TEXT DEFAULT 'business',
ADD COLUMN IF NOT EXISTS qr_code_data JSONB;

-- Update existing businesses with default QR code data
UPDATE businesses 
SET qr_code_data = jsonb_build_object(
  'type', 'business',
  'business_id', id,
  'customer_url', 'https://customer.loyo.app/qr/' || id
)
WHERE qr_code_data IS NULL;
