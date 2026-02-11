-- Verificar si el usuario existe en crm_users
SELECT * FROM crm_users LIMIT 5;

-- Ver estructura de la tabla
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'crm_users';
