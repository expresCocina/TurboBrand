-- Script para arreglar permisos de lectura de contactos
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar todas las políticas existentes de contacts
DROP POLICY IF EXISTS "Users can view their organization data" ON contacts;
DROP POLICY IF EXISTS "Users can insert in their organization" ON contacts;
DROP POLICY IF EXISTS "Users can update their organization data" ON contacts;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON contacts;
DROP POLICY IF EXISTS "Enable insert access for all authenticated users" ON contacts;
DROP POLICY IF EXISTS "Enable update access for all authenticated users" ON contacts;
DROP POLICY IF EXISTS "Enable delete access for all authenticated users" ON contacts;
DROP POLICY IF EXISTS "allow_all_select" ON contacts;
DROP POLICY IF EXISTS "allow_all_insert" ON contacts;
DROP POLICY IF EXISTS "allow_all_update" ON contacts;
DROP POLICY IF EXISTS "allow_all_delete" ON contacts;
DROP POLICY IF EXISTS "Public read access" ON contacts;

-- 2. Crear política simple y permisiva para lectura
CREATE POLICY "contacts_select_all" 
ON contacts 
FOR SELECT 
TO authenticated, anon
USING (true);

-- 3. Crear política para inserción (autenticados)
CREATE POLICY "contacts_insert_authenticated" 
ON contacts 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- 4. Crear política para actualización (autenticados)
CREATE POLICY "contacts_update_authenticated" 
ON contacts 
FOR UPDATE 
TO authenticated
USING (true);

-- 5. Crear política para eliminación (autenticados)
CREATE POLICY "contacts_delete_authenticated" 
ON contacts 
FOR DELETE 
TO authenticated
USING (true);

-- Verificar que RLS está habilitado
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Verificar políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'contacts';
