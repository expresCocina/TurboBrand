-- =============================================
-- FIX: Agregar columna 'status' a tabla contacts
-- =============================================
-- Este script agrega la columna 'status' que falta en la tabla contacts

-- Agregar columna status si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'contacts' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE contacts 
        ADD COLUMN status VARCHAR(50) DEFAULT 'new';
        
        RAISE NOTICE 'Columna status agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna status ya existe';
    END IF;
END $$;

-- Actualizar contactos existentes sin status
UPDATE contacts 
SET status = 'new' 
WHERE status IS NULL;

-- Verificar
SELECT 
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns
WHERE table_name = 'contacts' 
AND column_name = 'status';
