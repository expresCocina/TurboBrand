import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, subject, content, segment_id, scheduled_at, status } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID de campaña requerido' }, { status: 400 });
        }

        // Validar que la campañ no se haya enviado ya (doble check en backend)
        const { data: current, error: fetchError } = await supabase
            .from('email_campaigns')
            .select('status')
            .eq('id', id)
            .single();

        if (fetchError || !current) {
            return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
        }

        if (current.status === 'sent' || current.status === 'sending') {
            return NextResponse.json({ error: 'No se puede editar una campaña ya enviada' }, { status: 400 });
        }

        // Actualizar campaña
        const { data, error } = await supabase
            .from('email_campaigns')
            .update({
                name,
                subject,
                content,
                segment_id,
                scheduled_at,
                status // Permite resetear a 'scheduled' si estaba failed o draft
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error actualizando campaña:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Error en endpoint update:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
