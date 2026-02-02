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
        const { name, subject, content, organization_id } = body;

        if (!subject || !content) {
            return NextResponse.json({ error: 'Faltan datos requeridos (Asunto o Contenido)' }, { status: 400 });
        }

        // 1. Obtener destinatarios (Contactos con email)
        const { data: contacts, error: contactsError } = await supabase
            .from('contacts')
            .select('email, name')
            .not('email', 'is', null);

        if (contactsError) throw contactsError;

        if (!contacts || contacts.length === 0) {
            return NextResponse.json({ error: 'No hay contactos con email para enviar.' }, { status: 400 });
        }

        // 2. Registrar la campaña en Base de Datos (Tabla 'email_campaigns')
        // Primero verificamos si existe la tabla, si no, fallará y lo veremos en logs.
        // Asumimos que la tabla fue creada con el script SQL previo.

        const { data: campaign, error: campaignError } = await supabase
            .from('email_campaigns')
            .insert([{
                name: name || subject, // Fallback name
                subject: subject,
                content: content,
                status: 'sending',
                organization_id: organization_id || '5e5b7400-1a66-42dc-880e-e501021edadc', // Default Org ID
                sent_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (campaignError) {
            console.error('Error creando campaña DB:', campaignError);
            // Si falla DB, detenemos el envío para no perder historial? 
            // O seguimos? Mejor fallar para consistencia.
            throw new Error(`Error registrando campaña: ${campaignError.message}`);
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

        const emailBatch = contactsToSend.map(contact => ({
            from: 'Turbo Brand CRM <crm@turbobrandcol.com>',
            to: contact.email,
            subject: subject,
            html: content,
        }));

        // Enviar en lotes de 100 (aunque aquí enviamos todo de una si es menos de 100)
        // Usamos el dominio de pruebas de Resend: onboarding@resend.dev 
        // IMPORTANTE: En modo Test de Resend, SOLO se puede enviar al email con el que te registraste.
        // Si intentas enviar a otros, fallará (o no llegará).

        // Intentaremos enviar.
        const { data: batchData, error: batchError } = await resend.batch.send(emailBatch);

        if (batchError) {
            console.error('Error Resend Batch:', batchError);
            // Actualizar estado a fallido
            await supabase
                .from('email_campaigns')
                .update({ status: 'failed' })
                .eq('id', campaign.id);

            throw batchError;
        }

        console.log('📧 [SEND] Respuesta de Resend Batch:', JSON.stringify(batchData, null, 2));

        // 4. Guardar cada email enviado en email_sends con su ID de Resend
        if (batchData && batchData.data) {
            console.log(`💾 [SEND] Guardando ${batchData.data.length} emails en email_sends...`);

            const emailSendsRecords = batchData.data.map((item: any, index: number) => {
                const record = {
                    campaign_id: campaign.id,
                    contact_email: contactsToSend[index].email,
                    resend_id: item.id, // ID único de Resend para este email
                    status: 'sent',
                    sent_at: new Date().toISOString()
                };
                console.log(`📝 [SEND] Record ${index + 1}:`, JSON.stringify(record, null, 2));
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
        } else {
            console.warn('⚠️ [SEND] batchData o batchData.data es null/undefined');
            console.warn('⚠️ [SEND] batchData:', batchData);
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
            message: `Campaña enviada a ${contactsToSend.length} contactos.`,
            campaignId: campaign.id,
            resendData: batchData
        });

    } catch (error: any) {
        console.error('Error en API Send:', error);
        return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
    }
}
