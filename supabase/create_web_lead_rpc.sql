-- Función segura para crear leads desde la web (Bypassing RLS via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION create_web_lead(
    p_name TEXT,
    p_email TEXT,
    p_phone TEXT,
    p_company TEXT,
    p_sector TEXT,
    p_org_id UUID DEFAULT '83cecdd0-df87-4b35-91c2-09da5c1b3430' -- ID Real de Turbo Brand -- Default Turbo Brand ID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Se ejecuta con permisos del creador (admin), ignorando RLS del usuario anon
SET search_path = public
AS $$
DECLARE
    v_contact_id UUID;
    v_opportunity_id UUID;
    v_existing_contact RECORD;
BEGIN
    -- 1. Buscar si existe el contacto
    SELECT * INTO v_existing_contact FROM contacts WHERE email = p_email AND organization_id = p_org_id;

    IF v_existing_contact.id IS NOT NULL THEN
        -- Actualizar existente
        UPDATE contacts 
        SET 
            name = p_name,
            phone = COALESCE(p_phone, phone),
            company = COALESCE(p_company, company),
            sector = COALESCE(p_sector, sector),
            updated_at = NOW()
        WHERE id = v_existing_contact.id
        RETURNING id INTO v_contact_id;
    ELSE
        -- Insertar nuevo
        INSERT INTO contacts (name, email, phone, company, sector, organization_id, source)
        VALUES (p_name, p_email, p_phone, p_company, p_sector, p_org_id, 'website')
        RETURNING id INTO v_contact_id;
    END IF;

    -- 2. Crear Oportunidad "Nuevo Lead"
    INSERT INTO opportunities (
        title,
        contact_id,
        stage,
        currency,
        value,
        probability,
        organization_id,
        created_at
    )
    VALUES (
        'Nuevo Lead Web: ' || p_company,
        v_contact_id,
        'lead', -- Etapa Nuevos Leads
        'COP',
        0,
        10,
        p_org_id,
        NOW()
    )
    RETURNING id INTO v_opportunity_id;

    -- 3. Crear Tarea Automática (Simulando "new_lead" automation)
    INSERT INTO tasks (
        title,
        description,
        status,
        priority,
        due_date,
        related_to_type,
        related_to_id,
        organization_id,
        created_at
    )
    VALUES (
        'Tarea Automática: Nuevo Lead Web',
        'Contactar a: ' || p_name || ' (' || p_company || ') - ' || p_phone,
        'pending',
        'medium',
        (NOW() + INTERVAL '1 day'), -- Mañana
        'opportunity',
        v_opportunity_id,
        p_org_id,
        NOW()
    );

    -- 4. Retornar IDs
    RETURN jsonb_build_object(
        'contact_id', v_contact_id,
        'opportunity_id', v_opportunity_id,
        'is_new_contact', (v_existing_contact.id IS NULL)
    );
END;
$$;

-- Permitir que anon (público) ejecute esta función
GRANT EXECUTE ON FUNCTION create_web_lead TO anon;
GRANT EXECUTE ON FUNCTION create_web_lead TO authenticated;
GRANT EXECUTE ON FUNCTION create_web_lead TO service_role;
