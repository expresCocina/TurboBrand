-- Script para listar todas las tablas actuales en Supabase
-- Ejecutar en Supabase SQL Editor para identificar qué tablas mantener

SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Resultado esperado: lista de todas las tablas
-- Marcar cuáles son de mapas/zonas para NO migrar al CRM
