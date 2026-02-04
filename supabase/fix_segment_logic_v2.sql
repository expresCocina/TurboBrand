-- =============================================
-- FIX V2: LÓGICA DE SEGMENTOS DINÁMICOS ROBUSTA
-- =============================================

-- 1. Actualizar la función con soporte para ID legado
CREATE OR REPLACE FUNCTION add_contacts_to_segment_by_filter(
    p_segment_id UUID,
    p_filter_type VARCHAR,
    p_filter_value TEXT
)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER := 0;
    v_org_id UUID;
BEGIN
    -- Obtener organization_id del segmento
    SELECT organization_id INTO v_org_id FROM contact_segments WHERE id = p_segment_id;

    -- Eliminar miembros existentes
    DELETE FROM contact_segment_members WHERE segment_id = p_segment_id;
    
    -- LÓGICA PRINCIPAL
    IF p_filter_type = 'dynamic' OR p_filter_type = 'all' THEN
        INSERT INTO contact_segment_members (segment_id, contact_id)
        SELECT p_segment_id, id
        FROM contacts
        WHERE 
            -- Coincide con la org del segmento O es la org por defecto (legado)
            (organization_id = v_org_id OR organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc')
        ON CONFLICT DO NOTHING;
        
    ELSIF p_filter_type = 'status' THEN
        INSERT INTO contact_segment_members (segment_id, contact_id)
        SELECT p_segment_id, id
        FROM contacts
        WHERE status = p_filter_value 
        AND (organization_id = v_org_id OR organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc')
        ON CONFLICT DO NOTHING;
        
    ELSIF p_filter_type = 'tag' THEN
        INSERT INTO contact_segment_members (segment_id, contact_id)
        SELECT p_segment_id, id
        FROM contacts
        WHERE tags @> ARRAY[p_filter_value]::VARCHAR[] 
        AND (organization_id = v_org_id OR organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc')
        ON CONFLICT DO NOTHING;
    END IF;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. REPARACIÓN AUTOMÁTICA DE SEGMENTOS EXISTENTES
-- Recalcula los miembros para todos los segmentos dinámicos actuales
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT id, filter_type, filter_config FROM contact_segments WHERE filter_type IN ('dynamic', 'all') LOOP
        PERFORM add_contacts_to_segment_by_filter(r.id, r.filter_type, NULL);
    END LOOP;
END $$;
