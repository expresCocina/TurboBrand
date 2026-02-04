-- =============================================
-- CORREGIR LÓGICA DE SEGMENTOS DINÁMICOS
-- =============================================

-- Actualizar la función para soportar 'dynamic' (todos los contactos)
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
    -- Obtener organization_id del segmento para filtrar contactos de la misma organización
    SELECT organization_id INTO v_org_id FROM contact_segments WHERE id = p_segment_id;

    -- Eliminar miembros existentes si es dinámico (para refrescar)
    DELETE FROM contact_segment_members WHERE segment_id = p_segment_id;
    
    -- Agregar contactos según el filtro
    IF p_filter_type = 'status' THEN
        INSERT INTO contact_segment_members (segment_id, contact_id)
        SELECT p_segment_id, id
        FROM contacts
        WHERE status = p_filter_value AND organization_id = v_org_id
        ON CONFLICT DO NOTHING;
        
    ELSIF p_filter_type = 'tag' THEN
        INSERT INTO contact_segment_members (segment_id, contact_id)
        SELECT p_segment_id, id
        FROM contacts
        WHERE tags @> ARRAY[p_filter_value]::VARCHAR[] AND organization_id = v_org_id
        ON CONFLICT DO NOTHING;
        
    ELSIF p_filter_type = 'recent' THEN
        INSERT INTO contact_segment_members (segment_id, contact_id)
        SELECT p_segment_id, id
        FROM contacts
        WHERE created_at >= NOW() - INTERVAL '30 days' AND organization_id = v_org_id
        ON CONFLICT DO NOTHING;

    -- NUEVA LÓGICA: Si es 'dynamic' y no hay valor específico, o es 'all', seleccionar TODOS
    ELSIF p_filter_type = 'dynamic' OR p_filter_type = 'all' THEN
        INSERT INTO contact_segment_members (segment_id, contact_id)
        SELECT p_segment_id, id
        FROM contacts
        WHERE organization_id = v_org_id
        ON CONFLICT DO NOTHING;
    END IF;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
