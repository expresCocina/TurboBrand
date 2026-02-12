-- ============================================
-- SCRIPT PARA ELIMINAR TODAS LAS TABLAS DEL CRM
-- ============================================
-- ⚠️ ADVERTENCIA: Este script eliminará PERMANENTEMENTE todos los datos del CRM
-- ⚠️ Asegúrate de hacer backup antes de ejecutar
-- ⚠️ Este proceso NO se puede revertir
-- ============================================

-- 1. TABLAS DE EMAIL MARKETING
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS email_campaigns CASCADE;
DROP TABLE IF EXISTS email_templates CASCADE;

-- 2. TABLAS DE CONTACTOS Y SEGMENTOS
DROP TABLE IF EXISTS contact_segment_members CASCADE;
DROP TABLE IF EXISTS contact_segments CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS leads CASCADE;

-- 3. TABLAS DE WHATSAPP
DROP TABLE IF EXISTS whatsapp_messages CASCADE;
DROP TABLE IF EXISTS whatsapp_sessions CASCADE;

-- 4. TABLAS DE VENTAS
DROP TABLE IF EXISTS sales_opportunities CASCADE;
DROP TABLE IF EXISTS sales_stages CASCADE;

-- 5. TABLAS DE TAREAS Y AUTOMATIZACIONES
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS automations CASCADE;

-- 6. TABLAS DE ORGANIZACIONES Y USUARIOS CRM
DROP TABLE IF EXISTS crm_users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- 7. FUNCIONES RPC DEL CRM
DROP FUNCTION IF EXISTS get_monthly_email_count(uuid, integer, integer) CASCADE;
DROP FUNCTION IF EXISTS increment_email_count(uuid) CASCADE;
DROP FUNCTION IF EXISTS create_web_lead(text, text, text, text, text) CASCADE;

-- ============================================
-- VERIFICACIÓN: Listar tablas restantes
-- ============================================
-- Ejecuta esto después para verificar que solo quedan las tablas necesarias
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- Deberían quedar solo:
-- - zones (sistema de zonas de Medellín)
-- - Tablas de autenticación (auth.*)
-- - Cualquier otra tabla del sitio web
-- ============================================
