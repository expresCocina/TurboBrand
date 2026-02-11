import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Tracking de apertura de email
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: messageId } = await params;
        const { headers } = req;

        // Obtener user agent e IP
        const userAgent = headers.get('user-agent') || '';
        const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || '';

        // Registrar evento de apertura
        await supabase
            .from('email_tracking_events')
            .insert({
                message_id: messageId,
                event_type: 'open',
                user_agent: userAgent,
                ip_address: ip
            });

        // Actualizar mensaje si es la primera apertura
        const { data: message } = await supabase
            .from('email_messages')
            .select('opened_at, total_opens')
            .eq('id', messageId)
            .single();

        if (message) {
            const updates: any = {
                total_opens: (message.total_opens || 0) + 1
            };

            // Si es la primera apertura, registrar timestamp
            if (!message.opened_at) {
                updates.opened_at = new Date().toISOString();
            }

            await supabase
                .from('email_messages')
                .update(updates)
                .eq('id', messageId);
        }

        // Retornar pixel transparente 1x1
        const pixel = Buffer.from(
            'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            'base64'
        );

        return new NextResponse(pixel, {
            headers: {
                'Content-Type': 'image/gif',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

    } catch (error: any) {
        console.error('Error en tracking de apertura:', error);

        // Aún en caso de error, retornar pixel para no romper el email
        const pixel = Buffer.from(
            'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            'base64'
        );

        return new NextResponse(pixel, {
            headers: {
                'Content-Type': 'image/gif'
            }
        });
    }
}
