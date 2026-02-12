-- Ver la dirección del último mensaje de cada thread
SELECT 
    t.id as thread_id,
    t.subject,
    t.contact_id,
    (
        SELECT m.direction 
        FROM email_messages m 
        WHERE m.thread_id = t.id 
        ORDER BY m.created_at DESC 
        LIMIT 1
    ) as last_message_direction,
    (
        SELECT COUNT(*) 
        FROM email_messages m 
        WHERE m.thread_id = t.id AND m.direction = 'inbound'
    ) as inbound_count,
    (
        SELECT COUNT(*) 
        FROM email_messages m 
        WHERE m.thread_id = t.id AND m.direction = 'outbound'
    ) as outbound_count
FROM email_threads t
ORDER BY t.last_message_at DESC
LIMIT 20;
