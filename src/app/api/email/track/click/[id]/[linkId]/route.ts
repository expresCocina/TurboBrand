import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Tracking de clicks en links
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string; linkId: string }> }
) {
    try {
        const { id: messageId, linkId } = await params;
        const url = new URL(req.url);
        const targetUrl = url.searchParams.get('url');

        if (!targetUrl) {
            return NextResponse.json({ error: 'URL not provided' }, { status: 400 });
        }

        // Obtener user agent e IP
        const userAgent = req.headers.get('user-agent') || '';
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';

        // Registrar evento de click
        await supabase
            .from('email_tracking_events')
            .insert({
                message_id: messageId,
                event_type: 'click',
                link_url: targetUrl,
                user_agent: userAgent,
                ip_address: ip
            });

        // Actualizar mensaje
        const { data: message } = await supabase
            .from('email_messages')
            .select('first_click_at, total_clicks')
            .eq('id', messageId)
            .single();

        if (message) {
            const updates: any = {
                total_clicks: (message.total_clicks || 0) + 1
            };

            // Si es el primer click, registrar timestamp
            if (!message.first_click_at) {
                updates.first_click_at = new Date().toISOString();
            }

            await supabase
                .from('email_messages')
                .update(updates)
                .eq('id', messageId);
        }

        // Redirigir al URL original
        return NextResponse.redirect(targetUrl);

    } catch (error: any) {
        console.error('Error en tracking de click:', error);

        // En caso de error, intentar redirigir al URL de todas formas
        const { searchParams } = new URL(req.url);
        const targetUrl = searchParams.get('url');

        if (targetUrl) {
            return NextResponse.redirect(targetUrl);
        }

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
