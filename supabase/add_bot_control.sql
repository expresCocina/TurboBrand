-- =============================================
-- AGREGAR COLUMNA bot_active PARA CONTROL DE BOT
-- =============================================

-- Agregar columna para controlar si el bot está activo
ALTER TABLE whatsapp_conversations 
ADD COLUMN IF NOT EXISTS bot_active BOOLEAN DEFAULT true;

-- Agregar columna para rastrear si ya se envió el menú de bienvenida
ALTER TABLE whatsapp_conversations 
ADD COLUMN IF NOT EXISTS welcome_sent BOOLEAN DEFAULT false;

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_bot_active 
ON whatsapp_conversations (bot_active);

-- Verificar cambios
SELECT 
    column_name, 
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'whatsapp_conversations' 
AND column_name IN ('bot_active', 'welcome_sent');
