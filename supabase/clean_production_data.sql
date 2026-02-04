-- =============================================
-- LIMPIAR CRM PARA PRODUCCIÓN
-- =============================================
-- Este script elimina todos los datos de prueba
-- ADVERTENCIA: Esta acción NO se puede deshacer
-- =============================================

-- Usar TRUNCATE CASCADE para eliminar todo y resetear secuencias
-- CASCADE elimina automáticamente las referencias de foreign keys

-- 1. Eliminar todos los mensajes de WhatsApp
TRUNCATE TABLE whatsapp_messages CASCADE;

-- 2. Eliminar todas las conversaciones de WhatsApp
TRUNCATE TABLE whatsapp_conversations CASCADE;

-- 3. Eliminar todas las tareas
TRUNCATE TABLE tasks CASCADE;

-- 4. Eliminar todas las actividades
TRUNCATE TABLE activities CASCADE;

-- 5. Eliminar todos los leads del pipeline
TRUNCATE TABLE pipeline_leads CASCADE;

-- 6. Eliminar todas las campañas de email
TRUNCATE TABLE email_campaigns CASCADE;

-- 7. Eliminar todos los contactos
TRUNCATE TABLE contacts CASCADE;

-- 8. Eliminar todas las automatizaciones (OPCIONAL - descomentar si quieres eliminarlas)
-- TRUNCATE TABLE automations CASCADE;

-- =============================================
-- VERIFICACIÓN
-- =============================================
-- Ejecuta estos queries para verificar que todo está limpio:

SELECT COUNT(*) as total_mensajes FROM whatsapp_messages;
SELECT COUNT(*) as total_conversaciones FROM whatsapp_conversations;
SELECT COUNT(*) as total_contactos FROM contacts;
SELECT COUNT(*) as total_actividades FROM activities;
SELECT COUNT(*) as total_tareas FROM tasks;
SELECT COUNT(*) as total_campanas FROM email_campaigns;
SELECT COUNT(*) as total_leads FROM pipeline_leads;

-- =============================================
-- NOTAS IMPORTANTES
-- =============================================
-- 1. TRUNCATE CASCADE:
--    - Elimina TODOS los datos de la tabla
--    - Resetea los contadores de ID (AUTO_INCREMENT)
--    - Maneja automáticamente las foreign keys
--    - Más rápido que DELETE
--
-- 2. Este script NO elimina:
--    - Usuarios (users table)
--    - Configuraciones del sistema
--    - Automatizaciones (comentado por defecto)
--
-- 3. Después de limpiar:
--    - El bot seguirá funcionando
--    - Los tags seguirán disponibles
--    - Las Edge Functions seguirán activas
--    - Los IDs empezarán desde 1
--
-- 4. Primer mensaje real:
--    - Cuando llegue el primer cliente real
--    - El bot enviará el menú automáticamente
--    - Todo funcionará como en pruebas
-- =============================================
