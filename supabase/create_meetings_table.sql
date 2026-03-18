-- =============================================
-- TABLA: meetings
-- Agenda de reuniones para Turbo Brand
-- Ejecutar en: Supabase → SQL Editor
-- =============================================

CREATE TABLE meetings (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT NOT NULL,
  meeting_type TEXT NOT NULL,
  message      TEXT,
  date         DATE NOT NULL,
  time         TIME NOT NULL,
  status       TEXT DEFAULT 'pending',
  scheduled_by TEXT DEFAULT 'client',
  meet_link    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Política: cualquiera puede insertar (formulario público y admin)
CREATE POLICY "Insert meetings"
  ON meetings FOR INSERT
  WITH CHECK (true);

-- Política: lectura para todos (admin lee desde panel)
CREATE POLICY "Read meetings"
  ON meetings FOR SELECT
  USING (true);

-- Política: actualización para todos (cambio de estado desde admin)
CREATE POLICY "Update meetings"
  ON meetings FOR UPDATE
  USING (true);
