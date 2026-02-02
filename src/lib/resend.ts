import { Resend } from 'resend';

// Inicializar Resend
const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
    console.warn('⚠️ RESEND_API_KEY no configurada. El email marketing no funcionará hasta que la configures.');
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Configuración de email
export const emailConfig = {
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM || 'onboarding@resend.dev',
};

// Tipos para emails
export interface SendEmailParams {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    tags?: { name: string; value: string }[];
    attachments?: {
        filename: string;
        content: Buffer | string;
    }[];
}

// Función helper para enviar emails
export async function sendEmail(params: SendEmailParams) {
    if (!resend) {
        throw new Error('Resend no está configurado. Agrega RESEND_API_KEY a tu .env.local');
    }

    try {
        const result = await resend.emails.send({
            from: emailConfig.from,
            to: params.to,
            subject: params.subject,
            html: params.html,
            text: params.text,
            tags: params.tags,
            attachments: params.attachments,
        });

        return result;
    } catch (error) {
        console.error('Error enviando email:', error);
        throw error;
    }
}

// Función para enviar email de bienvenida
export async function sendWelcomeEmail(to: string, name: string) {
    return sendEmail({
        to,
        subject: '¡Bienvenido a Turbo Brand CRM!',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #9E0060;">¡Hola ${name}!</h1>
        <p>Bienvenido al CRM de Turbo Brand.</p>
        <p>Estamos emocionados de tenerte con nosotros.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/crm" 
           style="display: inline-block; padding: 12px 24px; background: #9E0060; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Ir al CRM
        </a>
      </div>
    `,
        tags: [
            { name: 'type', value: 'welcome' },
        ],
    });
}

// Función para enviar email de campaña
export async function sendCampaignEmail(
    to: string,
    subject: string,
    content: string,
    campaignId: string,
    contactId: string
) {
    return sendEmail({
        to,
        subject,
        html: content,
        tags: [
            { name: 'type', value: 'campaign' },
            { name: 'campaign_id', value: campaignId },
            { name: 'contact_id', value: contactId },
        ],
    });
}

// Verificar si Resend está configurado
export function isResendConfigured(): boolean {
    return !!resendApiKey;
}
