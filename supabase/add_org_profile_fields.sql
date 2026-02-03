-- Add extended profile fields to organizations table
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS industry VARCHAR(100);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT 'America/Bogota';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'COP';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS description TEXT;
