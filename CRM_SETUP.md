# 🚀 Guía Rápida: Agregar CRM a Turbo Brand

## Paso 1: Ejecutar el Script SQL

1. Ve a tu proyecto Supabase: https://supabase.com/dashboard
2. Abre **SQL Editor**
3. Click en "New query"
4. Copia y pega todo el contenido del archivo: `supabase/add_crm_tables.sql`
5. Click en **RUN** para ejecutar

✅ Esto creará 11 nuevas tablas para el CRM en tu base de datos existente

## Paso 2: Verificar las Tablas

Ve a **Table Editor** y verifica que se crearon estas tablas:
- ✅ organizations
- ✅ crm_users
- ✅ contacts
- ✅ opportunities
- ✅ email_campaigns
- ✅ email_sends
- ✅ email_events
- ✅ whatsapp_conversations
- ✅ whatsapp_messages
- ✅ automations
- ✅ tasks
- ✅ activities

## Paso 3: Verificar Datos Iniciales

El script ya creó:
- ✅ Organización "Turbo Brand"
- ✅ Usuario admin (admin@turbobrand.com)

## Paso 4: Instalar Dependencias del CRM

```bash
npm install zustand @tanstack/react-query @tanstack/react-table recharts
```

## ✅ ¡Listo!

Tu base de datos ya está preparada para el CRM. Ahora podemos continuar con:
- Sistema de autenticación
- Dashboard del CRM
- Módulo de contactos
- Email marketing
- etc.

## 📊 Estructura Actual

Tu proyecto ahora tiene:
- ✅ Tablas de Zones (existente)
- ✅ Tablas del CRM (nuevo)
- ✅ Tipos TypeScript actualizados en `src/lib/supabase.ts`
