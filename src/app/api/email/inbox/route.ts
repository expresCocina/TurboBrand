import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

// GET: Obtener bandeja de entrada (threads)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Obtener organization_id del usuario
        const { data: user } = await supabase
            .from('crm_users')
            .select('organization_id')
            .eq('id', userId)
            .single();

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Obtener threads con información del contacto y último mensaje
        const { data: threads, error } = await supabase
            .from('email_threads')
            .select(`
                *,
                contact:leads(id, name, email),
                messages:email_messages(
                    id,
                    direction,
                    from_name,
                    text_content,
                    created_at
                )
            `)
            .eq('organization_id', user.organization_id)
            .order('last_message_at', { ascending: false });

        if (error) throw error;

        // Formatear respuesta
        const formattedThreads = threads?.map(thread => {
            const lastMessage = thread.messages?.[thread.messages.length - 1];
            const preview = lastMessage?.text_content?.substring(0, 100) || '';

            return {
                id: thread.id,
                contactId: thread.contact?.id,
                contactName: thread.contact?.name,
                contactEmail: thread.contact?.email,
                subject: thread.subject,
                lastMessageAt: thread.last_message_at,
                totalMessages: thread.total_messages,
                unreadCount: thread.unread_count,
                preview: preview,
                lastMessageDirection: lastMessage?.direction
            };
        }) || [];

        return NextResponse.json({ threads: formattedThreads });

    } catch (error: any) {
        console.error('Error obteniendo inbox:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
