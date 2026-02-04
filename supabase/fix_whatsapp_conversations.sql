-- =============================================
-- FIX: Agregar columnas faltantes a whatsapp_conversations
-- =============================================

-- Agregar columna metadata si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'whatsapp_conversations' 
        AND column_name = 'metadata'
    ) THEN
        ALTER TABLE whatsapp_conversations 
        ADD COLUMN metadata JSONB DEFAULT '{}';
        
        RAISE NOTICE 'Columna metadata agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna metadata ya existe';
    END IF;
END $$;

-- Agregar columna last_message_at si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'whatsapp_conversations' 
        AND column_name = 'last_message_at'
    ) THEN
        ALTER TABLE whatsapp_conversations 
        ADD COLUMN last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        
        RAISE NOTICE 'Columna last_message_at agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna last_message_at ya existe';
    END IF;
END $$;

-- Verificar columnas de whatsapp_conversations
SELECT 
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns
WHERE table_name = 'whatsapp_conversations'
ORDER BY ordinal_position;
