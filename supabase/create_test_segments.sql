-- ============================================
-- CREAR SEGMENTOS DE PRUEBA (5-10 CONTACTOS)
-- ============================================
-- Estos segmentos son para probar campañas rápidamente
-- sin enviar a todos los contactos de cada segmento

-- 1. Eliminar segmentos de prueba anteriores si existen
DELETE FROM contact_segments 
WHERE name LIKE 'Test %' OR name LIKE 'Prueba %';

-- 2. Crear segmentos de prueba con solo 5 contactos cada uno
-- Segmento Test 1: Primeros 5 contactos del rango 1-80
INSERT INTO contact_segments (name, description, filter_type, filter_config, is_dynamic, organization_id)
SELECT 
    'Test 1 (5 contactos)',
    'Segmento de prueba - Primeros 5 contactos del rango 1-80',
    'auto',
    jsonb_build_object(
        'limit', 5,
        'offset', 0
    ),
    true,
    organization_id
FROM contacts
WHERE source = 'import'
LIMIT 1;

-- Segmento Test 2: Primeros 5 contactos del rango 81-160
INSERT INTO contact_segments (name, description, filter_type, filter_config, is_dynamic, organization_id)
SELECT 
    'Test 2 (5 contactos)',
    'Segmento de prueba - Primeros 5 contactos del rango 81-160',
    'auto',
    jsonb_build_object(
        'limit', 5,
        'offset', 80
    ),
    true,
    organization_id
FROM contacts
WHERE source = 'import'
LIMIT 1;

-- Segmento Test 3: Primeros 10 contactos del rango 161-240
INSERT INTO contact_segments (name, description, filter_type, filter_config, is_dynamic, organization_id)
SELECT 
    'Test 3 (10 contactos)',
    'Segmento de prueba - Primeros 10 contactos del rango 161-240',
    'auto',
    jsonb_build_object(
        'limit', 10,
        'offset', 160
    ),
    true,
    organization_id
FROM contacts
WHERE source = 'import'
LIMIT 1;

-- 3. Verificar los segmentos creados
SELECT 
    id,
    name,
    description,
    is_dynamic,
    created_at
FROM contact_segments
WHERE name LIKE 'Test %'
ORDER BY name;

-- ============================================
-- INSTRUCCIONES DE USO:
-- ============================================
-- 1. Ejecuta este script en Supabase SQL Editor
-- 2. Ve a Email Marketing → Nueva Campaña
-- 3. Selecciona los segmentos "Test 1", "Test 2", "Test 3"
-- 4. Envía la campaña
-- 5. Solo se enviarán 20 emails en total (5+5+10)
-- 6. Tomará aproximadamente 15 segundos
-- ============================================
