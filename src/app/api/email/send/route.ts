import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// POST: Enviar email
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { contactId, subject, content, userId, threadId } = body;

        if (!contactId || !subject || !content || !userId) {
            return NextResponse.json({
                error: 'Missing required fields'
            }, { status: 400 });
        }

        // Obtener información del usuario y organización
        const { data: user } = await supabase
            .from('crm_users')
            .select('organization_id, email, name')
            .eq('id', userId)
            .single();

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Obtener información del contacto
        const { data: contact } = await supabase
            .from('leads')
            .select('*')
            .eq('id', contactId)
            .single();

        if (!contact) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
        }

        // Buscar o crear thread
        let thread;
        if (threadId) {
            // Thread existente (es una respuesta)
            const { data: existingThread } = await supabase
                .from('email_threads')
                .select('*')
                .eq('id', threadId)
                .single();
            thread = existingThread;
        } else {
            // Crear nuevo thread
            const { data: newThread, error: threadError } = await supabase
                .from('email_threads')
                .insert({
                    organization_id: user.organization_id,
                    contact_id: contactId,
                    subject: subject,
                    total_messages: 0,
                    unread_count: 0
                })
                .select()
                .single();

            if (threadError) throw threadError;
            thread = newThread;
        }

        // Crear mensaje en base de datos primero (para obtener ID)
        const messageId = generateMessageId();
        const { data: message, error: messageError } = await supabase
            .from('email_messages')
            .insert({
                thread_id: thread.id,
                organization_id: user.organization_id,
                direction: 'outbound',
                from_email: process.env.RESEND_INBOUND_EMAIL || 'inbox@turbobrandcol.com',
                from_name: user.name || 'Turbo Brand',
                to_email: contact.email,
                to_name: contact.name,
                subject: subject,
                html_content: content,
                text_content: stripHtml(content),
                message_id: messageId,
                is_read: true // Los emails enviados se marcan como leídos
            })
            .select()
            .single();

        if (messageError) throw messageError;

        // Procesar contenido con tracking
        const processedContent = processEmailContent(content, message.id);

        // Enviar email via Resend
        const { data: emailData, error: emailError } = await resend.emails.send({
            from: `${user.name || 'Turbo Brand'} <${process.env.RESEND_INBOUND_EMAIL || 'inbox@turbobrandcol.com'}>`,
            to: [contact.email],
            subject: subject,
            html: processedContent,
            headers: {
                'Message-ID': messageId,
                'In-Reply-To': threadId ? thread.subject : undefined,
            }
        });

        if (emailError) {
            console.error('Error enviando email:', emailError);
            throw emailError;
        }

        // Actualizar thread
        await supabase
            .from('email_threads')
            .update({
                last_message_at: new Date().toISOString(),
                total_messages: thread.total_messages + 1
            })
            .eq('id', thread.id);

        console.log('✅ Email enviado exitosamente:', emailData);

        return NextResponse.json({
            success: true,
            messageId: message.id,
            threadId: thread.id,
            resendId: emailData?.id
        });

    } catch (error: any) {
        console.error('❌ Error enviando email:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ============================================
// Funciones auxiliares
// ============================================

function processEmailContent(content: string, messageId: string): string {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://turbobrandcol.com';

    // 1. Procesar links para tracking
    let processedContent = content;
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi;
    let linkId = 0;

    processedContent = processedContent.replace(linkRegex, (match, url) => {
        linkId++;
        const trackingUrl = `${siteUrl}/api/email/track/click/${messageId}/${linkId}?url=${encodeURIComponent(url)}`;
        return match.replace(url, trackingUrl);
    });

    // 2. Agregar tracking pixel al final
    const trackingPixel = `<img src="${siteUrl}/api/email/track/open/${messageId}" width="1" height="1" style="display:none" alt="" />`;

    // 3. Envolver en template HTML básico
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        a {
            color: #7c3aed;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="content">
        ${processedContent}
    </div>
    ${trackingPixel}
</body>
</html>
    `;

    return htmlTemplate;
}

function stripHtml(html: string): string {
    // Remover tags HTML para obtener texto plano
    return html.replace(/<[^>]*>/g, '').trim();
}

function generateMessageId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `<${timestamp}.${random}@turbobrandcol.com>`;
}
