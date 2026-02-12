import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET: Obtener bandeja de entrada (threads) con métricas
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
        // IMPORTANTE: Ordenar mensajes por fecha para identificar correctamente el último
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
                    created_at,
                    opened_at,
                    total_opens,
                    clicked_at,
                    total_clicks
                )
            `)
            .order('last_message_at', { ascending: false });

        if (error) {
            console.error('❌ Error fetching threads:', error);
            throw error;
        }

        console.log(`✅ Found ${threads?.length || 0} threads`);

        // Calcular métricas globales
        let totalSent = 0;
        let totalOpened = 0;
        let totalClicked = 0;

        // Formatear respuesta con métricas por thread
        const formattedThreads = threads?.map(thread => {
            // Asegurar que los mensajes estén ordenados por fecha (ascendente)
            const sortedMessages = thread.messages?.sort((a: any, b: any) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            ) || [];

            const lastMessage = sortedMessages[sortedMessages.length - 1];
            const preview = lastMessage?.text_content?.substring(0, 100) || '';

            // Obtener todos los mensajes enviados (outbound) de este thread
            const outboundMessages = sortedMessages.filter((m: any) => m.direction === 'outbound');
            const lastOutbound = outboundMessages[outboundMessages.length - 1];

            // Sumar a métricas globales (contar TODOS los mensajes outbound, no solo el último)
            outboundMessages.forEach((msg: any) => {
                totalSent++;
                if (msg.opened_at || (msg.total_opens && msg.total_opens > 0)) totalOpened++;
                if (msg.clicked_at || (msg.total_clicks && msg.total_clicks > 0)) totalClicked++;
            });

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
                lastMessageDirection: lastMessage?.direction || 'inbound', // Fallback to 'inbound' if no messages
                // Métricas de tracking (usamos datos del último mensaje enviado para el badge del thread)
                opened_at: lastOutbound?.opened_at,
                total_opens: lastOutbound?.total_opens || 0,
                clicked_at: lastOutbound?.clicked_at,
                total_clicks: lastOutbound?.total_clicks || 0,
                // NO devolvemos messages aquí para evitar payload grande
            };
        }) || [];

        // Calcular tasas
        const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
        const clickRate = totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0;

        return NextResponse.json({
            threads: formattedThreads,
            metrics: {
                totalSent,
                totalOpened,
                totalClicked,
                openRate,
                clickRate
            }
        });

    } catch (error: any) {
        console.error('Error obteniendo inbox:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
