-- Add WhatsApp configuration fields to organizations table
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS whatsapp_access_token TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS whatsapp_business_id TEXT;
-- Add Meta Verify Token for Webhooks
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS whatsapp_verify_token TEXT DEFAULT 'turbo_brand_verify_token';
