-- Script para MIGRAR a MODO SINGLE-TENANT (Solo Turbo Brand)
-- Elimina la complejidad de organizaciones y abre permisos a todo el equipo.

-- 1. Deshabilitar RLS temporalmente o cambiar a politicas abiertas
--    En lugar de filtrar por organization_id, permitiremos todo a 'authenticated'

-- Helper para simplificar
CREATE OR REPLACE FUNCTION public.allow_all_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.role() = 'authenticated');
END;
$$ LANGUAGE plpgsql;

-- === TABLA: CONTACTS ===
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view org contacts" ON contacts;
DROP POLICY IF EXISTS "Users can insert org contacts" ON contacts;
DROP POLICY IF EXISTS "Users can update org contacts" ON contacts;
DROP POLICY IF EXISTS "Users can delete org contacts" ON contacts;

CREATE POLICY "Enable access to all users" ON contacts FOR ALL USING (auth.role() = 'authenticated');
ALTER TABLE contacts ALTER COLUMN organization_id DROP NOT NULL; -- Hacer opcional

-- === TABLA: OPPORTUNITIES ===
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view org opportunities" ON opportunities;
DROP POLICY IF EXISTS "Users can insert org opportunities" ON opportunities;
DROP POLICY IF EXISTS "Users can update org opportunities" ON opportunities;
DROP POLICY IF EXISTS "Users can delete org opportunities" ON opportunities;

CREATE POLICY "Enable access to all users" ON opportunities FOR ALL USING (auth.role() = 'authenticated');
ALTER TABLE opportunities ALTER COLUMN organization_id DROP NOT NULL;

-- === TABLA: CRM_USERS ===
ALTER TABLE crm_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON crm_users;

-- Permitir ver todos los usuarios (para saber quien creo que cosa)
CREATE POLICY "Enable access to all users" ON crm_users FOR ALL USING (auth.role() = 'authenticated');
ALTER TABLE crm_users ALTER COLUMN organization_id DROP NOT NULL;

-- === TABLA: EMAIL_CAMPAIGNS ===
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can all org campaigns" ON email_campaigns;

CREATE POLICY "Enable access to all users" ON email_campaigns FOR ALL USING (auth.role() = 'authenticated');
ALTER TABLE email_campaigns ALTER COLUMN organization_id DROP NOT NULL;

-- === TABLA: EMAIL_SENDS ===
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view org email_sends" ON email_sends;

CREATE POLICY "Enable access to all users" ON email_sends FOR ALL USING (auth.role() = 'authenticated');

-- === TABLA: WHATSAPP_CONVERSATIONS ===
ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can all org wa_convs" ON whatsapp_conversations;

CREATE POLICY "Enable access to all users" ON whatsapp_conversations FOR ALL USING (auth.role() = 'authenticated');
ALTER TABLE whatsapp_conversations ALTER COLUMN organization_id DROP NOT NULL;

-- === TABLA: TASKS ===
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can all org tasks" ON tasks;

CREATE POLICY "Enable access to all users" ON tasks FOR ALL USING (auth.role() = 'authenticated');
ALTER TABLE tasks ALTER COLUMN organization_id DROP NOT NULL;

-- === TABLA: ACTIVITIES ===
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view org activities" ON activities;
DROP POLICY IF EXISTS "Users can insert own activities" ON activities;

CREATE POLICY "Enable access to all users" ON activities FOR ALL USING (auth.role() = 'authenticated');

-- === TABLA: ORGANIZATIONS ===
-- Ya no es crítica, pero dejamos acceso por si acaso
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own organization" ON organizations;

CREATE POLICY "Enable access to all users" ON organizations FOR ALL USING (auth.role() = 'authenticated');
