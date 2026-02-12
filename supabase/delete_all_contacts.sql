-- ⚠️ ADVERTENCIA: Este script eliminará TODOS los contactos
-- Esto incluye contactos de WhatsApp, Web, Manuales e Importados

-- 1. Ver cuántos contactos hay en total
SELECT COUNT(*) as total_contactos FROM contacts;

-- 2. Ver distribución por fuente
SELECT 
    source,
    COUNT(*) as cantidad
FROM contacts
GROUP BY source
ORDER BY source;

-- 3. ELIMINAR TODOS LOS CONTACTOS
-- ⚠️ ESTO ES IRREVERSIBLE - Descomenta solo cuando estés 100% seguro:

DELETE FROM contacts;

-- 4. Verificar que la tabla quedó vacía
SELECT COUNT(*) as contactos_restantes FROM contacts;

-- 5. Reiniciar los segmentos automáticos también (opcional)
-- Si quieres limpiar los segmentos de email marketing también:

-- DELETE FROM contact_segment_members;
-- DELETE FROM contact_segments WHERE name LIKE 'Segmento Auto%';
