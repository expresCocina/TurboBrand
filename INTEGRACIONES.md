# 🔌 Guía de Integraciones del CRM

Esta guía te ayudará a configurar las integraciones cuando llegue el momento.

---

## 📧 Email Marketing (Fase 3)

### Resend (Recomendado) ⭐

**Cuándo configurar:** Fase 3 - Email Marketing

**Pasos:**
1. Ve a https://resend.com
2. Crea cuenta (Plan gratuito: 100 emails/día, 3,000/mes)
3. Verifica tu dominio (opcional pero recomendado)
4. Ve a **API Keys** → **Create API Key**
5. Copia la key y agrégala a `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxx
   EMAIL_FROM=noreply@turbobrand.com
   ```

**Guía completa:** Ver [RESEND_SETUP.md](file:///c:/Users/Cristhian%20S/.gemini/antigravity/scratch/turbo-brand/RESEND_SETUP.md)

**Ventajas:**
- ✅ Más moderno y fácil de usar
- ✅ Excelente tracking automático
- ✅ Webhooks simples
- ✅ Mejor experiencia de desarrollo

**Costo:** Plan gratuito generoso, Pro $20/mes (50k emails)

---

### SendGrid (Alternativa)

Si prefieres SendGrid:

1. Ve a https://sendgrid.com
2. Crea cuenta (Plan gratuito: 100 emails/día)
3. Verifica tu dominio o email
4. Ve a **Settings** → **API Keys** → **Create API Key**
5. Copia la key:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxx
   EMAIL_FROM=noreply@turbobrand.com
   ```

---

## 💬 WhatsApp Business (Fase 5)

### Opción 1: Twilio (Más fácil - Recomendado para empezar)

**Cuándo configurar:** Fase 5 - WhatsApp & IA

**Pasos:**
1. Ve a https://www.twilio.com
2. Crea cuenta (tienen crédito de prueba)
3. Ve a **Messaging** → **Try it Out** → **Send a WhatsApp message**
4. Sigue el wizard para conectar tu número
5. Obtén credenciales en **Account Info**:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
   TWILIO_AUTH_TOKEN=tu-auth-token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   ```

**Webhook:**
- URL: `https://tu-dominio.com/api/whatsapp/webhook`
- Método: POST

**Costo:** ~$0.005 por mensaje

### Opción 2: Meta Business API (Oficial - Para producción)

**Cuándo configurar:** Cuando tengas muchos usuarios

**Pasos:**
1. Ve a https://business.facebook.com
2. Crea una cuenta de Meta Business
3. Ve a **WhatsApp** → **Get Started**
4. Verifica tu negocio (puede tomar días)
5. Obtén credenciales:
   ```env
   WHATSAPP_API_TOKEN=tu-token
   WHATSAPP_PHONE_NUMBER_ID=tu-phone-id
   WHATSAPP_BUSINESS_ACCOUNT_ID=tu-account-id
   ```

**Ventajas:**
- Más barato a escala
- Marca verificada (check verde)
- Más funcionalidades

**Desventajas:**
- Proceso de aprobación largo
- Más complejo de configurar

---

## 🤖 OpenAI (Fase 5)

**Cuándo configurar:** Fase 5 - IA y Chatbot

**Para qué sirve:**
- Chatbot inteligente en WhatsApp
- Respuestas automáticas contextuales
- Análisis de sentimiento de mensajes
- Sugerencias de respuestas
- Resúmenes de conversaciones

**Pasos:**
1. Ve a https://platform.openai.com
2. Crea cuenta
3. Agrega método de pago (requiere tarjeta)
4. Ve a **API Keys** → **Create new secret key**
5. Copia la key:
   ```env
   OPENAI_API_KEY=sk-xxxxxxxxxx
   ```

**Modelos recomendados:**
- `gpt-4o-mini` - Más barato, rápido (recomendado para chatbot)
- `gpt-4o` - Más inteligente, más caro

**Costo estimado:**
- GPT-4o-mini: ~$0.15 por 1M tokens (~$20-30/mes uso normal)
- GPT-4o: ~$5 por 1M tokens (~$50-100/mes uso normal)

---

## 🔐 Seguridad

> [!WARNING]
> **NUNCA** compartas tus API keys públicamente ni las subas a GitHub.

**Buenas prácticas:**
1. Usa `.env.local` (ya está en `.gitignore`)
2. En producción, usa variables de entorno de Vercel
3. Rota las keys periódicamente
4. Usa diferentes keys para desarrollo y producción

---

## 📋 Checklist de Configuración

### Ahora (Fase 1-2):
- [x] Supabase configurado
- [ ] Email Marketing (esperar Fase 3)
- [ ] WhatsApp (esperar Fase 5)
- [ ] OpenAI (esperar Fase 5)

### Fase 3 (Email Marketing):
- [ ] Crear cuenta SendGrid
- [ ] Verificar dominio
- [ ] Obtener API key
- [ ] Configurar webhooks
- [ ] Probar envío de email

### Fase 5 (WhatsApp & IA):
- [ ] Crear cuenta Twilio o Meta Business
- [ ] Verificar número de WhatsApp
- [ ] Obtener credenciales
- [ ] Configurar webhooks
- [ ] Crear cuenta OpenAI
- [ ] Obtener API key
- [ ] Probar chatbot

---

## 🚀 Cuando Estés Listo

Cuando llegue el momento de configurar cada integración, solo necesitas:

1. Seguir los pasos de esta guía
2. Copiar las credenciales a `.env.local`
3. Reiniciar el servidor (`npm run dev`)
4. ¡Listo para usar!

---

**Nota:** Por ahora, continúa con el desarrollo del CRM. Las integraciones se activarán automáticamente cuando agregues las keys.
