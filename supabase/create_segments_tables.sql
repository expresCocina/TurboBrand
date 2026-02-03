-- Crear tabla de segmentos de contactos
CREATE TABLE IF NOT EXISTS contact_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    filter_type VARCHAR(50) DEFAULT 'manual', -- 'manual', 'dynamic', 'tag', 'status'
    filter_config JSONB, -- Configuración de filtros dinámicos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de miembros de segmentos (relación muchos a muchos)
CREATE TABLE IF NOT EXISTS contact_segment_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    segment_id UUID NOT NULL REFERENCES contact_segments(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(segment_id, contact_id)
);

-- Agregar columna segment_id a email_campaigns (opcional)
ALTER TABLE email_campaigns 
ADD COLUMN IF NOT EXISTS segment_id UUID REFERENCES contact_segments(id) ON DELETE SET NULL;

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_contact_segments_org ON contact_segments(organization_id);
CREATE INDEX IF NOT EXISTS idx_segment_members_segment ON contact_segment_members(segment_id);
CREATE INDEX IF NOT EXISTS idx_segment_members_contact ON contact_segment_members(contact_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_segment ON email_campaigns(segment_id);

-- Función para contar contactos en un segmento
CREATE OR REPLACE FUNCTION count_segment_contacts(p_segment_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO v_count
    FROM contact_segment_members
    WHERE segment_id = p_segment_id;
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para agregar contactos a un segmento por filtro
CREATE OR REPLACE FUNCTION add_contacts_to_segment_by_filter(
    p_segment_id UUID,
    p_filter_type VARCHAR,
    p_filter_value TEXT
)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER := 0;
    v_contact_id UUID;
BEGIN
    -- Eliminar miembros existentes si es dinámico
    DELETE FROM contact_segment_members WHERE segment_id = p_segment_id;
    
    -- Agregar contactos según el filtro
    IF p_filter_type = 'status' THEN
        INSERT INTO contact_segment_members (segment_id, contact_id)
        SELECT p_segment_id, id
        FROM contacts
        WHERE status = p_filter_value
        ON CONFLICT DO NOTHING;
        
    ELSIF p_filter_type = 'tag' THEN
        INSERT INTO contact_segment_members (segment_id, contact_id)
        SELECT p_segment_id, id
        FROM contacts
        WHERE tags @> ARRAY[p_filter_value]::VARCHAR[]
        ON CONFLICT DO NOTHING;
        
    ELSIF p_filter_type = 'recent' THEN
        INSERT INTO contact_segment_members (segment_id, contact_id)
        SELECT p_segment_id, id
        FROM contacts
        WHERE created_at >= NOW() - INTERVAL '30 days'
        ON CONFLICT DO NOTHING;
    END IF;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permisos
GRANT ALL ON contact_segments TO anon, authenticated;
GRANT ALL ON contact_segment_members TO anon, authenticated;
GRANT EXECUTE ON FUNCTION count_segment_contacts TO anon, authenticated;
GRANT EXECUTE ON FUNCTION add_contacts_to_segment_by_filter TO anon, authenticated;

-- Comentarios
COMMENT ON TABLE contact_segments IS 'Segmentos de contactos para campañas dirigidas';
COMMENT ON TABLE contact_segment_members IS 'Relación muchos a muchos entre segmentos y contactos';
COMMENT ON FUNCTION count_segment_contacts IS 'Cuenta el número de contactos en un segmento';
COMMENT ON FUNCTION add_contacts_to_segment_by_filter IS 'Agrega contactos a un segmento basado en filtros dinámicos';
