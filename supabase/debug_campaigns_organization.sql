-- Verificar el organization_id del usuario actual
-- Ejecuta esto para ver qué organization_id tiene tu usuario

SELECT 
    cu.id as user_id,
    cu.email,
    cu.organization_id,
    o.name as organization_name
FROM crm_users cu
LEFT JOIN organizations o ON cu.organization_id = o.id
WHERE cu.email = 'damo.marin@gmail.com' OR cu.email = 'demo.marin@gmail.com';

-- Si el resultado muestra un organization_id diferente a '5e5b7400-1a66-42dc-880e-e501021edadc',
-- entonces necesitamos actualizar las campañas con el organization_id correcto

-- Opción 1: Actualizar las campañas con el organization_id del usuario
-- (Ejecuta esto SOLO si el query anterior muestra un organization_id diferente)
-- UPDATE email_campaigns
-- SET organization_id = 'TU_ORGANIZATION_ID_AQUI'
-- WHERE organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc';

-- Opción 2: Ver todas las campañas sin filtro
SELECT 
    id,
    name,
    subject,
    status,
    organization_id,
    created_at
FROM email_campaigns
ORDER BY created_at DESC;
