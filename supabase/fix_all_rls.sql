-- Script Masivo de Corrección de Permisos (RLS) - VERSION CORREGIDA
-- Corrige el error "column organization_id does not exist" usando JOINs donde sea necesario.

-- 1. Helper function para obtener org_id
CREATE OR REPLACE FUNCTION get_my_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM crm_users WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- === TABLA: CONTACTS ===
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view org contacts" ON contacts;
CREATE POLICY "Users can view org contacts" ON contacts FOR SELECT USING (organization_id = get_my_org_id());
DROP POLICY IF EXISTS "Users can insert org contacts" ON contacts;
CREATE POLICY "Users can insert org contacts" ON contacts FOR INSERT WITH CHECK (organization_id = get_my_org_id());
DROP POLICY IF EXISTS "Users can update org contacts" ON contacts;
CREATE POLICY "Users can update org contacts" ON contacts FOR UPDATE USING (organization_id = get_my_org_id());
DROP POLICY IF EXISTS "Users can delete org contacts" ON contacts;
CREATE POLICY "Users can delete org contacts" ON contacts FOR DELETE USING (organization_id = get_my_org_id());

-- === TABLA: OPPORTUNITIES ===
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view org opportunities" ON opportunities;
CREATE POLICY "Users can view org opportunities" ON opportunities FOR SELECT USING (organization_id = get_my_org_id());
DROP POLICY IF EXISTS "Users can insert org opportunities" ON opportunities;
CREATE POLICY "Users can insert org opportunities" ON opportunities FOR INSERT WITH CHECK (organization_id = get_my_org_id());
DROP POLICY IF EXISTS "Users can update org opportunities" ON opportunities;
CREATE POLICY "Users can update org opportunities" ON opportunities FOR UPDATE USING (organization_id = get_my_org_id());
DROP POLICY IF EXISTS "Users can delete org opportunities" ON opportunities;
CREATE POLICY "Users can delete org opportunities" ON opportunities FOR DELETE USING (organization_id = get_my_org_id());

-- === TABLA: CRM_USERS ===
ALTER TABLE crm_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON crm_users;
CREATE POLICY "Users can view own profile" ON crm_users FOR SELECT USING (auth.uid() = id);

-- === TABLA: ORGANIZATIONS ===
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own organization" ON organizations;
CREATE POLICY "Users can view own organization" ON organizations FOR SELECT USING (id = get_my_org_id());

-- === TABLA: EMAIL_CAMPAIGNS ===
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can all org campaigns" ON email_campaigns;
CREATE POLICY "Users can all org campaigns" ON email_campaigns FOR ALL USING (organization_id = get_my_org_id());

-- === TABLA: EMAIL_SENDS (No tiene organization_id, usamos JOIN con campaigns) ===
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view org email_sends" ON email_sends;
-- Verifica si la campaa asociada pertenece a la organizacin del usuario
CREATE POLICY "Users can view org email_sends" ON email_sends FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM email_campaigns ec
    WHERE ec.id = email_sends.campaign_id
    AND ec.organization_id = get_my_org_id()
  )
);

-- === TABLA: WHATSAPP_CONVERSATIONS ===
ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can all org wa_convs" ON whatsapp_conversations;
CREATE POLICY "Users can all org wa_convs" ON whatsapp_conversations FOR ALL USING (organization_id = get_my_org_id());

-- === TABLA: TASKS ===
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can all org tasks" ON tasks;
CREATE POLICY "Users can all org tasks" ON tasks FOR ALL USING (organization_id = get_my_org_id());

-- === TABLA: ACTIVITIES (No tiene organization_id, usamos el user_id o contact_id) ===
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view org activities" ON activities;
-- Permitir ver si la actividad fue creada por un usuario de la misma organizacin
CREATE POLICY "Users can view org activities" ON activities FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM crm_users cu
    WHERE cu.id = activities.user_id
    AND cu.organization_id = get_my_org_id()
  )
);
-- Permitir insertar actividades propias
DROP POLICY IF EXISTS "Users can insert own activities" ON activities;
CREATE POLICY "Users can insert own activities" ON activities FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
