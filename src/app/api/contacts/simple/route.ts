import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');

        // Crear cliente con el token del usuario si está presente
        const supabase = createClient(supabaseUrl, supabaseKey, {
            global: {
                headers: authHeader ? { Authorization: authHeader } : {}
            }
        });

        const { searchParams } = new URL(req.url);
        // const orgId = searchParams.get('organization_id'); // Deshabilitado temporalmente

        let query = supabase
            .from('contacts')
            .select('id, first_name, last_name, email')
            .not('id', 'is', null)
            .order('first_name', { ascending: true })
            .limit(100);

        // Filtro de organización deshabilitado para debugging
        // if (orgId) {
        //     query = query.eq('organization_id', orgId);
        // }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase Error:', error);
            throw error;
        }

        console.log(`Contactos encontrados: ${data?.length}`); // Debug

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
