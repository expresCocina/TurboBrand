-- =============================================
-- AGREGAR COLUMNAS FALTANTES PARA IMPORTACIÓN
-- =============================================

-- Agregar columnas necesarias para la importación de Excel
-- Usamos IF NOT EXISTS para evitar errores si alguna ya existe

ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS sector text,
ADD COLUMN IF NOT EXISTS position text,
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS company text;

-- =============================================
-- VERIFICACIÓN
-- =============================================
-- Ejecuta esto después para verificar que se crearon

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contacts';
