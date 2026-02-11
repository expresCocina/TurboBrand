-- ============================================
-- Sistema de Email Completo con Bandeja de Entrada
-- Crear tablas para threads, mensajes y tracking
-- ============================================

-- Tabla: email_threads (Conversaciones)
-- Agrupa emails por conversación/contacto
CREATE TABLE IF NOT EXISTS email_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    last_message_at TIMESTAMP DEFAULT NOW(),
    total_messages INTEGER DEFAULT 0,
    unread_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: email_messages (Emails individuales)
-- Almacena cada email enviado o recibido
CREATE TABLE IF NOT EXISTS email_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES email_threads(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Dirección del email
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    
    -- Remitente y destinatario
    from_email TEXT NOT NULL,
    from_name TEXT,
    to_email TEXT NOT NULL,
    to_name TEXT,
    
    -- Contenido
    subject TEXT NOT NULL,
    html_content TEXT,
    text_content TEXT,
    
    -- Metadata para threading
    message_id TEXT UNIQUE, -- ID único del email (RFC 2822)
    in_reply_to TEXT, -- ID del mensaje al que responde
    
    -- Tracking (solo para outbound)
    opened_at TIMESTAMP,
    first_click_at TIMESTAMP,
    total_opens INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    
    -- Estado
    is_read BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: email_tracking_events (Eventos de tracking)
-- Registra cada apertura y click
CREATE TABLE IF NOT EXISTS email_tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES email_messages(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('open', 'click')),
    link_url TEXT, -- URL del link (solo para clicks)
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Índices para mejorar performance
-- ============================================

-- Índices en email_threads
CREATE INDEX IF NOT EXISTS idx_email_threads_org ON email_threads(organization_id);
CREATE INDEX IF NOT EXISTS idx_email_threads_contact ON email_threads(contact_id);
CREATE INDEX IF NOT EXISTS idx_email_threads_last_message ON email_threads(last_message_at DESC);

-- Índices en email_messages
CREATE INDEX IF NOT EXISTS idx_email_messages_thread ON email_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_email_messages_org ON email_messages(organization_id);
CREATE INDEX IF NOT EXISTS idx_email_messages_direction ON email_messages(direction);
CREATE INDEX IF NOT EXISTS idx_email_messages_created ON email_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_messages_message_id ON email_messages(message_id);
CREATE INDEX IF NOT EXISTS idx_email_messages_unread ON email_messages(is_read) WHERE is_read = FALSE;

-- Índices en email_tracking_events
CREATE INDEX IF NOT EXISTS idx_email_tracking_message ON email_tracking_events(message_id);
CREATE INDEX IF NOT EXISTS idx_email_tracking_type ON email_tracking_events(event_type);

-- ============================================
-- RLS Policies
-- ============================================

-- Habilitar RLS
ALTER TABLE email_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_tracking_events ENABLE ROW LEVEL SECURITY;

-- Policies para email_threads
CREATE POLICY "Users can view threads from their organization"
    ON email_threads FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM crm_users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert threads in their organization"
    ON email_threads FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM crm_users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update threads in their organization"
    ON email_threads FOR UPDATE
    USING (
        organization_id IN (
            SELECT organization_id FROM crm_users WHERE id = auth.uid()
        )
    );

-- Policies para email_messages
CREATE POLICY "Users can view messages from their organization"
    ON email_messages FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM crm_users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages in their organization"
    ON email_messages FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM crm_users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update messages in their organization"
    ON email_messages FOR UPDATE
    USING (
        organization_id IN (
            SELECT organization_id FROM crm_users WHERE id = auth.uid()
        )
    );

-- Policies para email_tracking_events
CREATE POLICY "Users can view tracking events from their organization"
    ON email_tracking_events FOR SELECT
    USING (
        message_id IN (
            SELECT id FROM email_messages WHERE organization_id IN (
                SELECT organization_id FROM crm_users WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Anyone can insert tracking events"
    ON email_tracking_events FOR INSERT
    WITH CHECK (true); -- Permitir inserts públicos para tracking

-- ============================================
-- Funciones útiles
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_email_thread_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_email_thread_timestamp
    BEFORE UPDATE ON email_threads
    FOR EACH ROW
    EXECUTE FUNCTION update_email_thread_timestamp();

-- ============================================
-- Verificación
-- ============================================

-- Verificar que las tablas se crearon correctamente
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('email_threads', 'email_messages', 'email_tracking_events')
ORDER BY table_name;

-- Verificar índices
SELECT 
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('email_threads', 'email_messages', 'email_tracking_events')
ORDER BY tablename, indexname;
