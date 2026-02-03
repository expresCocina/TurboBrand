-- Enable RLS on organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Policy to allow all authenticated users to View/Update the Organization (Single Tenant style)
-- This fixes the issue where the frontend cannot load the organization ID, resulting in "invalid input syntax for type uuid"
DROP POLICY IF EXISTS "Access all organizations" ON organizations;
CREATE POLICY "Access all organizations"
ON organizations
FOR ALL
USING (auth.role() = 'authenticated');

-- Also ensure we have the profile fields if they weren't added
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS industry VARCHAR(100);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT 'America/Bogota';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'COP';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS description TEXT;
