-- Verificar datos de emails en las tablas

-- 1. Ver todos los threads
SELECT 
    id,
    subject,
    contact_id,
    organization_id,
    total_messages,
    unread_count,
    last_message_at,
    created_at
FROM email_threads
ORDER BY created_at DESC
LIMIT 10;

-- 2. Ver todos los mensajes
SELECT 
    id,
    thread_id,
    direction,
    from_email,
    from_name,
    to_email,
    subject,
    created_at
FROM email_messages
ORDER BY created_at DESC
LIMIT 10;

-- 3. Contar threads y mensajes
SELECT 
    'Threads' as tipo,
    COUNT(*) as total
FROM email_threads
UNION ALL
SELECT 
    'Messages' as tipo,
    COUNT(*) as total
FROM email_messages;

-- 4. Ver contactos con su organization_id
SELECT 
    id,
    name,
    email,
    organization_id,
    created_at
FROM contacts
ORDER BY created_at DESC
LIMIT 10;
