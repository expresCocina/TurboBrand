-- Verificar mensajes por thread
SELECT 
    t.id as thread_id,
    t.subject,
    t.total_messages,
    COUNT(m.id) as actual_message_count,
    MAX(m.direction) as last_direction,
    MAX(m.created_at) as last_message_time
FROM email_threads t
LEFT JOIN email_messages m ON m.thread_id = t.id
GROUP BY t.id, t.subject, t.total_messages
ORDER BY t.created_at DESC
LIMIT 20;

-- Ver mensajes específicos
SELECT 
    id,
    thread_id,
    direction,
    from_email,
    to_email,
    subject,
    created_at
FROM email_messages
ORDER BY created_at DESC
LIMIT 20;
