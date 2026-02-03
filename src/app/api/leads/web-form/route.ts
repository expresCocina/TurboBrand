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

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('SERVER ERROR:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
