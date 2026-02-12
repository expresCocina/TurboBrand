-- Script para eliminar todas las tablas relacionadas con Email Inbox
-- ADVERTENCIA: Esto eliminará TODOS los datos de inbox permanentemente

-- 1. Eliminar tabla de eventos de tracking
DROP TABLE IF EXISTS email_tracking_events CASCADE;

-- 2. Eliminar tabla de mensajes
DROP TABLE IF EXISTS email_messages CASCADE;

-- 3. Eliminar tabla de threads
DROP TABLE IF EXISTS email_threads CASCADE;

-- Verificar que las tablas fueron eliminadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('email_threads', 'email_messages', 'email_tracking_events');

-- Si el resultado está vacío, las tablas fueron eliminadas exitosamente
