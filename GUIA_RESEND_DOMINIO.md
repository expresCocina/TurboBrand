# Guía de Verificación de Dominio en Resend

Para poder enviar correos a **cualquier destinatario** y dejar de usar `onboarding@resend.dev`, necesitas verificar tu propio dominio (ej: `tubusiness.com`).

Esto es un requisito de seguridad antispam global, no solo de Resend.

## Pasos para verificar tu dominio:

1.  **Inicia sesión en Resend:** Ve a [resend.com/domains](https://resend.com/domains).
2.  **Añade tu dominio:**
    *   Haz click en **"Add Domain"**.
    *   Ingresa tu dominio (ej: `turbobrand.com` o `crm.turbobrand.com`).
    *   Selecciona la región (usualmente US East).
3.  **Configura los DNS:**
    *   Resend te dará unos registros DNS (tipo `TXT` y `MX`).
    *   Debes ir a tu proveedor de dominio (GoDaddy, Namecheap, Cloudflare, etc.).
    *   Crea los registros exactamente como te los pide Resend.
4.  **Verifica:**
    *   Vuelve a Resend y haz click en "Verify DNS Records".
    *   Puede tardar desde unos minutos hasta 24 horas en propagarse.

## Una vez verificado:

Cuando tu dominio esté en estado **Verified** (verde), debes actualizar el código del CRM para usar tu nuevo remitente.

### ¿Dónde cambiarlo en el código?

En el archivo: `src/app/api/email/campaigns/send/route.ts`

```typescript
// Cambiar esto:
from: 'Turbo Brand CRM <onboarding@resend.dev>',

// Por esto (usando tu dominio verificado):
from: 'Turbo Brand CRM <no-reply@tudiminio.com>',
```

> **Nota:** Mientras no hagas esto, solo podrás enviar correos a tu propia dirección de email registrada (modo Sandbox).
