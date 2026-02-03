-- Enable RLS on automations (ensure it is on)
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;

-- Remove valid policies to avoid conflicts
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON automations;
DROP POLICY IF EXISTS "Users can view their organization automations" ON automations;
DROP POLICY IF EXISTS "Users can insert automations" ON automations;
DROP POLICY IF EXISTS "Users can update automations" ON automations;
DROP POLICY IF EXISTS "Users can delete automations" ON automations;

-- Create a blanket policy for Single Tenant mode (Authenticated users can do everything)
CREATE POLICY "Enable all access for authenticated users"
ON automations
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Also ensure RLS for tasks if we are creating them
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for tasks" ON tasks;
CREATE POLICY "Enable all access for tasks"
ON tasks
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
