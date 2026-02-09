import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const resend = new Resend(process.env.RESEND_API_KEY);

// Email forwarding configuration
const EMAIL_FORWARDING_RULES = {
    'gerencia@turbobrandcol.com': 'damo.marin@gmail.com',
    // Puedes agregar más reglas aquí:
    // 'ventas@turbobrandcol.com': 'damo.marin@gmail.com',
    // 'soporte@turbobrandcol.com': 'damo.marin@gmail.com',
};

export async function POST(req: Request) {
    console.log('🔔 [WEBHOOK] Iniciando procesamiento...');

    try {
        const payload = await req.json();
        console.log('📦 [WEBHOOK] Payload completo:', JSON.stringify(payload, null, 2));

        const type = payload.type;
        const data = payload.data;

        console.log(`📨 [WEBHOOK] Tipo de evento: ${type}`);

        // ========================================
        // NUEVO: Manejo de emails recibidos (forwarding)
        // ========================================
        if (type === 'email.received') {
            console.log('📬 [WEBHOOK] Email recibido - procesando forwarding...');
            console.log('📦 [WEBHOOK] Data completa:', JSON.stringify(data, null, 2));

            const to = data?.to?.[0]; // Email de destino original
            const from = data?.from;
            const subject = data?.subject;
            const html = data?.html;
            const text = data?.text;

            console.log(`📧 [WEBHOOK] De: ${from}, Para: ${to}, Asunto: ${subject}`);
            console.log(`🔍 [WEBHOOK] Reglas disponibles:`, Object.keys(EMAIL_FORWARDING_RULES));

            // Verificar si hay una regla de forwarding para este destinatario
            const forwardTo = EMAIL_FORWARDING_RULES[to as keyof typeof EMAIL_FORWARDING_RULES];

            console.log(`🎯 [WEBHOOK] Buscando regla para: "${to}"`);
            console.log(`🎯 [WEBHOOK] Regla encontrada: "${forwardTo || 'NINGUNA'}"`);

            if (forwardTo) {
                console.log(`🔄 [WEBHOOK] Reenviando email de ${to} a ${forwardTo}`);

                try {
                    // Formato simple para evitar la pestaña de Promociones en Gmail
                    const plainTextBody = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 EMAIL REENVIADO AUTOMÁTICAMENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

De: ${from}
Para: ${to}
Asunto: ${subject}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MENSAJE ORIGINAL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${text || html?.replace(/<[^>]*>/g, '') || 'Sin contenido'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Este email fue reenviado automáticamente desde ${to}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    `.trim();

                    const { data: forwardData, error: forwardError } = await resend.emails.send({
                        from: 'Gerencia Turbo Brand <gerencia@turbobrandcol.com>', // Nombre + email
                        replyTo: from, // Responder al remitente original
                        to: forwardTo,
                        subject: `FWD: ${subject}`, // Formato estándar de reenvío
                        text: plainTextBody,
                        // Usar HTML minimalista sin estilos promocionales
                        html: `<pre style="font-family: monospace; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${plainTextBody}</pre>`,
                        headers: {
                            'X-Priority': '1', // Alta prioridad
                            'Importance': 'high',
                            'X-Auto-Response-Suppress': 'OOF, AutoReply',
                            'X-Mailer': 'Turbo Brand CRM',
                            'List-Unsubscribe': '<mailto:gerencia@turbobrandcol.com?subject=unsubscribe>',
                            'Precedence': 'bulk',
                        },
                    });

                    if (forwardError) {
                        console.error('❌ [WEBHOOK] Error reenviando email:', forwardError);
                        return NextResponse.json({
                            received: true,
                            error: 'forward_failed',
                            details: forwardError
                        }, { status: 200 });
                    }

                    console.log('✅ [WEBHOOK] Email reenviado exitosamente:', forwardData);
                    return NextResponse.json({
                        received: true,
                        forwarded: true,
                        forward_id: forwardData?.id
                    }, { status: 200 });

                } catch (forwardError: any) {
                    console.error('❌ [WEBHOOK] Error crítico reenviando:', forwardError);
                    return NextResponse.json({
                        received: true,
                        error: 'forward_exception',
                        message: forwardError.message
                    }, { status: 200 });
                }
            } else {
                console.log(`ℹ️ [WEBHOOK] No hay regla de forwarding para ${to}`);
                return NextResponse.json({
                    received: true,
                    info: 'no_forwarding_rule',
                    to_address: to
                }, { status: 200 });
            }
        }

        // ========================================
        // EXISTENTE: Manejo de eventos de campañas
        // ========================================
        const resendEmailId = data?.email_id;
        console.log(`🔍 [WEBHOOK] Email ID extraído: ${resendEmailId}`);

        if (!resendEmailId) {
            console.warn('⚠️ [WEBHOOK] No se encontró email_id en el payload');
            return NextResponse.json({ received: true, warning: 'no email_id' }, { status: 200 });
        }

        // Buscar el email en nuestra tabla email_sends
        console.log(`🔎 [WEBHOOK] Buscando en DB: resend_id = ${resendEmailId}`);

        const { data: emailSend, error: findError } = await supabase
            .from('email_sends')
            .select('campaign_id')
            .eq('resend_id', resendEmailId)
            .single();

        if (findError) {
            console.error(`❌ [WEBHOOK] Error buscando email_send:`, findError);
            return NextResponse.json({ received: true, error: 'db_error' }, { status: 200 });
        }

        if (!emailSend) {
            console.warn(`⚠️ [WEBHOOK] No se encontró email_send para resend_id: ${resendEmailId}`);
            return NextResponse.json({ received: true, warning: 'email_not_found' }, { status: 200 });
        }

        const campaignId = emailSend.campaign_id;
        console.log(`📋 [WEBHOOK] Campaign ID encontrado: ${campaignId}`);

        // Determinar qué campo actualizar
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
                console.log(`ℹ️ [WEBHOOK] Evento no rastreado: ${type}`);
                return NextResponse.json({ received: true, info: 'event_not_tracked' }, { status: 200 });
        }

        console.log(`🎯 [WEBHOOK] Campo a actualizar: ${updateField}`);

        if (updateField && campaignId) {
            // Intentar con la función RPC primero
            console.log(`🔄 [WEBHOOK] Intentando incrementar con RPC...`);
            const { error: rpcError } = await supabase.rpc('increment_email_counter', {
                p_campaign_id: campaignId,
                p_field: updateField
            });

            if (rpcError) {
                console.error(`❌ [WEBHOOK] Error en RPC:`, rpcError);
                console.log(`🔄 [WEBHOOK] Intentando actualización manual...`);

                // Fallback: actualización manual
                const { data: campaign } = await supabase
                    .from('email_campaigns')
                    .select(updateField)
                    .eq('id', campaignId)
                    .single();

                if (campaign) {
                    const currentValue = (campaign as any)[updateField] || 0;
                    const newValue = currentValue + 1;

                    console.log(`📊 [WEBHOOK] Valor actual: ${currentValue}, nuevo: ${newValue}`);

                    const { error: updateError } = await supabase
                        .from('email_campaigns')
                        .update({ [updateField]: newValue })
                        .eq('id', campaignId);

                    if (updateError) {
                        console.error(`❌ [WEBHOOK] Error en update manual:`, updateError);
                        return NextResponse.json({ received: true, error: 'update_failed' }, { status: 200 });
                    }

                    console.log(`✅ [WEBHOOK] Actualizado manualmente ${updateField} = ${newValue}`);
                } else {
                    console.error(`❌ [WEBHOOK] No se encontró la campaña ${campaignId}`);
                    return NextResponse.json({ received: true, error: 'campaign_not_found' }, { status: 200 });
                }
            } else {
                console.log(`✅ [WEBHOOK] Incrementado con RPC: ${updateField} para campaña ${campaignId}`);
            }
        }

        console.log(`🎉 [WEBHOOK] Procesamiento completado exitosamente`);
        return NextResponse.json({ received: true, success: true }, { status: 200 });

    } catch (error: any) {
        console.error('💥 [WEBHOOK] Error crítico:', error);
        console.error('💥 [WEBHOOK] Stack:', error.stack);
        return NextResponse.json({
            received: true,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
