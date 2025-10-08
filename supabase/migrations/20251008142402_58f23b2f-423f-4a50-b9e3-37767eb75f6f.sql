-- Add business customization fields to user_settings
ALTER TABLE public.user_settings
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT;