-- DIAGNÓSTICO Y FIX COMPLETO PARA CAMPAÑAS QUE NO APARECEN
-- Ejecuta este script paso a paso

-- PASO 1: Ver tu usuario actual y su organization_id
SELECT 
    id,
    email,
    organization_id,
    created_at
FROM crm_users
WHERE email LIKE '%marin%'
ORDER BY created_at DESC;

-- PASO 2: Ver todas las campañas existentes
SELECT 
    id,
    name,
    subject,
    status,
    organization_id,
    created_at
FROM email_campaigns
ORDER BY created_at DESC;

-- PASO 3: Ver todas las organizaciones
SELECT 
    id,
    name,
    created_at
FROM organizations
ORDER BY created_at DESC;

-- ========================================
-- SOLUCIÓN 1: Si tu usuario NO tiene organization_id
-- ========================================
-- Ejecuta esto SOLO si el PASO 1 muestra organization_id = NULL

-- Actualizar tu usuario con el organization_id correcto
-- UPDATE crm_users
-- SET organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc'
-- WHERE email LIKE '%marin%';

-- ========================================
-- SOLUCIÓN 2: Si tu usuario SÍ tiene organization_id pero es diferente
-- ========================================
-- Ejecuta esto SOLO si el PASO 1 muestra un organization_id diferente al de las campañas

-- Opción A: Actualizar las campañas para que coincidan con tu organization_id
-- Reemplaza 'TU_ORG_ID_AQUI' con el organization_id que viste en el PASO 1
-- UPDATE email_campaigns
-- SET organization_id = 'TU_ORG_ID_AQUI'
-- WHERE organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc'
--    OR organization_id IS NULL;

-- Opción B: Actualizar tu usuario para que coincida con el organization_id de las campañas
-- UPDATE crm_users
-- SET organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc'
-- WHERE email LIKE '%marin%';

-- ========================================
-- VERIFICACIÓN FINAL
-- ========================================
-- Ejecuta esto después de aplicar la solución para verificar que todo coincide

SELECT 
    'Usuario' as tipo,
    cu.email as identificador,
    cu.organization_id
FROM crm_users cu
WHERE cu.email LIKE '%marin%'

UNION ALL

SELECT 
    'Campaña' as tipo,
    ec.name as identificador,
    ec.organization_id
FROM email_campaigns ec
ORDER BY tipo, identificador;

-- Si todos tienen el mismo organization_id, ¡el problema está resuelto!
-- Recarga la página de Email Marketing
