import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    try {
        // Crear cliente Supabase con Service Role Key para saltar RLS
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        console.log('🔍 Buscando campañas programadas...')

        // 1. Obtener campañas programadas cuya hora ya pasó
        const now = new Date().toISOString()

        const { data: campaigns, error } = await supabase
            .from('email_campaigns')
            .select('*')
            .eq('status', 'scheduled')
            .lte('scheduled_at', now)
            .limit(10) // Procesar máximo 10 por ejecución

        if (error) {
            console.error('❌ Error obteniendo campañas:', error)
            throw error
        }

        console.log(`📧 Encontradas ${campaigns?.length || 0} campañas para procesar`)

        if (!campaigns || campaigns.length === 0) {
            return new Response(
                JSON.stringify({
                    message: 'No hay campañas programadas para procesar',
                    processed: 0
                }),
                { headers: { 'Content-Type': 'application/json' } }
            )
        }

        // 2. Procesar cada campaña
        const results = []

        for (const campaign of campaigns) {
            try {
                console.log(`📤 Procesando campaña: ${campaign.name} (ID: ${campaign.id})`)

                // Obtener la URL base desde las variables de entorno
                const baseUrl = Deno.env.get('BASE_URL') || 'http://localhost:3000'

                // Llamar al endpoint de envío
                const response = await fetch(`${baseUrl}/api/email/campaigns/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
                    },
                    body: JSON.stringify({
                        campaign_id: campaign.id,
                        name: campaign.name,
                        subject: campaign.subject,
                        content: campaign.content,
                        segment_id: campaign.segment_id,
                        organization_id: campaign.organization_id
                    })
                })

                const result = await response.json()

                if (response.ok) {
                    console.log(`✅ Campaña ${campaign.id} procesada exitosamente`)
                    results.push({
                        campaign_id: campaign.id,
                        campaign_name: campaign.name,
                        success: true,
                        result
                    })
                } else {
                    console.error(`❌ Error procesando campaña ${campaign.id}:`, result)
                    results.push({
                        campaign_id: campaign.id,
                        campaign_name: campaign.name,
                        success: false,
                        error: result.error
                    })
                }

            } catch (err) {
                console.error(`❌ Excepción procesando campaña ${campaign.id}:`, err)
                results.push({
                    campaign_id: campaign.id,
                    campaign_name: campaign.name,
                    success: false,
                    error: err.message
                })
            }
        }

        const successCount = results.filter(r => r.success).length
        const failCount = results.filter(r => !r.success).length

        console.log(`✅ Procesamiento completado: ${successCount} exitosas, ${failCount} fallidas`)

        return new Response(
            JSON.stringify({
                processed: campaigns.length,
                success: successCount,
                failed: failCount,
                results
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        console.error('❌ Error en Edge Function:', error)
        return new Response(
            JSON.stringify({
                error: error.message,
                stack: error.stack
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        )
    }
})
