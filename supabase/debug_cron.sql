-- Diagnóstico de Campañas Programadas

-- 1. Ver la campaña específica y su hora programada vs hora actual
SELECT 
    id, 
    name, 
    status, 
    scheduled_at, 
    NOW() as current_server_time,
    scheduled_at <= NOW() as should_have_run
FROM email_campaigns 
WHERE status = 'scheduled'
ORDER BY scheduled_at ASC;

-- 2. Ver historial de ejecuciones del cron job
SELECT * 
FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;

-- 3. Ver configuración del cron job
SELECT * FROM cron.job;
