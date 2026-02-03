-- =====================================================
-- Script: Agregar Programación de Envíos a Campañas
-- =====================================================
-- Este script agrega la funcionalidad de programar campañas
-- para que se envíen automáticamente en una fecha/hora específica

-- 1. Agregar columna para fecha/hora programada
ALTER TABLE email_campaigns 
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;

-- 2. Crear índice para búsquedas eficientes de campañas programadas
-- Solo indexa las campañas con status='scheduled' para optimizar
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled 
ON email_campaigns(scheduled_at) 
WHERE status = 'scheduled';

-- 3. Comentarios para documentación
COMMENT ON COLUMN email_campaigns.scheduled_at IS 'Fecha y hora programada para envío automático. NULL = envío inmediato';

-- 4. Verificar que la columna se creó correctamente
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'email_campaigns' 
        AND column_name = 'scheduled_at'
    ) THEN
        RAISE NOTICE '✅ Columna scheduled_at creada exitosamente';
    ELSE
        RAISE EXCEPTION '❌ Error: No se pudo crear la columna scheduled_at';
    END IF;
END $$;

-- 5. Mostrar estructura actualizada de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'email_campaigns'
ORDER BY ordinal_position;
