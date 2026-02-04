-- =============================================
-- FIX COMPLETO: Arreglar esquema de tablas WhatsApp
-- =============================================

-- 1. Arreglar whatsapp_conversations
-- =============================================

-- Agregar columna metadata
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'whatsapp_conversations' AND column_name = 'metadata'
    ) THEN
        ALTER TABLE whatsapp_conversations ADD COLUMN metadata JSONB DEFAULT '{}';
        RAISE NOTICE '✅ Columna metadata agregada a whatsapp_conversations';
    END IF;
END $$;

-- Renombrar phone a phone_number si existe
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'whatsapp_conversations' AND column_name = 'phone'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'whatsapp_conversations' AND column_name = 'phone_number'
    ) THEN
        ALTER TABLE whatsapp_conversations RENAME COLUMN phone TO phone_number;
        RAISE NOTICE '✅ Columna phone renombrada a phone_number';
    END IF;
END $$;

-- 2. Arreglar whatsapp_messages
-- =============================================

-- Agregar message_id
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'whatsapp_messages' AND column_name = 'message_id'
    ) THEN
        ALTER TABLE whatsapp_messages ADD COLUMN message_id VARCHAR(255);
        RAISE NOTICE '✅ Columna message_id agregada';
    END IF;
END $$;

-- Agregar from_number
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'whatsapp_messages' AND column_name = 'from_number'
    ) THEN
        ALTER TABLE whatsapp_messages ADD COLUMN from_number VARCHAR(50);
        RAISE NOTICE '✅ Columna from_number agregada';
    END IF;
END $$;

-- Agregar to_number
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'whatsapp_messages' AND column_name = 'to_number'
    ) THEN
        ALTER TABLE whatsapp_messages ADD COLUMN to_number VARCHAR(50);
        RAISE NOTICE '✅ Columna to_number agregada';
    END IF;
END $$;

-- Agregar message_type
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'whatsapp_messages' AND column_name = 'message_type'
    ) THEN
        ALTER TABLE whatsapp_messages ADD COLUMN message_type VARCHAR(50) DEFAULT 'text';
        RAISE NOTICE '✅ Columna message_type agregada';
    END IF;
END $$;

-- Agregar raw_data
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'whatsapp_messages' AND column_name = 'raw_data'
    ) THEN
        ALTER TABLE whatsapp_messages ADD COLUMN raw_data JSONB DEFAULT '{}';
        RAISE NOTICE '✅ Columna raw_data agregada';
    END IF;
END $$;

-- Agregar updated_at
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'whatsapp_messages' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE whatsapp_messages ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE '✅ Columna updated_at agregada';
    END IF;
END $$;

-- Renombrar 'content' a 'content' si se llama diferente
-- (verificar que exista la columna content)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'whatsapp_messages' AND column_name = 'content'
    ) THEN
        RAISE NOTICE '⚠️ ADVERTENCIA: No existe columna content en whatsapp_messages';
    END IF;
END $$;

-- 3. Verificación final
-- =============================================
SELECT '=== WHATSAPP_CONVERSATIONS ===' as tabla;
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'whatsapp_conversations'
ORDER BY ordinal_position;

SELECT '=== WHATSAPP_MESSAGES ===' as tabla;
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'whatsapp_messages'
ORDER BY ordinal_position;
