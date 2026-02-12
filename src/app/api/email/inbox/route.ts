import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET: Obtener bandeja de entrada (threads) con métricas
export async function GET(req: Request) {
    try {
        console.log('📧 [INBOX API] Starting request...');

        // Obtener token de autenticación
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            console.log('❌ [INBOX API] No auth header');
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        console.log('🔑 [INBOX API] Validating token...');

        const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !authUser) {
            console.log('❌ [INBOX API] Auth failed:', authError?.message);
            return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
        }

        console.log('✅ [INBOX API] User authenticated:', authUser.id);
        console.log('🔍 [INBOX API] Fetching threads...');

        // Primero, obtener solo los threads sin relaciones
        const { data: threads, error: threadsError } = await supabaseAdmin
            .from('email_threads')
            .select('*')
            .order('last_message_at', { ascending: false });

        if (threadsError) {
            console.error('❌ [INBOX API] Error fetching threads:', threadsError);
            throw threadsError;
        }

        console.log(`✅ [INBOX API] Found ${threads?.length || 0} threads`);

        if (!threads || threads.length === 0) {
            console.log('⚠️ [INBOX API] No threads found');
            return NextResponse.json({
                threads: [],
                metrics: {
                    totalSent: 0,
                    totalOpened: 0,
                    totalClicked: 0,
                    openRate: 0,
                    clickRate: 0
                }
            });
        }

        // Obtener contactos
        console.log('🔍 [INBOX API] Fetching contacts...');
        const contactIds = threads.map(t => t.contact_id).filter(Boolean);
        const { data: contacts } = await supabaseAdmin
            .from('contacts')
            .select('id, name, email')
            .in('id', contactIds);

        const contactsMap = new Map(contacts?.map(c => [c.id, c]) || []);
        console.log(`✅ [INBOX API] Found ${contacts?.length || 0} contacts`);

        // Obtener mensajes
        console.log('🔍 [INBOX API] Fetching messages...');
        const threadIds = threads.map(t => t.id);
        const { data: messages } = await supabaseAdmin
            .from('email_messages')
            .select('*')
            .in('thread_id', threadIds)
            .order('created_at', { ascending: true });

        console.log(`✅ [INBOX API] Found ${messages?.length || 0} messages`);

        // Agrupar mensajes por thread
        const messagesByThread = new Map();
        messages?.forEach(msg => {
            if (!messagesByThread.has(msg.thread_id)) {
                messagesByThread.set(msg.thread_id, []);
            }
            messagesByThread.get(msg.thread_id).push(msg);
        });

        // Calcular métricas globales
        let totalSent = 0;
        let totalOpened = 0;
        let totalClicked = 0;

        console.log('🔄 [INBOX API] Processing threads...');

        // Formatear threads
        const formattedThreads = threads.map((thread, index) => {
            try {
                const threadMessages = messagesByThread.get(thread.id) || [];
                const contact = contactsMap.get(thread.contact_id);

                const lastMessage = threadMessages[threadMessages.length - 1];
                const outboundMessages = threadMessages.filter(m => m.direction === 'outbound');
                const lastOutbound = outboundMessages[outboundMessages.length - 1];

                // Sumar métricas
                outboundMessages.forEach(msg => {
                    totalSent++;
                    if (msg.opened_at || (msg.total_opens && msg.total_opens > 0)) totalOpened++;
                    if (msg.clicked_at || (msg.total_clicks && msg.total_clicks > 0)) totalClicked++;
                });

                return {
                    id: thread.id,
                    contactId: contact?.id,
                    contactName: contact?.name || 'Sin nombre',
                    contactEmail: contact?.email || '',
                    subject: thread.subject || 'Sin asunto',
                    lastMessageAt: thread.last_message_at,
                    totalMessages: thread.total_messages || 0,
                    unreadCount: thread.unread_count || 0,
                    preview: lastMessage?.text_content?.substring(0, 100) || '',
                    lastMessageDirection: lastMessage?.direction || 'inbound',
                    opened_at: lastOutbound?.opened_at,
                    total_opens: lastOutbound?.total_opens || 0,
                    clicked_at: lastOutbound?.clicked_at,
                    total_clicks: lastOutbound?.total_clicks || 0
                };
            } catch (err) {
                console.error(`❌ [INBOX API] Error processing thread ${index}:`, err);
                return null;
            }
        }).filter(Boolean);

        console.log(`✅ [INBOX API] Processed ${formattedThreads.length} threads`);

        // Calcular tasas
        const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
        const clickRate = totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0;

        console.log('📊 [INBOX API] Metrics:', { totalSent, totalOpened, totalClicked, openRate, clickRate });
        console.log('✅ [INBOX API] Request completed successfully');

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
        console.error('❌ [INBOX API] Fatal error:', error);
        console.error('Stack:', error.stack);
        return NextResponse.json({
            error: error.message || 'Internal server error',
            details: error.toString()
        }, { status: 500 });
    }
}
