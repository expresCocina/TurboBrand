-- Script para eliminar SOLO los contactos importados desde CSV
-- Esto NO eliminará contactos de WhatsApp, Web o Manuales

-- 1. Ver cuántos contactos se van a eliminar
SELECT 
    source,
    COUNT(*) as cantidad
FROM contacts
GROUP BY source
ORDER BY source;

-- 2. Ver algunos ejemplos de contactos importados (para confirmar)
SELECT id, name, email, company, source, created_at
FROM contacts
WHERE source = 'import'
LIMIT 10;

-- 3. ELIMINAR todos los contactos importados
-- ⚠️ IMPORTANTE: Esto eliminará PERMANENTEMENTE todos los contactos con source='import'
-- Descomenta la siguiente línea solo cuando estés seguro:

-- DELETE FROM contacts WHERE source = 'import';

-- 4. Verificar que se eliminaron
SELECT 
    source,
    COUNT(*) as cantidad
FROM contacts
GROUP BY source
ORDER BY source;
