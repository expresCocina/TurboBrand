-- Función para incrementar contadores de email_campaigns de forma atómica
CREATE OR REPLACE FUNCTION increment_email_counter(
    p_campaign_id UUID,
    p_field TEXT
)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('
        UPDATE email_campaigns 
        SET %I = COALESCE(%I, 0) + 1 
        WHERE id = $1
    ', p_field, p_field)
    USING p_campaign_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos de ejecución
GRANT EXECUTE ON FUNCTION increment_email_counter TO anon, authenticated;
