
import { SupabaseClient } from '@supabase/supabase-js';

export async function checkAndRunAutomations(
    triggerType: string,
    payload: any,
    supabase: SupabaseClient
) {
    console.log(`🤖 Checking automations for: ${triggerType}`, payload);

    try {
        // 1. Buscar automatizaciones activas para este trigger
        const { data: automations, error } = await supabase
            .from('automations')
            .select('*')
            .eq('is_active', true)
            .eq('trigger_type', triggerType);

        if (error) {
            console.error('Error fetching automations:', error);
            return;
        }

        if (!automations || automations.length === 0) {
            console.log('No active automations found.');
            return;
        }

        console.log(`Found ${automations.length} automations to run.`);

        // 2. Ejecutar acciones por cada automatización encontrada
        for (const auto of automations) {
            console.log(`▶️ Running automation: ${auto.name}`);

            // Registrar ejecución (opcional, para stats)
            // await supabase.from('automation_logs').insert({...}) 

            // Registrar ejecución (opcional, para stats)
            // await supabase.from('automation_logs').insert({...})

            for (const action of auto.actions) {
                await executeAction(action, payload, supabase, auto.organization_id);
            }
        }

    } catch (err) {
        console.error('Unexpected error running automations:', err);
    }
}

async function executeAction(
    action: { type: string; config?: any },
    payload: any,
    supabase: SupabaseClient,
    organizationId: string
) {
    console.log(`  ⚡ Executing Action: ${action.type}`);

    try {
        switch (action.type) {
            case 'create_task':
                // Crear una tarea relacionada al contacto u oportunidad
                const targetOrgId = payload.organization_id || organizationId;

                // Determinar si es contacto u oportunidad basado en campos
                const isOpportunity = !!payload.title;
                const relatedType = isOpportunity ? 'opportunity' : 'contact';
                const relatedId = payload.id;

                // Construir título y descripción dinámicos
                const taskTitle = isOpportunity
                    ? `Tarea Automática: ${payload.title}`
                    : `Tarea Automática: ${payload.name || 'Nuevo Contacto'}`;

                const taskDesc = isOpportunity
                    ? `Tarea generada por oportunidad en etapa: ${payload.stage || 'Nuevos Leads'}`
                    : `Tarea generada por nuevo lead: ${payload.email || payload.phone || payload.name}`;

                // Fecha de vencimiento: mañana
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);

                const { error: taskError } = await supabase.from('tasks').insert([{
                    title: taskTitle,
                    description: taskDesc,
                    priority: 'medium',
                    status: 'pending',
                    related_to_type: relatedType,
                    related_to_id: relatedId,
                    organization_id: targetOrgId,
                    due_date: tomorrow.toISOString()
                }]);

                if (taskError) {
                    console.error('❌ Error creating task from automation:', taskError);
                } else {
                    console.log('✅ Task created successfully');
                }
                break;

            case 'send_email':
                // TODO: Implementar envío de email real
                console.log('  📧 (Simulated) Sending email to:', payload.email);
                await supabase.from('activities').insert([{
                    type: 'email_sent',
                    description: 'Email enviado por automatización',
                    contact_id: payload.id,
                    metadata: { simulated: true },
                    organization_id: organizationId // Si la tabla activities tiene org_id
                }]);
                break;

            case 'send_whatsapp':
                // TODO: Llamar API de WhatsApp
                console.log('  💬 (Simulated) Sending WhatsApp to:', payload.phone);
                break;

            default:
                console.warn(`  ⚠️ Unknown action type: ${action.type}`);
        }
    } catch (err) {
        console.error(`Error executing action ${action.type}:`, err);
    }
}
