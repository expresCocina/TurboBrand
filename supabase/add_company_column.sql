-- Script para verificar y agregar columna 'company' a la tabla contacts
-- Ejecuta esto en Supabase SQL Editor

-- 1. Verificar si la columna existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contacts' 
ORDER BY ordinal_position;

-- 2. Si la columna 'company' NO aparece en la lista anterior, agrégala:
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS company TEXT;

-- 3. Verificar que se agregó correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contacts' 
  AND column_name = 'company';

-- 4. Ver algunos contactos para verificar los datos
SELECT id, name, email, company, position, sector
FROM contacts
LIMIT 10;
