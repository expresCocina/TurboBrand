-- Script para limpiar Email Marketing y dejarlo como nuevo
-- Esto eliminará campañas, pero MANTIENE las plantillas

-- 1. Eliminar todos los envíos de emails
DELETE FROM email_sends;

-- 2. Eliminar todas las campañas
DELETE FROM email_campaigns;

-- 3. Eliminar tablas de inbox (si aún existen)
DROP TABLE IF EXISTS email_tracking_events CASCADE;
DROP TABLE IF EXISTS email_messages CASCADE;
DROP TABLE IF EXISTS email_threads CASCADE;

-- Verificar que quedó limpio
SELECT 'Campañas restantes:' as info, COUNT(*) as count FROM email_campaigns
UNION ALL
SELECT 'Envíos restantes:', COUNT(*) FROM email_sends
UNION ALL
SELECT 'Plantillas disponibles:', COUNT(*) FROM email_templates;
