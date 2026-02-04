-- =============================================
-- HABILITAR REALTIME PARA WHATSAPP
-- =============================================
-- Este script habilita Supabase Realtime para las tablas de WhatsApp
-- para que los mensajes aparezcan automáticamente sin recargar

-- 1. Habilitar Realtime para whatsapp_messages
ALTER PUBLICATION supabase_realtime ADD TABLE whatsapp_messages;

-- 2. Habilitar Realtime para whatsapp_conversations
ALTER PUBLICATION supabase_realtime ADD TABLE whatsapp_conversations;

-- 3. Verificar que las tablas están en la publicación
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND tablename IN ('whatsapp_messages', 'whatsapp_conversations');

-- =============================================
-- INSTRUCCIONES:
-- =============================================
-- 1. Ve a Supabase Dashboard
-- 2. SQL Editor
-- 3. Copia y pega este script
-- 4. Ejecuta (Run)
-- 5. Deberías ver 2 filas en el resultado final
-- =============================================
