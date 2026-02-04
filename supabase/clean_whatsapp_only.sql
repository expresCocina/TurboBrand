-- =============================================
-- LIMPIAR SOLO WHATSAPP Y CONTACTOS
-- =============================================
-- Versión simplificada - Solo limpia lo esencial
-- =============================================

-- 1. Eliminar mensajes de WhatsApp
TRUNCATE TABLE whatsapp_messages CASCADE;

-- 2. Eliminar conversaciones de WhatsApp
TRUNCATE TABLE whatsapp_conversations CASCADE;

-- 3. Eliminar contactos
TRUNCATE TABLE contacts CASCADE;

-- =============================================
-- VERIFICACIÓN
-- =============================================

SELECT COUNT(*) as total_mensajes FROM whatsapp_messages;
SELECT COUNT(*) as total_conversaciones FROM whatsapp_conversations;
SELECT COUNT(*) as total_contactos FROM contacts;

-- =============================================
-- Resultado esperado: Todo en 0
-- =============================================
