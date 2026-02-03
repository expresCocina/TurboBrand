-- Script para ACTUALIZAR plantillas existentes con branding de Turbo Brand
-- Ejecutar en Supabase SQL Editor

-- Actualizar plantilla: Bienvenida
UPDATE email_templates 
SET 
    html_content = '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenida a Turbo Brand</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; background-color: #f8fafc;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    <!-- Header con gradiente Turbo Brand -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
                            <h1 style="margin: 0 0 10px; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: -0.5px;">Turbo Brand</h1>
                            <p style="margin: 0; color: #e0e7ff; font-size: 16px; font-weight: 500;">Impulsamos tu Negocio</p>
                        </td>
                    </tr>
                    
                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="margin: 0 0 20px; color: #1e293b; font-size: 28px; font-weight: 700;">¡Bienvenido, {{nombre}}!</h2>
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #475569;">
                                Estamos emocionados de tenerte con nosotros en <strong style="color: #667eea;">Turbo Brand</strong>. Tu cuenta ha sido creada exitosamente y ya puedes comenzar a disfrutar de todos nuestros servicios premium.
                            </p>
                            <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.7; color: #475569;">
                                Nuestro equipo está aquí para ayudarte a alcanzar tus objetivos. Si tienes alguna pregunta, no dudes en contactarnos.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.4);">
                                        <a href="{{url_inicio}}" style="display: inline-block; padding: 16px 48px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
                                            Comenzar Ahora
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px; font-size: 14px; color: #64748b; font-weight: 500;">
                                <strong>Turbo Brand</strong> | Soluciones Empresariales
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                                © 2026 Turbo Brand. Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>',
    description = 'Plantilla de bienvenida profesional con branding de Turbo Brand',
    updated_at = now()
WHERE name = 'Bienvenida' AND organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc';

-- Actualizar plantilla: Notificación General
UPDATE email_templates 
SET 
    html_content = '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notificación - Turbo Brand</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; background-color: #f8fafc;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <!-- Header minimalista -->
                    <tr>
                        <td style="padding: 40px 40px 30px; border-bottom: 4px solid #667eea;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <h1 style="margin: 0; color: #667eea; font-size: 24px; font-weight: 700;">Turbo Brand</h1>
                            </div>
                            <h2 style="margin: 15px 0 5px; color: #1e293b; font-size: 24px; font-weight: 600;">{{titulo}}</h2>
                            <p style="margin: 0; font-size: 14px; color: #94a3b8;">{{fecha}}</p>
                        </td>
                    </tr>
                    
                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 40px;">
                            <div style="background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%); border-left: 4px solid #667eea; padding: 24px; margin-bottom: 24px; border-radius: 8px;">
                                <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #1e40af; font-weight: 500;">
                                    {{mensaje}}
                                </p>
                            </div>
                            
                            <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6;">
                                Para más información, visita nuestro sitio web o contáctanos directamente. Estamos aquí para ayudarte.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">
                                <strong>Turbo Brand</strong> - Impulsamos tu Negocio
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                                Este es un mensaje automático, por favor no responder.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>',
    description = 'Notificación general con diseño limpio y profesional',
    updated_at = now()
WHERE name = 'Notificación General' AND organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc';

-- Actualizar plantilla: Boletín Mensual
UPDATE email_templates 
SET 
    html_content = '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter - Turbo Brand</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; background-color: #0f172a;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden;">
                    <!-- Header con logo -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 40px; text-align: center;">
                            <h1 style="margin: 0 0 10px; color: #ffffff; font-size: 32px; font-weight: 700;">Turbo Brand</h1>
                            <p style="margin: 0; color: #94a3b8; font-size: 16px; font-weight: 500;">Newsletter {{mes}}</p>
                        </td>
                    </tr>
                    
                    <!-- Artículo 1 -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px; font-weight: 700;">{{titulo_1}}</h2>
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #475569;">
                                {{contenido_1}}
                            </p>
                            <a href="{{link_1}}" style="color: #667eea; text-decoration: none; font-weight: 600; font-size: 15px;">
                                Leer más →
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Separador -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <div style="border-top: 2px solid #e2e8f0;"></div>
                        </td>
                    </tr>
                    
                    <!-- Artículo 2 -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px; font-weight: 700;">{{titulo_2}}</h2>
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #475569;">
                                {{contenido_2}}
                            </p>
                            <a href="{{link_2}}" style="color: #667eea; text-decoration: none; font-weight: 600; font-size: 15px;">
                                Leer más →
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 12px; font-size: 14px; color: #64748b; font-weight: 500;">
                                Síguenos en redes sociales
                            </p>
                            <p style="margin: 0 0 16px; font-size: 13px; color: #64748b;">
                                <strong>Turbo Brand</strong> | Impulsamos tu Negocio
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                                <a href="{{url_cancelar}}" style="color: #94a3b8; text-decoration: underline;">Cancelar suscripción</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>',
    description = 'Newsletter mensual con diseño moderno y profesional',
    updated_at = now()
WHERE name = 'Boletín Mensual' AND organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc';

-- Verificar actualizaciones
SELECT id, name, category, LEFT(html_content, 100) as preview, updated_at
FROM email_templates
WHERE organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc'
ORDER BY category, name;
