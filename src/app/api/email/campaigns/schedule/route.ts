import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, subject, content, segment_id, scheduled_at, organization_id } = body;

        if (!subject || !content || !scheduled_at) {
            return NextResponse.json({
                error: 'Faltan datos requeridos (Asunto, Contenido o Fecha Programada)'
            }, { status: 400 });
        }

        // Validar que scheduled_at sea una fecha futura
        const scheduledDate = new Date(scheduled_at);
        const now = new Date();

        if (scheduledDate <= now) {
            return NextResponse.json({
                error: 'La fecha programada debe ser futura'
            }, { status: 400 });
        }

        // Guardar campaña como 'scheduled'
        const { data: campaign, error } = await supabase
            .from('email_campaigns')
            .insert({
                name: name || `Campaña programada - ${new Date().toLocaleDateString()}`,
                subject,
                content,
                segment_id: segment_id || null,
                scheduled_at,
                status: 'scheduled',
                organization_id: organization_id || '5e5b7400-1a66-42dc-880e-e501021edadc', // ID dinámico con fallback
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Error guardando campaña programada:', error);
            throw error;
        }

        const formattedDate = scheduledDate.toLocaleString('es-ES', {
            dateStyle: 'full',
            timeStyle: 'short'
        });

        return NextResponse.json({
            success: true,
            campaign,
            message: `Campaña programada para ${formattedDate}`
        });

    } catch (error: any) {
        console.error('Error en /api/email/campaigns/schedule:', error);
        return NextResponse.json({
            error: error.message || 'Error al programar la campaña'
        }, { status: 500 });
    }
}
