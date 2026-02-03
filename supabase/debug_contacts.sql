-- Script de diagnóstico para verificar contactos
-- Ejecutar en Supabase SQL Editor

-- Ver todos los contactos con sus organization_id
SELECT 
    id,
    first_name,
    last_name,
    email,
    organization_id,
    created_at
FROM contacts
ORDER BY created_at DESC
LIMIT 10;
