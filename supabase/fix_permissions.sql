-- =============================================
-- FIX PERMISOS Y DATOS CRM (CORREGIDO)
-- =============================================

-- 1. Asegurar que existe la organización Turbo Brand
-- Usamos un DO block para verificar antes de insertar para evitar errores de sintaxis ON CONFLICT
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Turbo Brand') THEN
        INSERT INTO organizations (name, domain, logo_url)
        VALUES ('Turbo Brand', 'turbobrand.com', '/LogoTurboBrand.webp');
    END IF;
END $$;

-- 2. Habilitar lectura de organizaciones para usuarios autenticados
DROP POLICY IF EXISTS "Authenticated users can view organizations" ON organizations;
CREATE POLICY "Authenticated users can view organizations" ON organizations
  FOR SELECT TO authenticated USING (true);

-- 3. Habilitar lectura de crm_users
DROP POLICY IF EXISTS "Authenticated users can view crm_users" ON crm_users;
CREATE POLICY "Authenticated users can view crm_users" ON crm_users
  FOR SELECT TO authenticated USING (true);

-- 4. PERMISOS DE CONTACTOS (Corrección RLS)
DROP POLICY IF EXISTS "Users can insert in their organization" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can insert contacts" ON contacts;
DROP POLICY IF EXISTS "Users can view their organization data" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can view contacts" ON contacts;

-- Permitir TODO a usuarios autenticados para Contactos (Modo Single Tenant / Internal Tool)
CREATE POLICY "Enable read access for all authenticated users" ON contacts
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for all authenticated users" ON contacts
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for all authenticated users" ON contacts
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete access for all authenticated users" ON contacts
    FOR DELETE TO authenticated USING (true);


-- 5. PERMISOS DE OPORTUNIDADES (Ventas)
DROP POLICY IF EXISTS "Users can insert in their organization" ON opportunities;
DROP POLICY IF EXISTS "Authenticated users can insert opportunities" ON opportunities;
DROP POLICY IF EXISTS "Users can view their organization data" ON opportunities;
DROP POLICY IF EXISTS "Authenticated users can view opportunities" ON opportunities;

CREATE POLICY "Enable read access for all authenticated users" ON opportunities
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for all authenticated users" ON opportunities
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for all authenticated users" ON opportunities
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete access for all authenticated users" ON opportunities
    FOR DELETE TO authenticated USING (true);
