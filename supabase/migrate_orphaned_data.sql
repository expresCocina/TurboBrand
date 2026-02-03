-- Script para migrar datos "huérfanos" a la organización del usuario actual
-- Ejecuta esto SOLO si tienes contactos/oportunidades que no aparecen en el CRM

-- IMPORTANTE: Reemplaza 'TU_EMAIL_AQUI' con tu email de login
DO $$
DECLARE
  target_org_id UUID;
  user_email TEXT := 'damo.marin@gmail.com'; -- CAMBIA ESTO POR TU EMAIL
BEGIN
  -- 1. Obtener el organization_id del usuario
  SELECT organization_id INTO target_org_id
  FROM crm_users
  WHERE email = user_email
  LIMIT 1;

  IF target_org_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró organización para el email: %', user_email;
  END IF;

  RAISE NOTICE 'Migrando datos a la organización: %', target_org_id;

  -- 2. Migrar CONTACTOS huérfanos (sin organization_id o con org diferente)
  UPDATE contacts
  SET organization_id = target_org_id
  WHERE organization_id IS NULL 
     OR organization_id NOT IN (SELECT organization_id FROM crm_users WHERE email = user_email);

  RAISE NOTICE 'Contactos migrados: %', (SELECT COUNT(*) FROM contacts WHERE organization_id = target_org_id);

  -- 3. Migrar OPORTUNIDADES huérfanas
  UPDATE opportunities
  SET organization_id = target_org_id
  WHERE organization_id IS NULL 
     OR organization_id NOT IN (SELECT organization_id FROM crm_users WHERE email = user_email);

  RAISE NOTICE 'Oportunidades migradas: %', (SELECT COUNT(*) FROM opportunities WHERE organization_id = target_org_id);

  -- 4. Migrar CAMPAÑAS DE EMAIL huérfanas
  UPDATE email_campaigns
  SET organization_id = target_org_id
  WHERE organization_id IS NULL 
     OR organization_id NOT IN (SELECT organization_id FROM crm_users WHERE email = user_email);

  RAISE NOTICE 'Campañas migradas: %', (SELECT COUNT(*) FROM email_campaigns WHERE organization_id = target_org_id);

  -- 5. Migrar CONVERSACIONES DE WHATSAPP huérfanas
  UPDATE whatsapp_conversations
  SET organization_id = target_org_id
  WHERE organization_id IS NULL 
     OR organization_id NOT IN (SELECT organization_id FROM crm_users WHERE email = user_email);

  RAISE NOTICE 'Conversaciones WhatsApp migradas: %', (SELECT COUNT(*) FROM whatsapp_conversations WHERE organization_id = target_org_id);

  RAISE NOTICE '✅ Migración completada exitosamente';
END $$;
