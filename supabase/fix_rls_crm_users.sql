-- Permitir a los usuarios leer su propio perfil de crm_users
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'crm_users' AND policyname = 'Users can view own crm profile'
  ) THEN
    CREATE POLICY "Users can view own crm profile" ON crm_users
      FOR SELECT USING (auth.uid() = id);
  END IF;
END $$;

-- Permitir a usuarios leer datos de su organización en contacts (verificar si existe)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'contacts' AND policyname = 'Users can view organization contacts'
  ) THEN
    CREATE POLICY "Users can view organization contacts" ON contacts
      FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM crm_users WHERE id = auth.uid()
      ));
  END IF;
END $$;
