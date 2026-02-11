import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET: Obtener bandeja de entrada (threads)
export async function GET(req: Request) {
    try {
        // Obtener token de autenticación
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !authUser) {
            return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
        }

        console.log('📧 Fetching inbox for user:', authUser.id);

        // Obtener todos los threads con información del contacto y mensajes
        // Como usamos supabaseAdmin, no necesitamos filtrar por organization_id
        const { data: threads, error } = await supabaseAdmin
            .from('email_threads')
            .select(`
                *,
                contact:contacts(id, name, email),
                messages:email_messages(
                    id,
                    direction,
                    from_name,
                    text_content,
                    created_at
                )
            `)
            .order('last_message_at', { ascending: false });

        if (error) {
            console.error('❌ Error fetching threads:', error);
            throw error;
        }

        console.log(`✅ Found ${threads?.length || 0} threads`);

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
