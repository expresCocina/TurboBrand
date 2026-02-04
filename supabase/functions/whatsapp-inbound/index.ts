import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';

serve(async (req) => {
    try {
        // Handle GET request (webhook verification from Meta)
        if (req.method === 'GET') {
            const url = new URL(req.url);
            const mode = url.searchParams.get('hub.mode');
            const token = url.searchParams.get('hub.verify_token');
            const challenge = url.searchParams.get('hub.challenge');

            const VERIFY_TOKEN = Deno.env.get('WEBHOOK_VERIFY_TOKEN');

            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                console.log('✅ Webhook verified successfully');
                return new Response(challenge, { status: 200 });
            } else {
                console.error('❌ Webhook verification failed');
                return new Response('Forbidden', { status: 403 });
            }
        }

        // Handle POST request (incoming messages from Meta)
        if (req.method === 'POST') {
            const body = await req.json();
            console.log('📨 Received webhook:', JSON.stringify(body, null, 2));

            // Initialize Supabase client
            const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
            const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
            const supabase = createClient(supabaseUrl, supabaseKey);

            // Process webhook entries
            for (const entry of body.entry || []) {
                for (const change of entry.changes || []) {
                    if (change.field === 'messages') {
                        const value = change.value;

                        // Process incoming messages
                        if (value.messages && value.messages.length > 0) {
                            for (const message of value.messages) {
                                await processIncomingMessage(supabase, message, value.contacts?.[0], value.metadata);
                            }
                        }

                        // Process message status updates
                        if (value.statuses && value.statuses.length > 0) {
                            for (const status of value.statuses) {
                                await processMessageStatus(supabase, status);
                            }
                        }
                    }
                }
            }

            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response('Method not allowed', { status: 405 });
    } catch (error) {
        console.error('❌ Error processing webhook:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
});

async function processIncomingMessage(supabase: any, message: any, contact: any, metadata: any) {
    try {
        const phoneNumber = message.from;
        const messageText = message.text?.body || '[Media]';
        const messageType = message.type;
        const timestamp = new Date(parseInt(message.timestamp) * 1000).toISOString();

        console.log(`📱 Processing message from ${phoneNumber}: ${messageText}`);

        // 1. Find or create contact
        let contactRecord = await findOrCreateContact(supabase, phoneNumber, contact?.profile?.name);

        // 2. Find or create WhatsApp conversation
        let conversation = await findOrCreateConversation(supabase, contactRecord.id, phoneNumber, metadata);

        // 3. Save the message
        const { error: messageError } = await supabase
            .from('whatsapp_messages')
            .insert({
                conversation_id: conversation.id,
                message_id: message.id,
                from_number: phoneNumber,
                to_number: metadata?.display_phone_number,
                message_type: messageType,
                content: messageText,
                direction: 'inbound',
                status: 'received',
                timestamp: timestamp,
                raw_data: message,
            });

        if (messageError) {
            console.error('❌ Error saving message:', messageError);
        } else {
            console.log('✅ Message saved successfully');
        }

        // 4. Create activity log
        await supabase.from('activities').insert({
            contact_id: contactRecord.id,
            type: 'whatsapp_message',
            description: `Mensaje recibido: ${messageText.substring(0, 50)}...`,
            metadata: { message_id: message.id, conversation_id: conversation.id },
        });

        // BOT LOGIC: Check if bot is active for this conversation
        if (conversation.bot_active) {
            // If welcome hasn't been sent, send it
            if (!conversation.welcome_sent) {
                await sendWelcomeMenu(supabase, phoneNumber, conversation.id, metadata);
            }
            // If welcome was sent, check if this is a menu response
            else {
                const wasMenuResponse = await handleMenuResponse(
                    supabase,
                    messageText,
                    phoneNumber,
                    conversation.id,
                    metadata
                );

                if (!wasMenuResponse) {
                    console.log('📝 Not a menu option - message saved, bot still active');
                }
            }
        } else {
            console.log('🤖 Bot is inactive - Human handling conversation');
        }

        // 6. Check and run automations
        await checkAutomations(supabase, contactRecord.id, 'new_lead');

    } catch (error) {
        console.error('❌ Error processing incoming message:', error);
    }
}

async function findOrCreateContact(supabase: any, phoneNumber: string, name?: string) {
    // Try to find existing contact
    const { data: existing } = await supabase
        .from('contacts')
        .select('*')
        .eq('phone', phoneNumber)
        .single();

    if (existing) {
        console.log('✅ Contact found:', existing.id);
        return existing;
    }

    // Create new contact
    const { data: newContact, error } = await supabase
        .from('contacts')
        .insert({
            name: name || `WhatsApp ${phoneNumber}`,
            phone: phoneNumber,
            source: 'whatsapp',
            status: 'new',
        })
        .select()
        .single();

    if (error) {
        console.error('❌ Error creating contact:', error);
        throw error;
    }

    console.log('✅ New contact created:', newContact.id);
    return newContact;
}

async function findOrCreateConversation(supabase: any, contactId: string, phoneNumber: string, metadata: any) {
    // Try to find existing conversation - SELECT ALL COLUMNS
    const { data: existing } = await supabase
        .from('whatsapp_conversations')
        .select('*')
        .eq('contact_id', contactId)
        .eq('status', 'open')
        .single();

    if (existing) {
        console.log('✅ Conversation found:', existing.id);
        console.log('Bot active:', existing.bot_active);
        console.log('Welcome sent:', existing.welcome_sent);
        return existing;
    }

    // Create new conversation with bot columns
    const { data: newConversation, error } = await supabase
        .from('whatsapp_conversations')
        .insert({
            contact_id: contactId,
            phone_number: phoneNumber,
            status: 'open',
            last_message_at: new Date().toISOString(),
            metadata: metadata,
            bot_active: true,
            welcome_sent: false,
        })
        .select()
        .single();

    if (error) {
        console.error('❌ Error creating conversation:', error);
        throw error;
    }

    console.log('✅ New conversation created:', newConversation.id);
    return newConversation;
}

async function processMessageStatus(supabase: any, status: any) {
    try {
        const { error } = await supabase
            .from('whatsapp_messages')
            .update({
                status: status.status,
                updated_at: new Date().toISOString(),
            })
            .eq('message_id', status.id);

        if (error) {
            console.error('❌ Error updating message status:', error);
        } else {
            console.log(`✅ Message status updated: ${status.id} -> ${status.status}`);
        }
    } catch (error) {
        console.error('❌ Error processing message status:', error);
    }
}

async function checkAutomations(supabase: any, contactId: string, trigger: string) {
    try {
        const { data: automations } = await supabase
            .from('automations')
            .select('*')
            .eq('trigger_type', trigger)
            .eq('is_active', true);

        if (!automations || automations.length === 0) {
            return;
        }

        console.log(`🤖 Found ${automations.length} automations for trigger: ${trigger}`);

        for (const automation of automations) {
            for (const action of automation.actions || []) {
                if (action.type === 'create_task') {
                    await supabase.from('tasks').insert({
                        contact_id: contactId,
                        title: action.config.title || 'Tarea automática',
                        description: action.config.description || '',
                        status: 'pending',
                        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    });
                    console.log('✅ Task created by automation');
                }
            }
        }
    } catch (error) {
        console.error('❌ Error checking automations:', error);
    }
}

// =============================================
// BOT FUNCTIONS
// =============================================

async function sendWelcomeMenu(supabase: any, to: string, conversationId: string, metadata: any) {
    const welcomeMessage = `¡Hola! Bienvenido Turbo Brand agencia de marketing 5.0! Cuéntanos en qué tipo de servicio te encuentras interesado el día de hoy?

1. Pauta Digital
2. Curso Personalizado Marketing Digital
3. Creación Página Web
4. CRM
5. Consultoría
6. Otro

En un momento, uno de nuestros asesores se estará comunicando para darte una asesoría completa`;

    await sendWhatsAppMessage(to, welcomeMessage, metadata);

    // Save bot message to database so it appears in CRM
    await supabase.from('whatsapp_messages').insert({
        conversation_id: conversationId,
        from_number: metadata?.phone_number_id || 'bot',
        to_number: to,
        message_type: 'text',
        content: welcomeMessage,
        direction: 'outbound',
        status: 'sent',
        timestamp: new Date().toISOString(),
    });

    // Mark welcome as sent
    await supabase
        .from('whatsapp_conversations')
        .update({ welcome_sent: true })
        .eq('id', conversationId);

    console.log('✅ Welcome menu sent');
}

async function handleMenuResponse(supabase: any, messageText: string, to: string, conversationId: string, metadata: any): Promise<boolean> {
    const option = messageText.trim();

    const responses: { [key: string]: string } = {
        '1': 'Perfecto! Un asesor te ayudará con tu pauta digital. En breve nos comunicaremos contigo.',
        '2': 'Excelente! Te contactaremos para personalizar tu curso de marketing digital.',
        '3': 'Genial! Un especialista te asesorará sobre la creación de tu página web.',
        '4': 'Perfecto! Te mostraremos cómo nuestro CRM puede ayudarte.',
        '5': 'Excelente! Agendaremos una consultoría personalizada contigo.',
        '6': 'Gracias por tu interés. Un asesor se comunicará contigo para conocer tus necesidades.',
    };

    if (responses[option]) {
        await sendWhatsAppMessage(to, responses[option], metadata);

        // Save bot response to database
        await supabase.from('whatsapp_messages').insert({
            conversation_id: conversationId,
            from_number: metadata?.phone_number_id || 'bot',
            to_number: to,
            message_type: 'text',
            content: responses[option],
            direction: 'outbound',
            status: 'sent',
            timestamp: new Date().toISOString(),
        });

        // Deactivate bot - human takeover
        await supabase
            .from('whatsapp_conversations')
            .update({ bot_active: false })
            .eq('id', conversationId);

        console.log(`✅ Sent response for option ${option}`);
        console.log('✅ Bot deactivated - Human takeover');
        return true;
    }

    return false; // Not a valid menu option
}

async function sendWhatsAppMessage(to: string, message: string, metadata: any) {
    try {
        const accessToken = Deno.env.get('WHATSAPP_TOKEN');
        const phoneNumberId = metadata?.phone_number_id;

        if (!accessToken || !phoneNumberId) {
            console.error('❌ Missing WhatsApp credentials');
            console.error('Access Token:', accessToken ? 'Present' : 'Missing');
            console.error('Phone Number ID:', phoneNumberId || 'Missing');
            return;
        }

        const response = await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: to,
                type: 'text',
                text: { body: message }
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ WhatsApp message sent successfully:', data);
        } else {
            console.error('❌ Failed to send WhatsApp message:', data);
        }
    } catch (error) {
        console.error('❌ Error sending WhatsApp message:', error);
    }
}
