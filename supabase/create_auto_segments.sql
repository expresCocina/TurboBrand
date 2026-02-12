-- Script para crear segmentos automáticos de 80 contactos cada uno
-- Esto facilita el envío de campañas grandes en lotes más pequeños

-- 1. Primero, verificar cuántos contactos hay
SELECT COUNT(*) as total_contactos FROM contacts WHERE email IS NOT NULL;

-- 2. Crear segmentos automáticos
-- Nota: Necesitarás ejecutar esto manualmente para cada segmento

-- Segmento 1 (contactos 1-80)
INSERT INTO contact_segments (name, organization_id, created_at)
VALUES ('Segmento 1 (1-80)', '5e5b7400-1a66-42dc-880e-e501021edadc', NOW())
RETURNING id;

-- Usa el ID retornado arriba para insertar los miembros
-- Reemplaza 'SEGMENT_ID_AQUI' con el ID real
WITH numbered_contacts AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
    FROM contacts
    WHERE email IS NOT NULL
)
INSERT INTO contact_segment_members (segment_id, contact_id)
SELECT 'SEGMENT_ID_AQUI', id
FROM numbered_contacts
WHERE rn BETWEEN 1 AND 80;

-- Segmento 2 (contactos 81-160)
INSERT INTO contact_segments (name, organization_id, created_at)
VALUES ('Segmento 2 (81-160)', '5e5b7400-1a66-42dc-880e-e501021edadc', NOW())
RETURNING id;

WITH numbered_contacts AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
    FROM contacts
    WHERE email IS NOT NULL
)
INSERT INTO contact_segment_members (segment_id, contact_id)
SELECT 'SEGMENT_ID_AQUI', id
FROM numbered_contacts
WHERE rn BETWEEN 81 AND 160;

-- Continúa este patrón para todos los segmentos necesarios...

-- ALTERNATIVA MÁS FÁCIL: Script automático completo
-- Este script crea todos los segmentos automáticamente

DO $$
DECLARE
    total_contacts INTEGER;
    segment_size INTEGER := 80;
    num_segments INTEGER;
    current_segment INTEGER := 1;
    segment_id UUID;
    org_id UUID := '5e5b7400-1a66-42dc-880e-e501021edadc';
BEGIN
    -- Contar contactos
    SELECT COUNT(*) INTO total_contacts FROM contacts WHERE email IS NOT NULL;
    
    -- Calcular número de segmentos necesarios
    num_segments := CEIL(total_contacts::NUMERIC / segment_size);
    
    RAISE NOTICE 'Total contactos: %, Segmentos a crear: %', total_contacts, num_segments;
    
    -- Crear cada segmento
    FOR i IN 1..num_segments LOOP
        -- Crear segmento
        INSERT INTO contact_segments (name, organization_id, created_at)
        VALUES (
            'Segmento Auto ' || i || ' (' || ((i-1)*segment_size + 1) || '-' || LEAST(i*segment_size, total_contacts) || ')',
            org_id,
            NOW()
        )
        RETURNING id INTO segment_id;
        
        RAISE NOTICE 'Creado segmento: % con ID: %', i, segment_id;
        
        -- Agregar contactos al segmento
        WITH numbered_contacts AS (
            SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
            FROM contacts
            WHERE email IS NOT NULL
        )
        INSERT INTO contact_segment_members (segment_id, contact_id)
        SELECT segment_id, id
        FROM numbered_contacts
        WHERE rn BETWEEN ((i-1)*segment_size + 1) AND (i*segment_size);
        
        RAISE NOTICE 'Agregados contactos al segmento %', i;
    END LOOP;
    
    RAISE NOTICE 'Proceso completado. % segmentos creados.', num_segments;
END $$;

-- Verificar los segmentos creados
SELECT 
    cs.name,
    COUNT(csm.contact_id) as num_contactos
FROM contact_segments cs
LEFT JOIN contact_segment_members csm ON cs.id = csm.segment_id
WHERE cs.name LIKE 'Segmento Auto%'
GROUP BY cs.id, cs.name
ORDER BY cs.name;
