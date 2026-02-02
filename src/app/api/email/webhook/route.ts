import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        const type = payload.type;
        const data = payload.data;

        console.log(`[WEBHOOK] Evento recibido: ${type}`, data);

        // Extraer el ID de Resend del evento
        const resendEmailId = data?.email_id || data?.id;

        if (!resendEmailId) {
            console.warn('[WEBHOOK] No se encontró email_id en el payload');
            return NextResponse.json({ received: true }, { status: 200 });
        }

        // Buscar el email en nuestra tabla email_sends
        const { data: emailSend, error: findError } = await supabase
            .from('email_sends')
            .select('campaign_id')
            .eq('resend_id', resendEmailId)
            .single();

        if (findError || !emailSend) {
            console.warn(`[WEBHOOK] No se encontró email_send para resend_id: ${resendEmailId}`);
            return NextResponse.json({ received: true }, { status: 200 });
        }

        const campaignId = emailSend.campaign_id;

        // Actualizar contadores según el tipo de evento
        let updateField: string | null = null;

        switch (type) {
            case 'email.delivered':
                updateField = 'total_delivered';
                break;
            case 'email.opened':
                updateField = 'total_opened';
                break;
            case 'email.clicked':
                updateField = 'total_clicked';
                break;
            case 'email.bounced':
                updateField = 'total_bounced';
                break;
            case 'email.complained':
                updateField = 'total_complained';
                break;
            default:
                console.log(`[WEBHOOK] Evento no rastreado: ${type}`);
        }

        if (updateField && campaignId) {
            // Incrementar el contador usando SQL directo
            const { error: updateError } = await supabase.rpc('increment_email_counter', {
                p_campaign_id: campaignId,
                p_field: updateField
            });

            if (updateError) {
                console.error(`[WEBHOOK] Error incrementando ${updateField}:`, updateError);
                // Fallback: hacer update manual
                const { data: campaign } = await supabase
                    .from('email_campaigns')
                    .select(updateField)
                    .eq('id', campaignId)
                    .single();

                if (campaign) {
                    const currentValue = campaign[updateField] || 0;
                    await supabase
                        .from('email_campaigns')
                        .update({ [updateField]: currentValue + 1 })
                        .eq('id', campaignId);
                }
            } else {
                console.log(`[WEBHOOK] ✅ Incrementado ${updateField} para campaña ${campaignId}`);
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: any) {
        console.error('[WEBHOOK] Error procesando:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
