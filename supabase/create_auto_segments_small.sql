-- ============================================
-- CREAR SEGMENTOS AUTO CON 10 CONTACTOS C/U
-- ============================================
-- Este script crea segmentos más pequeños (10 contactos)
-- para hacer pruebas rápidas de campañas

DO $$
DECLARE
    total_contacts INTEGER;
    segment_size INTEGER := 10; -- CAMBIADO DE 80 A 10
    num_segments INTEGER;
    current_segment INTEGER := 1;
    segment_id UUID;
    -- ID de organización por defecto de Turbo Brand
    org_id UUID := '5e5b7400-1a66-42dc-880e-e501021edadc';
BEGIN
    -- 0. ELIMINAR SEGMENTOS ANTERIORES
    RAISE NOTICE 'Eliminando segmentos automáticos anteriores...';
    DELETE FROM contact_segments WHERE name LIKE 'Segmento Auto%';

    -- 1. Contar contactos válidos (con email)
    SELECT COUNT(*) INTO total_contacts FROM contacts WHERE email IS NOT NULL;
    
    -- 2. Calcular número de segmentos necesarios
    num_segments := CEIL(total_contacts::NUMERIC / segment_size);
    
    RAISE NOTICE 'Total contactos: %, Segmentos a crear: % (10 contactos c/u)', total_contacts, num_segments;
    
    -- 3. Crear cada segmento
    FOR i IN 1..num_segments LOOP
        -- Crear el segmento en la base de datos
        INSERT INTO contact_segments (name, organization_id, created_at, filter_type)
        VALUES (
            'Segmento Auto ' || i || ' (' || ((i-1)*segment_size + 1) || '-' || LEAST(i*segment_size, total_contacts) || ')',
            org_id,
            NOW(),
            'manual'
        )
        RETURNING id INTO segment_id;
        
        RAISE NOTICE 'Creado segmento: % con ID: %', i, segment_id;
        
        -- 4. Agregar contactos al segmento
        WITH numbered_contacts AS (
            SELECT id, email, ROW_NUMBER() OVER (ORDER BY created_at DESC) as rn
            FROM contacts
            WHERE email IS NOT NULL
        )
        INSERT INTO contact_segment_members (segment_id, contact_id)
        SELECT segment_id, id
        FROM numbered_contacts
        WHERE rn BETWEEN ((i-1)*segment_size + 1) AND (i*segment_size);
        
        RAISE NOTICE 'Agregados contactos al segmento %', i;
    END LOOP;
    
    RAISE NOTICE 'Proceso completado exitosamente. % segmentos creados con 10 contactos c/u.', num_segments;
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
