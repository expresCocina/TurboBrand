-- Arreglar políticas RLS para email_campaigns
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Enable all access for all users" ON email_campaigns;
DROP POLICY IF EXISTS "Enable read access for all users" ON email_campaigns;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON email_campaigns;

-- Crear política permisiva (para MVP interno)
CREATE POLICY "Enable all access for all users"
ON email_campaigns
FOR ALL
USING (true)
WITH CHECK (true);

-- ==========================================

-- Arreglar políticas RLS para email_sends
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Enable all access for all users" ON email_sends;
DROP POLICY IF EXISTS "Enable read access for all users" ON email_sends;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON email_sends;

-- Crear política permisiva
CREATE POLICY "Enable all access for all users"
ON email_sends
FOR ALL
USING (true)
WITH CHECK (true);
