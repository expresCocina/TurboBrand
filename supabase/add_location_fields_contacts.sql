-- Script para agregar campos de ubicación a la tabla CONTACTS
-- Agrega: address, department, city

ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS city VARCHAR(100);

-- Opcional: Agregar índices si vamos a filtrar mucho por ciudad/departamento
CREATE INDEX IF NOT EXISTS idx_contacts_city ON contacts(city);
CREATE INDEX IF NOT EXISTS idx_contacts_department ON contacts(department);
