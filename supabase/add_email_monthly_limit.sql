-- Agregar columna de límite mensual a organizations
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS email_monthly_limit INTEGER DEFAULT 2000;

-- Función para contar emails enviados en el mes actual para una organización
CREATE OR REPLACE FUNCTION get_monthly_email_count(
    p_organization_id UUID,
    p_month INTEGER DEFAULT EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER,
    p_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COALESCE(SUM(ec.total_sent), 0)
    INTO v_count
    FROM email_campaigns ec
    WHERE ec.organization_id = p_organization_id
      AND EXTRACT(MONTH FROM ec.created_at) = p_month
      AND EXTRACT(YEAR FROM ec.created_at) = p_year
      AND ec.status = 'sent';
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos de ejecución
GRANT EXECUTE ON FUNCTION get_monthly_email_count TO anon, authenticated;

-- Comentarios
COMMENT ON COLUMN organizations.email_monthly_limit IS 'Límite mensual de emails que puede enviar la organización';
COMMENT ON FUNCTION get_monthly_email_count IS 'Cuenta los emails enviados en un mes específico para una organización';
