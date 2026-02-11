import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Webhook para recibir emails de Resend Inbound
export async function POST(req: Request) {
    try {
        const payload = await req.json();

        console.log('📧 Email recibido de Resend:', {
            from: payload.from,
            to: payload.to,
            subject: payload.subject
        });

        // Extraer información del email
        const fromEmail = payload.from;
        const fromName = payload.from_name || extractNameFromEmail(fromEmail);
        const toEmail = Array.isArray(payload.to) ? payload.to[0] : payload.to;
        const subject = payload.subject || '(Sin asunto)';
        const htmlContent = payload.html || '';
        const textContent = payload.text || '';
        const messageId = payload.message_id || generateMessageId();
        const inReplyTo = payload.in_reply_to || null;

        // 1. Buscar o crear contacto
        let contact = await findOrCreateContact(fromEmail, fromName);

        if (!contact) {
            console.error('❌ No se pudo crear/encontrar contacto');
            return NextResponse.json({ error: 'Contact creation failed' }, { status: 500 });
        }

        // 2. Buscar o crear thread (conversación)
        let thread = await findOrCreateThread(contact.id, contact.organization_id, subject, inReplyTo);

        if (!thread) {
            console.error('❌ No se pudo crear/encontrar thread');
            return NextResponse.json({ error: 'Thread creation failed' }, { status: 500 });
        }

        // 3. Guardar mensaje
        const { data: message, error: messageError } = await supabase
            .from('email_messages')
            .insert({
                thread_id: thread.id,
                organization_id: contact.organization_id,
                direction: 'inbound',
                from_email: fromEmail,
                from_name: fromName,
                to_email: toEmail,
                to_name: 'Turbo Brand',
                subject: subject,
                html_content: htmlContent,
                text_content: textContent,
                message_id: messageId,
                in_reply_to: inReplyTo,
                is_read: false
            })
            .select()
            .single();

        if (messageError) {
            console.error('❌ Error guardando mensaje:', messageError);
            return NextResponse.json({ error: messageError.message }, { status: 500 });
        }

        // 4. Actualizar thread
        await supabase
            .from('email_threads')
            .update({
                last_message_at: new Date().toISOString(),
                total_messages: thread.total_messages + 1,
                unread_count: thread.unread_count + 1
            })
            .eq('id', thread.id);

        console.log('✅ Email procesado exitosamente:', message.id);

        return NextResponse.json({
            success: true,
            messageId: message.id,
            threadId: thread.id
        });

    } catch (error: any) {
        console.error('❌ Error en webhook de email:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ============================================
// Funciones auxiliares
// ============================================

async function findOrCreateContact(email: string, name: string) {
    // Buscar contacto existente por email
    const { data: existingContact } = await supabase
        .from('contacts')
        .select('*')
        .eq('email', email)
        .single();

    if (existingContact) {
        return existingContact;
    }

    // Si no existe, crear nuevo contacto
    // Obtener la primera organización (puedes ajustar esta lógica)
    const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .limit(1)
        .single();

    if (!org) {
        console.error('❌ No se encontró organización');
        return null;
    }

    const { data: newContact, error } = await supabase
        .from('contacts')
        .insert({
            organization_id: org.id,
            name: name,
            email: email,
            source: 'email_inbound',
            status: 'active'
        })
        .select()
        .single();

    if (error) {
        console.error('❌ Error creando contacto:', error);
        return null;
    }

    console.log('✅ Nuevo contacto creado:', newContact.id);
    return newContact;
}

async function findOrCreateThread(contactId: string, organizationId: string, subject: string, inReplyTo: string | null) {
    // Si es una respuesta, buscar thread por in_reply_to
    if (inReplyTo) {
        const { data: existingMessage } = await supabase
            .from('email_messages')
            .select('thread_id')
            .eq('message_id', inReplyTo)
            .single();

        if (existingMessage) {
            const { data: thread } = await supabase
                .from('email_threads')
                .select('*')
                .eq('id', existingMessage.thread_id)
                .single();

            if (thread) {
                return thread;
            }
        }
    }

    // Buscar thread existente por contacto y asunto similar
    const { data: existingThread } = await supabase
        .from('email_threads')
        .select('*')
        .eq('contact_id', contactId)
        .eq('organization_id', organizationId)
        .ilike('subject', `%${subject.substring(0, 50)}%`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (existingThread) {
        return existingThread;
    }

    // Crear nuevo thread
    const { data: newThread, error } = await supabase
        .from('email_threads')
        .insert({
            organization_id: organizationId,
            contact_id: contactId,
            subject: subject,
            total_messages: 0,
            unread_count: 0
        })
        .select()
        .single();

    if (error) {
        console.error('❌ Error creando thread:', error);
        return null;
    }

    console.log('✅ Nuevo thread creado:', newThread.id);
    return newThread;
}

function extractNameFromEmail(email: string): string {
    // Extraer nombre del email (antes del @)
    const username = email.split('@')[0];
    // Capitalizar primera letra
    return username.charAt(0).toUpperCase() + username.slice(1);
}

function generateMessageId(): string {
    // Generar un message ID único
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `<${timestamp}.${random}@turbobrandcol.com>`;
}
