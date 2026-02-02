-- Agregar columnas de tracking a email_campaigns
ALTER TABLE email_campaigns 
ADD COLUMN IF NOT EXISTS total_sent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_delivered INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_opened INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_clicked INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_bounced INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_complained INTEGER DEFAULT 0;

-- Agregar índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_email_sends_campaign_id ON email_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_resend_id ON email_sends(resend_id);

-- Comentarios para documentación
COMMENT ON COLUMN email_campaigns.total_sent IS 'Total de emails enviados en esta campaña';
COMMENT ON COLUMN email_campaigns.total_delivered IS 'Total de emails entregados exitosamente';
COMMENT ON COLUMN email_campaigns.total_opened IS 'Total de emails abiertos (puede ser mayor que sent si se abre varias veces)';
COMMENT ON COLUMN email_campaigns.total_clicked IS 'Total de clicks en enlaces del email';
COMMENT ON COLUMN email_campaigns.total_bounced IS 'Total de emails rebotados';
COMMENT ON COLUMN email_campaigns.total_complained IS 'Total de reportes de spam';
