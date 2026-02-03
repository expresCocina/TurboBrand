-- Trigger para crear usuario CRM cuando se registra en Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  org_id UUID;
BEGIN
  -- 1. Crear Organización por defecto para el usuario
  INSERT INTO public.organizations (name, domain)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Mi Organización'),
    'turbo-brand.com'
  )
  RETURNING id INTO org_id;

  -- 2. Crear Usuario CRM vinculado
  INSERT INTO public.crm_users (id, email, name, role, organization_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario CRM'),
    'admin', -- Primer usuario siempre es admin de su org
    org_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Disparador
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- IMPORTANTE: Para usuarios ya existentes que no tienen perfil
DO $$
DECLARE
  user_rec RECORD;
  org_id UUID;
BEGIN
  FOR user_rec IN SELECT * FROM auth.users WHERE id NOT IN (SELECT id FROM public.crm_users) LOOP
      
      -- Crear Org
      INSERT INTO public.organizations (name, domain)
      VALUES ('Organización de ' || user_rec.email, 'temp.com')
      RETURNING id INTO org_id;

      -- Crear User
      INSERT INTO public.crm_users (id, email, name, role, organization_id)
      VALUES (
        user_rec.id, 
        user_rec.email, 
        'Usuario Existente', 
        'admin', 
        org_id
      );
      
  END LOOP;
END $$;
