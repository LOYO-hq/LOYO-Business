-- Add missing columns to stamp_cards table
ALTER TABLE stamp_cards ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#3B82F6';
ALTER TABLE stamp_cards ADD COLUMN IF NOT EXISTS stamp_shape TEXT DEFAULT 'emoji';
ALTER TABLE stamp_cards ADD COLUMN IF NOT EXISTS selected_emoji TEXT DEFAULT '⭐';
ALTER TABLE stamp_cards ADD COLUMN IF NOT EXISTS custom_stamp_image TEXT;
ALTER TABLE stamp_cards ADD COLUMN IF NOT EXISTS layout TEXT DEFAULT 'auto';
ALTER TABLE stamp_cards ADD COLUMN IF NOT EXISTS font_size TEXT DEFAULT 'medium';
ALTER TABLE stamp_cards ADD COLUMN IF NOT EXISTS show_logo BOOLEAN DEFAULT true;
ALTER TABLE stamp_cards ADD COLUMN IF NOT EXISTS show_progress BOOLEAN DEFAULT true;
ALTER TABLE stamp_cards ADD COLUMN IF NOT EXISTS stamp_base_shape TEXT DEFAULT 'circle';

-- Update default colors to match the component
ALTER TABLE stamp_cards ALTER COLUMN background_color SET DEFAULT '#ffffff';
ALTER TABLE stamp_cards ALTER COLUMN text_color SET DEFAULT '#1f2937';
