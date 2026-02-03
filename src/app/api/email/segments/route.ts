import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET: Listar todos los segmentos
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const orgId = searchParams.get('organization_id') || '5e5b7400-1a66-42dc-880e-e501021edadc';

        const { data: segments, error } = await supabase
            .from('contact_segments')
            .select('*')
            .eq('organization_id', orgId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Obtener conteo de contactos para cada segmento
        const segmentsWithCount = await Promise.all(
            (segments || []).map(async (segment) => {
                const { data: count } = await supabase
                    .rpc('count_segment_contacts', { p_segment_id: segment.id });

                return {
                    ...segment,
                    contact_count: count || 0
                };
            })
        );

        return NextResponse.json(segmentsWithCount);

    } catch (error: any) {
        console.error('Error obteniendo segmentos:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Crear nuevo segmento
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, filter_type, filter_config, organization_id, contact_ids } = body;

        if (!name) {
            return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
        }

        const orgId = organization_id || '5e5b7400-1a66-42dc-880e-e501021edadc';

        // Crear segmento
        const { data: segment, error: segmentError } = await supabase
            .from('contact_segments')
            .insert([{
                organization_id: orgId,
                name,
                description,
                filter_type: filter_type || 'manual',
                filter_config: filter_config || null
            }])
            .select()
            .single();

        if (segmentError) throw segmentError;

        // Si es manual y se proporcionaron IDs de contactos, agregarlos
        if (filter_type === 'manual' && contact_ids && contact_ids.length > 0) {
            const members = contact_ids.map((contactId: string) => ({
                segment_id: segment.id,
                contact_id: contactId
            }));

            const { error: membersError } = await supabase
                .from('contact_segment_members')
                .insert(members);

            if (membersError) {
                console.error('Error agregando miembros:', membersError);
            }
        }

        // Si es dinámico, aplicar filtro
        if (filter_type !== 'manual' && filter_config) {
            const { data: count } = await supabase
                .rpc('add_contacts_to_segment_by_filter', {
                    p_segment_id: segment.id,
                    p_filter_type: filter_type,
                    p_filter_value: filter_config.value
                });

            console.log(`Agregados ${count} contactos al segmento dinámico`);
        }

        return NextResponse.json(segment, { status: 201 });

    } catch (error: any) {
        console.error('Error creando segmento:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Eliminar segmento
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const segmentId = searchParams.get('id');

        if (!segmentId) {
            return NextResponse.json({ error: 'ID de segmento requerido' }, { status: 400 });
        }

        const { error } = await supabase
            .from('contact_segments')
            .delete()
            .eq('id', segmentId);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error eliminando segmento:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
