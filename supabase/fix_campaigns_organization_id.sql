-- Fix existing campaigns without organization_id
-- This script updates campaigns that were created without organization_id
-- so they appear in the campaigns list

-- Update all campaigns without organization_id to use the default organization
UPDATE email_campaigns
SET organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc'
WHERE organization_id IS NULL;

-- Verify the update
SELECT 
    id,
    name,
    subject,
    status,
    organization_id,
    created_at
FROM email_campaigns
ORDER BY created_at DESC
LIMIT 10;
