// Prueba de configuración de Resend
import { resend, isResendConfigured, sendEmail } from '@/lib/resend';

export async function GET() {
    try {
        // Verificar si Resend está configurado
        if (!isResendConfigured()) {
            return Response.json(
                { error: 'Resend no está configurado. Verifica tu RESEND_API_KEY en .env.local' },
                { status: 500 }
            );
        }

        // Enviar email de prueba
        const result = await sendEmail({
            to: 'test@example.com', // Cambia esto por tu email para probar
            subject: '✅ Resend configurado correctamente - Turbo Brand CRM',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #9E0060;">¡Resend está funcionando! 🎉</h1>
          <p>Este es un email de prueba desde el CRM de Turbo Brand.</p>
          <p><strong>Configuración:</strong></p>
          <ul>
            <li>Dominio: turbobrandcol.com</li>
            <li>Email: noreply@turbobrandcol.com</li>
            <li>Estado: ✅ Activo</li>
          </ul>
          <p>Ya puedes enviar emails desde el CRM.</p>
        </div>
      `,
            tags: [
                { name: 'type', value: 'test' },
            ],
        });

        return Response.json({
            success: true,
            message: 'Email de prueba enviado correctamente',
            result,
        });
    } catch (error: any) {
        console.error('Error en prueba de Resend:', error);
        return Response.json(
            {
                error: 'Error al enviar email de prueba',
                details: error.message
            },
            { status: 500 }
        );
    }
}
