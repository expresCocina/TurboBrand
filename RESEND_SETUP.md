# 📧 Configuración de Resend para Email Marketing

## ¿Por qué Resend?

✅ **Más moderno y fácil de usar**  
✅ **Mejor experiencia de desarrollo**  
✅ **Excelente tracking de emails**  
✅ **Webhooks simples**  
✅ **Precio competitivo**  

---

## 🚀 Configuración Paso a Paso

### 1. Crear Cuenta en Resend

1. Ve a https://resend.com
2. Click en **Sign Up**
3. Crea tu cuenta con email

### 2. Verificar tu Dominio (Recomendado)

Para enviar emails desde `@turbobrand.com`:

1. En Resend, ve a **Domains**
2. Click en **Add Domain**
3. Ingresa: `turbobrand.com`
4. Resend te dará registros DNS para agregar:
   - **SPF** (TXT record)
   - **DKIM** (TXT record)
   - **DMARC** (TXT record)

5. Agrega estos registros en tu proveedor de dominio (GoDaddy, Namecheap, etc.)
6. Espera la verificación (puede tomar hasta 48 horas)

> [!TIP]
> Mientras verificas el dominio, puedes usar el dominio de prueba de Resend: `onboarding@resend.dev`

### 3. Obtener API Key

1. En Resend, ve a **API Keys**
2. Click en **Create API Key**
3. Dale un nombre: `Turbo Brand CRM`
4. Selecciona permisos: **Full Access** (o **Sending Access** si prefieres)
5. Click en **Create**
6. **COPIA LA KEY** (solo se muestra una vez)

### 4. Configurar Variables de Entorno

Agrega a tu `.env.local`:

```env
RESEND_API_KEY=re_tu_key_aqui
EMAIL_FROM=noreply@turbobrand.com
```

Si aún no verificaste el dominio, usa:
```env
EMAIL_FROM=onboarding@resend.dev
```

### 5. Instalar Dependencia

```bash
npm install resend
```

---

## 📊 Características de Resend

### Tracking de Emails
Resend incluye tracking automático de:
- ✅ **Delivered** - Email entregado
- ✅ **Opened** - Email abierto
- ✅ **Clicked** - Links clickeados
- ✅ **Bounced** - Email rebotado
- ✅ **Complained** - Marcado como spam

### Webhooks
Configurar webhooks para recibir eventos en tiempo real:

1. En Resend, ve a **Webhooks**
2. Click en **Add Webhook**
3. URL: `https://tu-dominio.com/api/email/webhook`
4. Selecciona eventos:
   - `email.delivered`
   - `email.opened`
   - `email.clicked`
   - `email.bounced`
   - `email.complained`

---

## 💰 Precios

**Plan Gratuito:**
- 100 emails/día
- 3,000 emails/mes
- Perfecto para empezar

**Plan Pro ($20/mes):**
- 50,000 emails/mes
- Dominio personalizado
- Soporte prioritario

---

## 🔧 Ejemplo de Uso

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Enviar email simple
await resend.emails.send({
  from: 'Turbo Brand <noreply@turbobrand.com>',
  to: 'cliente@example.com',
  subject: '¡Bienvenido a Turbo Brand!',
  html: '<h1>Hola!</h1><p>Gracias por unirte.</p>'
});

// Con tracking personalizado
await resend.emails.send({
  from: 'Turbo Brand <noreply@turbobrand.com>',
  to: 'cliente@example.com',
  subject: 'Nueva campaña',
  html: emailContent,
  tags: [
    { name: 'campaign_id', value: 'campaign_123' },
    { name: 'contact_id', value: 'contact_456' }
  ]
});
```

---

## ✅ Verificación

Tu configuración está lista cuando:
- ✅ Cuenta de Resend creada
- ✅ API Key obtenida
- ✅ Variables en `.env.local` configuradas
- ✅ Dependencia `resend` instalada
- ⏳ Dominio verificado (opcional pero recomendado)

---

## 🚀 Próximo Paso

Cuando lleguemos a la **Fase 3 (Email Marketing)**, usaremos esta configuración para:
- Crear campañas de email
- Enviar emails masivos
- Trackear aperturas y clicks
- Generar reportes detallados

**Por ahora, solo necesitas tener la cuenta creada y la API key lista.** 🎉
