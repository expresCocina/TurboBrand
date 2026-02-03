-- =====================================================
-- Script: Configurar Cron Job para Campañas Programadas
-- =====================================================
-- Este script configura un cron job que ejecuta la Edge Function
-- cada 5 minutos para procesar campañas programadas

-- IMPORTANTE: Antes de ejecutar este script:
-- 1. Despliega la Edge Function: supabase functions deploy process-scheduled-emails
-- 2. Reemplaza YOUR_PROJECT_REF con tu Project Reference de Supabase
-- 3. Reemplaza YOUR_ANON_KEY con tu Anon Key de Supabase

-- 1. Habilitar extensión pg_cron (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Verificar que pg_cron esté habilitado
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        RAISE NOTICE '✅ Extensión pg_cron habilitada';
    ELSE
        RAISE EXCEPTION '❌ Error: pg_cron no está disponible';
    END IF;
END $$;

-- 3. Eliminar job anterior si existe (para evitar duplicados)
-- Usamos DO para que no falle si el job no existe
DO $$
BEGIN
    PERFORM cron.unschedule('process-scheduled-emails');
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Job no existía previamente, continuando...';
END $$;

-- 4. Programar ejecución cada 5 minutos
-- IMPORTANTE: Reemplaza los valores YOUR_PROJECT_REF y YOUR_ANON_KEY
SELECT cron.schedule(
  'process-scheduled-emails',           -- Nombre del job
  '*/5 * * * *',                        -- Cada 5 minutos (formato cron)
  $$
  SELECT net.http_post(
    url := 'https://ihbcivtxochirpnpcmyv.supabase.co/functions/v1/process-scheduled-emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloYmNpdnR4b2NoaXJwbnBjbXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NzcwNjIsImV4cCI6MjA4NTM1MzA2Mn0.o74N3yAbgCrKfryOc4Kl-3S4vPb7ZpRQ2myI2va7mY0',
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- 5. Verificar que el job se creó correctamente
SELECT 
    jobid,
    schedule,
    command,
    nodename,
    nodeport,
    database,
    username,
    active
FROM cron.job
WHERE jobname = 'process-scheduled-emails';

-- 6. Ver historial de ejecuciones (útil para debugging)
-- Ejecuta esto después de que el cron haya corrido al menos una vez
-- SELECT * FROM cron.job_run_details 
-- WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'process-scheduled-emails')
-- ORDER BY start_time DESC 
-- LIMIT 10;

-- NOTAS:
-- - El cron job se ejecutará cada 5 minutos
-- - Puedes cambiar el intervalo modificando '*/5 * * * *':
--   - '*/1 * * * *' = cada minuto
--   - '*/10 * * * *' = cada 10 minutos
--   - '0 * * * *' = cada hora en punto
-- - Para desactivar el job: SELECT cron.unschedule('process-scheduled-emails');
-- - Para ver todos los jobs: SELECT * FROM cron.job;
