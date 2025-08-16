-- Add qr_button_color column to stamp_cards table
ALTER TABLE stamp_cards ADD COLUMN IF NOT EXISTS qr_button_color TEXT DEFAULT '#ea580c';
