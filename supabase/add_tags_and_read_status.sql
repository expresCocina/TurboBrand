-- =============================================
-- AGREGAR TAGS Y ESTADO DE LECTURA
-- =============================================

-- 1. Agregar columna de tags a whatsapp_conversations
ALTER TABLE whatsapp_conversations 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 2. Crear índice para búsqueda rápida por tags
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_tags 
ON whatsapp_conversations USING GIN (tags);

-- 3. Agregar columna read_at a whatsapp_messages para marcar como leído
ALTER TABLE whatsapp_messages 
ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;

-- 4. Crear índice para mensajes no leídos
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_unread 
ON whatsapp_messages (conversation_id, direction, read_at) 
WHERE direction = 'inbound' AND read_at IS NULL;

-- 5. Verificar cambios
SELECT 
    column_name, 
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'whatsapp_conversations' 
AND column_name = 'tags';

SELECT 
    column_name, 
    data_type
FROM information_schema.columns 
WHERE table_name = 'whatsapp_messages' 
AND column_name = 'read_at';

-- =============================================
-- TAGS SUGERIDOS:
-- =============================================
-- 'nuevo'        - Cliente nuevo que acaba de escribir
-- 'interesado'   - Mostró interés en productos/servicios
-- 'cliente'      - Cliente confirmado
-- 'cotizacion'   - Solicitó cotización
-- 'seguimiento'  - Requiere seguimiento
-- 'cerrado'      - Conversación cerrada/completada
-- 'spam'         - Spam o no relevante
-- =============================================
