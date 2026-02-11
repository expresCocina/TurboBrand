import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET: Obtener conversación completa (thread con todos los mensajes)
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Obtener thread
        const { data: thread, error: threadError } = await supabaseAdmin
            .from('email_threads')
            .select(`
                *,
                contact:contacts(id, name, email, phone)
            `)
            .eq('id', id)
            .single();

        if (threadError) throw threadError;

        // Obtener todos los mensajes del thread
        const { data: messages, error: messagesError } = await supabaseAdmin
            .from('email_messages')
            .select('*')
            .eq('thread_id', id)
            .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;

        // Formatear mensajes
        const formattedMessages = messages?.map(msg => ({
            id: msg.id,
            direction: msg.direction,
            from: msg.from_email,
            fromName: msg.from_name,
            to: msg.to_email,
            toName: msg.to_name,
            subject: msg.subject,
            htmlContent: msg.html_content,
            textContent: msg.text_content,
            createdAt: msg.created_at,
            isRead: msg.is_read,
            opened: msg.opened_at !== null,
            openedAt: msg.opened_at,
            clicked: msg.first_click_at !== null,
            clickedAt: msg.first_click_at,
            totalOpens: msg.total_opens,
            totalClicks: msg.total_clicks
        })) || [];

        return NextResponse.json({
            thread: {
                id: thread.id,
                subject: thread.subject,
                totalMessages: thread.total_messages,
                unreadCount: thread.unread_count,
                contact: thread.contact
            },
            messages: formattedMessages
        });

    } catch (error: any) {
        console.error('Error obteniendo thread:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH: Marcar mensajes como leídos
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        if (body.action === 'mark_read') {
            // Marcar todos los mensajes no leídos del thread como leídos
            const { error: updateError } = await supabaseAdmin
                .from('email_messages')
                .update({ is_read: true })
                .eq('thread_id', id)
                .eq('is_read', false);

            if (updateError) throw updateError;

            // Actualizar contador de no leídos en el thread
            const { error: threadError } = await supabaseAdmin
                .from('email_threads')
                .update({ unread_count: 0 })
                .eq('id', id);

            if (threadError) throw threadError;

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error('Error actualizando thread:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
