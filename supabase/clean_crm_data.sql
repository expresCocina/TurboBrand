-- ⚠️ DANGER: This script deletes ALL transactional data from the CRM.
-- It preserves configuration (Users, Organizations, Automations, Templates).
-- EXECUTE WITH CAUTION.

BEGIN;

-- 1. Clear Logs & History (Dependent tables first)
DELETE FROM email_events;
DELETE FROM email_sends;
DELETE FROM activities;
DELETE FROM whatsapp_messages;
DELETE FROM whatsapp_conversations;

-- 2. Clear Operational Data
DELETE FROM tasks;
DELETE FROM opportunities;

-- 3. Clear Core Data
DELETE FROM contacts;
DELETE FROM email_campaigns; 
-- Optionally: DELETE FROM email_templates WHERE is_system = false;

COMMIT;

-- Verification
SELECT 
    (SELECT COUNT(*) FROM contacts) as contacts_count,
    (SELECT COUNT(*) FROM opportunities) as opportunities_count,
    (SELECT COUNT(*) FROM tasks) as tasks_count,
    (SELECT COUNT(*) FROM email_campaigns) as campaigns_count;
