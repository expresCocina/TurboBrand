import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Cliente anonimo (funciona con RPC Security Definer)

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, company, sector, message } = body;

        // Validación básica
        if (!email || !name || !company) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
        }

        console.log('📝 Recibido Web Lead:', { email, company });

        // Llamar al RPC seguro "create_web_lead"
        // Este procedimiento almacenado crea Contacto + Oportunidad + Tarea
        // y se salta RLS gracias a SECURITY DEFINER
        const { data, error } = await supabase.rpc('create_web_lead', {
            p_name: name,
            p_email: email,
            p_phone: phone,
            p_company: company,
            p_sector: sector
            // p_org_id usa default
        });

        if (error) {
            console.error('❌ Error en create_web_lead:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log('✅ Lead creado exitosamente:', data);

        // Send CAPI event for server-side tracking
        try {
            const eventId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/capi`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventName: 'Lead',
                    eventId: eventId,
                    emails: [email],
                    phones: phone ? [`+57${phone}`] : undefined,
                    sourceUrl: req.headers.get('referer') || '',
                    clientIp: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
                    userAgent: req.headers.get('user-agent'),
                    customData: {
                        content_name: 'Web Lead Form',
                        content_category: 'Lead Generation',
                        company: company,
                        sector: sector,
                    },
                }),
            });
            console.log('📊 CAPI event sent for lead:', email);
        } catch (capiError) {
            console.error('⚠️ CAPI tracking failed (non-critical):', capiError);
            // Don't fail the request if CAPI fails
        }

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('SERVER ERROR:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
