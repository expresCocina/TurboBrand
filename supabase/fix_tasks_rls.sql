-- =============================================
-- FIX PERMISOS RLS - TABLA TASKS
-- =============================================

-- 1. ELIMINAR TODAS LAS POLÍTICAS EXISTENTES EN TASKS
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'tasks'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON tasks', pol.policyname);
    END LOOP;
END $$;

-- 2. ASEGURAR QUE RLS ESTÉ HABILITADO (POR SEGURIDAD, PERO PERMISIVO)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 3. CREAR POLÍTICAS PERMISIVAS PARA TASKS
CREATE POLICY "allow_all_select_tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "allow_all_insert_tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update_tasks" ON tasks FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete_tasks" ON tasks FOR DELETE USING (true);

-- 4. VERIFICAR POLÍTICAS
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'tasks'
ORDER BY policyname;
