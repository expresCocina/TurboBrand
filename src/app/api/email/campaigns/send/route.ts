import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Inicializar cliente Supabase (usando Service Role para saltar RLS si es necesario, 
// aunque aquí usaremos las variables públicas por simplicidad, idealmente usar SERVICE_ROLE en backend real)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { campaign_id, name, subject, content, organization_id, segment_id } = body;

        let campaignData: any;
        let campaignId: string | null = campaign_id || null;

        // Si viene campaign_id, es una campaña programada ejecutada por el cron
        if (campaign_id) {
            const { data, error } = await supabase
                .from('email_campaigns')
                .select('*')
                .eq('id', campaign_id)
                .single();

            if (error || !data) {
                return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
            }

            campaignData = data;
        } else {
            // Envío inmediato, usar datos del body
            campaignData = { name, subject, content, segment_id, organization_id };
        }

        if (!campaignData.subject || !campaignData.content) {
            return NextResponse.json({ error: 'Faltan datos requeridos (Asunto o Contenido)' }, { status: 400 });
        }

        // 1. Obtener destinatarios (Contactos con email)
        let contacts: { email: string; name: string; company?: string }[] = [];

        const segmentId = campaignData.segment_id || segment_id;

        if (segmentId) {
            // Si hay segmento, obtener solo contactos de ese segmento
            const { data: segmentMembers, error: segmentError } = await supabase
                .from('contact_segment_members')
                .select('contact_id, contacts(email, name, company)')
                .eq('segment_id', segmentId);

            if (segmentError) throw segmentError;

            contacts = (segmentMembers || [])
                .map((sm: any) => sm.contacts)
                .filter((c: any) => c && c.email) as { email: string; name: string; company?: string }[];
        } else {
            // Si no hay segmento, obtener todos los contactos
            const { data: allContacts, error: contactsError } = await supabase
                .from('contacts')
                .select('email, name, company')
                .not('email', 'is', null);

            if (contactsError) throw contactsError;
            contacts = allContacts || [];
        }

        if (!contacts || contacts.length === 0) {
            return NextResponse.json({ error: 'No hay contactos con email para enviar.' }, { status: 400 });
        }

        // Validar límite mensual
        const orgId = campaignData.organization_id || organization_id || '5e5b7400-1a66-42dc-880e-e501021edadc';

        // Obtener límite mensual de la organización
        const { data: org, error: orgError } = await supabase
            .from('organizations')
            .select('email_monthly_limit')
            .eq('id', orgId)
            .single();

        if (orgError) {
            console.error('Error obteniendo organización:', orgError);
        }

        const monthlyLimit = org?.email_monthly_limit || 2000;

        // Contar emails enviados este mes
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const { data: monthlyCount, error: countError } = await supabase
            .rpc('get_monthly_email_count', {
                p_organization_id: orgId,
                p_month: currentMonth,
                p_year: currentYear
            });

        if (countError) {
            console.error('Error contando emails mensuales:', countError);
        }

        const emailsSentThisMonth = monthlyCount || 0;
        const emailsToSend = contacts.length;

        console.log(`📊 Límite mensual: ${emailsSentThisMonth}/${monthlyLimit} emails enviados este mes`);
        console.log(`📧 Intentando enviar: ${emailsToSend} emails`);

        // Verificar si excede el límite
        if (emailsSentThisMonth + emailsToSend > monthlyLimit) {
            const remaining = monthlyLimit - emailsSentThisMonth;
            return NextResponse.json({
                error: `Límite mensual excedido. Has enviado ${emailsSentThisMonth}/${monthlyLimit} emails este mes. Solo puedes enviar ${remaining} más.`,
                sent: emailsSentThisMonth,
                limit: monthlyLimit,
                remaining: remaining
            }, { status: 403 });
        }

        // 2. Registrar/Actualizar la campaña en Base de Datos
        let campaign: any;

        if (campaignId) {
            // Si viene campaign_id, actualizar status a 'sending'
            const { data, error: updateError } = await supabase
                .from('email_campaigns')
                .update({ status: 'sending', sent_at: new Date().toISOString() })
                .eq('id', campaignId)
                .select()
                .single();

            if (updateError) throw updateError;
            campaign = data;
        } else {
            // Crear nueva campaña
            const { data, error: campaignError } = await supabase
                .from('email_campaigns')
                .insert([{
                    name: campaignData.name || campaignData.subject,
                    subject: campaignData.subject,
                    content: campaignData.content,
                    status: 'sending',
                    organization_id: orgId,
                    sent_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (campaignError) throw campaignError;
            campaign = data;
        }

        if (!campaign) {
            throw new Error('Error registrando campaña en la base de datos');
        }

        // 3. Enviar Emails con Resend
        // NOTA IMPORTANTE: El plan gratuito de Resend tiene límite de ritmo (rate limit).
        // Para producción real con muchos usuarios, se debe usar 'batch' o una cola (Queue).
        // Aquí haremos un loop simple, pero limitando para no explotar.

        let sentCount = 0;
        let failedCount = 0;

        // Limite de seguridad temporal: enviar solo a los primeros 20 para probar sin gastar quota
        // TODO: Remover slice para prod
        const contactsToSend = contacts;

        // Resend soporta Batch Sending de hasta 100 emails por request. Usemos eso.
        // Mapeamos contactos al formato de Resend Batch

        const emailBatch = contactsToSend.map(contact => {
            // Reemplazo simple de variables
            let personalizedHtml = campaignData.content
                .replace(/{{nombre}}/g, contact.name || 'Cliente')
                .replace(/{{email}}/g, contact.email)
                .replace(/{{empresa}}/g, contact.company || 'su empresa'); // Asumiendo que el contacto puede tener empresa, si no fallback

            let personalizedSubject = campaignData.subject
                .replace(/{{nombre}}/g, contact.name || 'Cliente');

            return {
                from: 'Turbo Brand <crm@turbobrandcol.com>',
                replyTo: 'gerencia@turbobrandcol.com', // Respuestas van a gerencia
                to: contact.email,
                subject: personalizedSubject,
                html: personalizedHtml,
                headers: {
                    'X-Priority': '3', // Prioridad normal para campañas
                    'X-Mailer': 'Turbo Brand CRM',
                    'List-Unsubscribe': '<mailto:gerencia@turbobrandcol.com?subject=unsubscribe>',
                    'Precedence': 'bulk',
                },
            };
        });

        // Enviar en lotes de 50 emails (Resend limita a 100 por batch)
        const BATCH_SIZE = 50;
        const batches = [];

        for (let i = 0; i < emailBatch.length; i += BATCH_SIZE) {
            batches.push(emailBatch.slice(i, i + BATCH_SIZE));
        }

        console.log(`📦 Dividiendo ${emailBatch.length} emails en ${batches.length} lotes de máximo ${BATCH_SIZE}`);

        let allBatchResults: any[] = [];
        let batchIndex = 0;

        for (const batch of batches) {
            batchIndex++;
            console.log(`📧 Enviando lote ${batchIndex}/${batches.length} (${batch.length} emails)...`);

            const { data: batchData, error: batchError } = await resend.batch.send(batch);

            if (batchError) {
                console.error(`❌ Error en lote ${batchIndex}:`, batchError);
                // Continuar con los siguientes lotes en lugar de fallar completamente
                failedCount += batch.length;
                continue;
            }

            console.log(`✅ Lote ${batchIndex} enviado exitosamente`);

            if (batchData && batchData.data) {
                allBatchResults = allBatchResults.concat(batchData.data);
                sentCount += batchData.data.length;
            }

            // Pequeña pausa entre lotes para evitar rate limiting
            if (batchIndex < batches.length) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo
            }
        }

        console.log(`📊 Resumen: ${sentCount} enviados, ${failedCount} fallidos`);

        // 4. Guardar cada email enviado en email_sends con su ID de Resend
        if (allBatchResults.length > 0) {
            console.log(`💾 [SEND] Guardando ${allBatchResults.length} emails en email_sends...`);

            const emailSendsRecords = allBatchResults.map((item: any, index: number) => {
                const record = {
                    campaign_id: campaign.id,
                    contact_email: contactsToSend[index].email,
                    resend_id: item.id, // ID único de Resend para este email
                    status: 'sent',
                    sent_at: new Date().toISOString()
                };
                return record;
            });

            console.log(`🔄 [SEND] Insertando ${emailSendsRecords.length} registros en Supabase...`);

            const { error: sendsError } = await supabase
                .from('email_sends')
                .insert(emailSendsRecords);

            if (sendsError) {
                console.error('❌ [SEND] Error guardando email_sends:', sendsError);
                console.error('❌ [SEND] Detalles del error:', JSON.stringify(sendsError, null, 2));
                // No fallar todo por esto, pero loguear
            } else {
                console.log(`✅ [SEND] ${emailSendsRecords.length} emails guardados exitosamente en email_sends`);
            }
        }

        // 5. Actualizar estado de campaña a 'sent' y contador total_sent
        await supabase
            .from('email_campaigns')
            .update({
                status: 'sent',
                total_sent: contactsToSend.length
            })
            .eq('id', campaign.id);

        return NextResponse.json({
            success: true,
            message: `Campaña enviada a ${sentCount} de ${contactsToSend.length} contactos.`,
            campaignId: campaign.id,
            sent: sentCount,
            failed: failedCount
        });

    } catch (error: any) {
        console.error('Error en API Send:', error);
        return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
    }
}
