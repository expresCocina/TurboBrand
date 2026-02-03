import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkAndRunAutomations } from '@/lib/automations';

// GET: Verificación del Webhook de Meta
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Obtener token de verificación de la DB
    const { data: org } = await supabase.from('organizations').select('whatsapp_verify_token').single();
    const VERIFY_TOKEN = org?.whatsapp_verify_token || 'turbo_brand_verify_token';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        return new NextResponse(challenge, { status: 200 });
    } else {
        return new NextResponse('Forbidden', { status: 403 });
    }
}

// POST: Recibir mensajes de WhatsApp
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Verificar si es un evento de mensaje de WhatsApp
        if (body.object === 'whatsapp_business_account') {
            const entry = body.entry?.[0];
            const changes = entry?.changes?.[0];
            const value = changes?.value;
            const message = value?.messages?.[0];

            if (message) {
                // Datos del mensaje
                const from = message.from; // Número de teléfono (ID externo)
                const text = message.text?.body || ''; // Contenido
                const type = message.type;
                const name = value.contacts?.[0]?.profile?.name || from; // Nombre del perfil o teléfono

                // NOTA: En producción, usar el timestamp del mensaje de Meta
                // const timestamp = new Date(parseInt(message.timestamp) * 1000);

                console.log('📨 Mensaje recibido de:', name, '(', from, '):', text);

                // 1. Buscar o Crear Contacto (Upsert) based on phone
                //    Asumimos que 'phone' en contacts es único o buscamos el primero.
                let { data: contact } = await supabase
                    .from('contacts')
                    .select('id')
                    .eq('phone', from)
                    .single();

                if (!contact) {
                    // Crear contacto si no existe
                    const { data: newContact, error: createError } = await supabase
                        .from('contacts')
                        .insert([{
                            name: name,
                            phone: from,
                            source: 'whatsapp',
                            // organization_id: ... (ya no es obligatorio o se maneja default)
                        }])
                        .select('id')
                        .single();



                    // ... (inside POST)

                    if (createError) {
                        console.error('Error creando contacto:', createError);
                        throw createError;
                    }
                    contact = newContact;

                    // 🤖 AUTOMATION: New Lead from WhatsApp
                    if (contact) {
                        // Usamos un await relajado o fire-and-forget
                        await checkAndRunAutomations('new_lead', contact, supabase);
                    }
                }

                if (!contact) throw new Error('No se pudo resolver el contacto');

                // 2. Buscar o Crear Conversación
                let { data: conversation } = await supabase
                    .from('whatsapp_conversations')
                    .select('id')
                    .eq('contact_id', contact.id)
                    .eq('status', 'open') // Buscamos una abierta
                    .single();

                if (!conversation) {
                    const { data: newConv, error: convError } = await supabase
                        .from('whatsapp_conversations')
                        .insert([{
                            contact_id: contact.id,
                            phone: from,
                            status: 'open',
                            last_message_at: new Date().toISOString()
                        }])
                        .select('id')
                        .single();

                    if (convError) throw convError;
                    conversation = newConv;
                }

                if (!conversation) throw new Error('No se pudo resolver la conversación');

                // 3. Guardar el Mensaje
                const { error: msgError } = await supabase
                    .from('whatsapp_messages')
                    .insert([{
                        conversation_id: conversation.id,
                        direction: 'inbound',
                        content: text, // Manejar otros tipos (image, etc) en el futuro
                        type: type,
                        status: 'delivered'
                    }]);

                if (msgError) throw msgError;

                // 4. Actualizar timestamp de conversación
                await supabase
                    .from('whatsapp_conversations')
                    .update({ last_message_at: new Date().toISOString() })
                    .eq('id', conversation.id);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error webhook:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
