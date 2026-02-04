import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';

serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        const { to, message, conversationId } = await req.json();

        if (!to || !message) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: to, message' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
        const WHATSAPP_PHONE_ID = Deno.env.get('WHATSAPP_PHONE_ID');

        if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
            throw new Error('Missing WhatsApp credentials in environment variables');
        }

        // Send message via WhatsApp API
        const response = await fetch(
            `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: to,
                    type: 'text',
                    text: {
                        body: message,
                    },
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error('❌ WhatsApp API error:', result);
            return new Response(
                JSON.stringify({ error: 'Failed to send message', details: result }),
                { status: response.status, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.log('✅ Message sent successfully:', result);

        // Save message to database
        if (conversationId) {
            const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
            const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
            const supabase = createClient(supabaseUrl, supabaseKey);

            await supabase.from('whatsapp_messages').insert({
                conversation_id: conversationId,
                message_id: result.messages[0].id,
                from_number: WHATSAPP_PHONE_ID,
                to_number: to,
                message_type: 'text',
                content: message,
                direction: 'outbound', // Messages sent by us are outbound
                status: 'sent',
                timestamp: new Date().toISOString(),
                raw_data: result,
            });

            // Update conversation last_message_at
            await supabase
                .from('whatsapp_conversations')
                .update({ last_message_at: new Date().toISOString() })
                .eq('id', conversationId);
        }

        return new Response(
            JSON.stringify({ success: true, messageId: result.messages[0].id }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('❌ Error sending message:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
});
