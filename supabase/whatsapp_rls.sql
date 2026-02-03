-- Script para Habilitar RLS en WhatsApp Messages
-- Permite acceso a todos los usuarios autenticados (Single Tenant)

ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view org wa_messages" ON whatsapp_messages;
DROP POLICY IF EXISTS "Users can insert org wa_messages" ON whatsapp_messages;

-- Política simple: Si estás logueado, puedes ver y enviar mensajes
CREATE POLICY "Enable access to all users" ON whatsapp_messages 
FOR ALL USING (auth.role() = 'authenticated');

-- Asegurar que la tabla de conversaciones también tenga la política correcta (redundancia por seguridad)
ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable access to all users" ON whatsapp_conversations;
CREATE POLICY "Enable access to all users" ON whatsapp_conversations 
FOR ALL USING (auth.role() = 'authenticated');

-- Hacer nullable el organization_id para evitar problemas de inserción
ALTER TABLE whatsapp_conversations ALTER COLUMN organization_id DROP NOT NULL;
