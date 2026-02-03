-- =============================================
-- SEGMENTOS DE CONTACTOS (Faltantes en script original)
-- =============================================
CREATE TABLE IF NOT EXISTS contact_segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'manual', -- manual, dynamic
  filter_config JSONB DEFAULT '{}', -- Para segmentos dinámicos
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_segment_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  segment_id UUID REFERENCES contact_segments(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(segment_id, contact_id)
);

-- RLS
ALTER TABLE contact_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_segment_members ENABLE ROW LEVEL SECURITY;

-- Policies (Simplificadas para desarrollo, ajustar luego)
CREATE POLICY "Users can view segments of their org" ON contact_segments
  FOR SELECT USING (organization_id = (SELECT organization_id FROM crm_users WHERE id = auth.uid()));

CREATE POLICY "Users can insert segments of their org" ON contact_segments
  FOR INSERT WITH CHECK (organization_id = (SELECT organization_id FROM crm_users WHERE id = auth.uid()));

CREATE POLICY "Users can delete segments of their org" ON contact_segments
  FOR DELETE USING (organization_id = (SELECT organization_id FROM crm_users WHERE id = auth.uid()));

-- Members policies
CREATE POLICY "Users can view segment members" ON contact_segment_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM contact_segments WHERE id = contact_segment_members.segment_id AND organization_id = (SELECT organization_id FROM crm_users WHERE id = auth.uid()))
  );

CREATE POLICY "Users can insert segment members" ON contact_segment_members
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM contact_segments WHERE id = contact_segment_members.segment_id AND organization_id = (SELECT organization_id FROM crm_users WHERE id = auth.uid()))
  );

CREATE POLICY "Users can delete segment members" ON contact_segment_members
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM contact_segments WHERE id = contact_segment_members.segment_id AND organization_id = (SELECT organization_id FROM crm_users WHERE id = auth.uid()))
  );
