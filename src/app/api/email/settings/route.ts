import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET: Obtener configuración de email
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        // FIXME: Requiere auth server-side real para ser seguro.
        // Por ahora confiamos en que el cliente envía el ID correcto o usamos fallback.
        const orgId = searchParams.get('organization_id') || '5e5b7400-1a66-42dc-880e-e501021edadc';

        const { data: org, error } = await supabase
            .from('organizations')
            .select('email_monthly_limit')
            .eq('id', orgId)
            .single();

        if (error) throw error;

        return NextResponse.json({
            email_monthly_limit: org?.email_monthly_limit || 2000
        });

    } catch (error: any) {
        console.error('Error obteniendo configuración:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Actualizar límite mensual
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { organization_id, email_monthly_limit } = body;

        if (!email_monthly_limit || email_monthly_limit < 0) {
            return NextResponse.json({
                error: 'El límite mensual debe ser un número positivo'
            }, { status: 400 });
        }

        const orgId = organization_id || '5e5b7400-1a66-42dc-880e-e501021edadc';

        const { error } = await supabase
            .from('organizations')
            .update({ email_monthly_limit })
            .eq('id', orgId);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            email_monthly_limit
        });

    } catch (error: any) {
        console.error('Error actualizando límite:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
