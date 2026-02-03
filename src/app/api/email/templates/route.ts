import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Listar plantillas
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc'; // Hardcoded por ahora, idealmente vendría del auth

        let query = supabase
            .from('email_templates')
            .select('*')
            .eq('organization_id', organization_id)
            .order('created_at', { ascending: false });

        if (category && category !== 'all') {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json(data || []);

    } catch (error: any) {
        console.error('Error fetching templates:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Crear plantilla
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, subject, html_content, category, description, is_active, organization_id } = body;

        if (!name || !html_content) {
            return NextResponse.json({ error: 'Nombre y contenido son requeridos' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('email_templates')
            .insert([{
                name,
                subject,
                html_content,
                category: category || 'general',
                description,
                is_active: is_active !== undefined ? is_active : true,
                organization_id: organization_id || '5e5b7400-1a66-42dc-880e-e501021edadc'
            }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Error creating template:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
