import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET: Obtener todos los contactos
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

        // Obtener todos los contactos
        const { data: contacts, error } = await supabaseAdmin
            .from('contacts')
            .select('id, name, email, company')
            .order('name');

        if (error) {
            console.error('Error fetching contacts:', error);
            throw error;
        }

        return NextResponse.json({ contacts: contacts || [] });

    } catch (error: any) {
        console.error('Error en contacts API:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Crear nuevo contacto
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !authUser) {
            return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
        }

        const body = await req.json();
        const { name, email, source } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Obtener organization_id de la primera organización
        const { data: org } = await supabaseAdmin
            .from('organizations')
            .select('id')
            .limit(1)
            .single();

        if (!org) {
            return NextResponse.json({ error: 'No organization found' }, { status: 404 });
        }

        // Crear contacto
        const { data: contact, error: contactError } = await supabaseAdmin
            .from('contacts')
            .insert({
                organization_id: org.id,
                name: name || email.split('@')[0],
                email: email,
                source: source || 'manual',
                status: 'active',
                lead_score: 0
            })
            .select()
            .single();

        if (contactError) {
            console.error('Error creating contact:', contactError);
            throw contactError;
        }

        return NextResponse.json({ contact });

    } catch (error: any) {
        console.error('Error creating contact:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
