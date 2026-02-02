-- =============================================
-- FIX DEFINITIVO ORGANIZACIÓN (ACCESO PÚBLICO)
-- =============================================

-- 1. Aseguramos que RLS esté habilitado pero con políticas PÚBLICAS para lectura
-- Esto es seguro porque solo es el nombre/logo de la empresa.
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON organizations;
DROP POLICY IF EXISTS "Authenticated users can view organizations" ON organizations;

-- Permitir lectura a TODO EL MUNDO (anon y authenticated)
CREATE POLICY "Public read access" ON organizations
  FOR SELECT USING (true);


-- 2. Asegurar inserción de Turbo Brand
INSERT INTO organizations (name, domain, logo_url)
VALUES ('Turbo Brand', 'turbobrand.com', '/LogoTurboBrand.webp')
ON CONFLICT DO NOTHING;


-- 3. Verificar que hay datos (Esto mostrará el ID en el editor SQL)
SELECT * FROM organizations;

-- 4. Permisos EXPLICITOS para contactos (por si acaso)
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON contacts;
DROP POLICY IF EXISTS "Enable insert access for all authenticated users" ON contacts;

CREATE POLICY "Enable read access for all authenticated users" ON contacts
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for all authenticated users" ON contacts
    FOR INSERT TO authenticated WITH CHECK (true);
