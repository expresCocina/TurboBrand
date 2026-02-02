-- =============================================
-- SOLUCIÓN DEFINITIVA RLS - TURBO BRAND CRM
-- =============================================
-- Este script ELIMINA todas las políticas existentes
-- y crea políticas completamente permisivas para uso interno

-- 1. ELIMINAR TODAS LAS POLÍTICAS EXISTENTES EN CONTACTS
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'contacts'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON contacts', pol.policyname);
    END LOOP;
END $$;

-- 2. CREAR POLÍTICAS PERMISIVAS PARA CONTACTS
CREATE POLICY "allow_all_select" ON contacts FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON contacts FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON contacts FOR DELETE USING (true);

-- 3. ELIMINAR TODAS LAS POLÍTICAS EXISTENTES EN OPPORTUNITIES
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'opportunities'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON opportunities', pol.policyname);
    END LOOP;
END $$;

-- 4. CREAR POLÍTICAS PERMISIVAS PARA OPPORTUNITIES
CREATE POLICY "allow_all_select" ON opportunities FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON opportunities FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON opportunities FOR DELETE USING (true);

-- 5. ASEGURAR QUE LA ORGANIZACIÓN EXISTE
INSERT INTO organizations (id, name, domain, logo_url)
VALUES ('5e5b7400-1a66-42dc-880e-e501021edadc', 'Turbo Brand', 'turbobrand.com', '/LogoTurboBrand.webp')
ON CONFLICT (id) DO NOTHING;

-- 6. VERIFICAR POLÍTICAS (esto mostrará las políticas activas)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('contacts', 'opportunities')
ORDER BY tablename, policyname;
