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
        const formattedThreads = (threads || []).map(thread => {
            try {
                // Obtener mensajes de forma segura
                const messages = Array.isArray(thread.messages) ? thread.messages : [];

                // Ordenar mensajes por fecha de forma segura
                const sortedMessages = [...messages].sort((a, b) => {
                    try {
                        const dateA = new Date(a.created_at || 0).getTime();
                        const dateB = new Date(b.created_at || 0).getTime();
                        return dateA - dateB;
                    } catch {
                        return 0;
                    }
                });

                const lastMessage = sortedMessages[sortedMessages.length - 1];
                const preview = lastMessage?.text_content?.substring(0, 100) || '';

                // Obtener mensajes enviados
                const outboundMessages = sortedMessages.filter(m => m.direction === 'outbound');
                const lastOutbound = outboundMessages[outboundMessages.length - 1];

                // Sumar a métricas globales
                outboundMessages.forEach(msg => {
                    totalSent++;
                    if (msg.opened_at || (msg.total_opens && msg.total_opens > 0)) totalOpened++;
                    if (msg.clicked_at || (msg.total_clicks && msg.total_clicks > 0)) totalClicked++;
                });

                return {
                    id: thread.id,
                    contactId: thread.contact?.id,
                    contactName: thread.contact?.name || 'Sin nombre',
                    contactEmail: thread.contact?.email || '',
                    subject: thread.subject || 'Sin asunto',
                    lastMessageAt: thread.last_message_at,
                    totalMessages: thread.total_messages || 0,
                    unreadCount: thread.unread_count || 0,
                    preview: preview,
                    lastMessageDirection: lastMessage?.direction || 'inbound',
                    // Métricas de tracking
                    opened_at: lastOutbound?.opened_at,
                    total_opens: lastOutbound?.total_opens || 0,
                    clicked_at: lastOutbound?.clicked_at,
                    total_clicks: lastOutbound?.total_clicks || 0
                };
            } catch (threadError) {
                console.error('Error processing thread:', thread.id, threadError);
                // Retornar thread básico en caso de error
                return {
                    id: thread.id,
                    contactId: thread.contact?.id,
                    contactName: thread.contact?.name || 'Sin nombre',
                    contactEmail: thread.contact?.email || '',
                    subject: thread.subject || 'Sin asunto',
                    lastMessageAt: thread.last_message_at,
                    totalMessages: 0,
                    unreadCount: 0,
                    preview: '',
                    lastMessageDirection: 'inbound',
                    opened_at: null,
                    total_opens: 0,
                    clicked_at: null,
                    total_clicks: 0
                };
            }
        });

        // Calcular tasas
        const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
        const clickRate = totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0;

        console.log('📊 Metrics:', { totalSent, totalOpened, totalClicked, openRate, clickRate });

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
        console.error('❌ Error obteniendo inbox:', error);
        return NextResponse.json({
            error: error.message || 'Internal server error',
            details: error.toString()
        }, { status: 500 });
    }
}
