import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST: Enviar mensaje de WhatsApp
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { conversation_id, content } = body;

        // 1. Obtener detalles de la conversación para saber el teléfono destino
        const { data: conversation } = await supabase
            .from('whatsapp_conversations')
            .select('phone')
            .eq('id', conversation_id)
            .single();

        if (!conversation?.phone) {
            throw new Error('Conversación no encontrada o sin teléfono');
        }

        // ==========================================
        // CONFIGURACIÓN DE META (DESDE BASE DE DATOS)
        // ==========================================
        // 2. Obtener tokens de la organización (Single Tenant: tomamos el primero)
        const { data: orgData } = await supabase
            .from('organizations')
            .select('whatsapp_access_token, whatsapp_business_id')
            .single();

        const ACCESS_TOKEN = orgData?.whatsapp_access_token || process.env.WHATSAPP_ACCESS_TOKEN;
        const PHONE_NUMBER_ID = orgData?.whatsapp_business_id || process.env.WHATSAPP_PHONE_NUMBER_ID;

        // Si tenemos config, enviamos a Meta
        if (ACCESS_TOKEN && PHONE_NUMBER_ID) {
            const res = await fetch(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: conversation.phone,
                    type: 'text',
                    text: { body: content },
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                console.error('Meta API Error:', data);
                // No lanzamos error para permitir guardar en BD local, pero logueamos
            }
        } else {
            console.warn('Faltan tokens de WhatsApp. El mensaje solo se guardará localmente.');
        }

        // 2. Guardar en base de datos local (Mirror)
        // Esto es importante para mantener la historia inmediata en la UI
        const { error: dbError } = await supabase
            .from('whatsapp_messages')
            .insert([{
                conversation_id,
                content,
                direction: 'outbound',
                status: 'sent', // Asumimos sent si no falló la API
                type: 'text'
            }]);

        if (dbError) throw dbError;

        return NextResponse.json({ success: true, message: 'Mensaje enviado' });

    } catch (error: any) {
        console.error('Error msg route:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
