-- ============================================
-- PLANTILLAS COMPLIANT - TURBO BRAND
-- ============================================
-- Este script REEMPLAZA todas las plantillas con versiones compliant
-- Incluye: Links a turbobrandcol.com, Unsubscribe, Privacy Policy, Legal Footer

-- PASO 1: Eliminar plantillas antiguas
DELETE FROM email_templates 
WHERE organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc';

-- ============================================
-- PASO 2: Crear plantillas nuevas compliant
-- ============================================

-- 1. BIENVENIDA
INSERT INTO email_templates (organization_id, name, category, subject, html_content, is_active)
VALUES (
    '5e5b7400-1a66-42dc-880e-e501021edadc',
    'Bienvenida',
    'general',
    '¡Bienvenido a Turbo Brand!',
    '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenida</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">¡Bienvenido a Turbo Brand!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                                Hola,
                            </p>
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                                Estamos emocionados de tenerte con nosotros. Gracias por confiar en Turbo Brand para impulsar tu negocio.
                            </p>
                            <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                                Si tienes alguna pregunta, no dudes en contactarnos. Estamos aquí para ayudarte.
                            </p>
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                        <a href="https://www.turbobrandcol.com" style="display: inline-block; padding: 14px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                                            Visitar Nuestro Sitio
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 15px; font-size: 16px; font-weight: 600; color: #1f2937;">Turbo Brand</p>
                            <p style="margin: 0 0 15px; font-size: 14px; color: #6b7280;">Cali, Valle del Cauca, Colombia</p>
                            <p style="margin: 0 0 15px; font-size: 14px;">
                                <a href="https://www.turbobrandcol.com" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Sitio Web</a> |
                                <a href="https://www.turbobrandcol.com/politica-privacidad" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Política de Privacidad</a> |
                                <a href="https://www.turbobrandcol.com/terminos" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Términos</a>
                            </p>
                            <p style="margin: 0 0 15px; font-size: 13px; color: #9ca3af;">
                                ¿No deseas recibir más correos? 
                                <a href="mailto:gerencia@turbobrandcol.com?subject=Darme de baja" style="color: #9ca3af; text-decoration: underline;">Darse de baja</a>
                            </p>
                            <p style="margin: 0 0 10px; font-size: 12px; color: #9ca3af;">© 2026 Turbo Brand. Todos los derechos reservados.</p>
                            <p style="margin: 0; font-size: 11px; color: #cbd5e1;">Estás recibiendo este correo porque te suscribiste a nuestras comunicaciones.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>',
    true
);

-- 2. OFERTA ESPECIAL
INSERT INTO email_templates (organization_id, name, category, subject, html_content, is_active)
VALUES (
    '5e5b7400-1a66-42dc-880e-e501021edadc',
    'Oferta Especial',
    'promocional',
    '🎉 Oferta Especial - ¡Solo por tiempo limitado!',
    '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Oferta Especial</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #fef3c7;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); padding: 50px 30px; text-align: center;">
                            <h1 style="margin: 0 0 15px; color: #ffffff; font-size: 36px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
                                🎉 ¡Oferta Especial!
                            </h1>
                            <p style="margin: 0; color: #fef3c7; font-size: 20px; font-weight: 600;">
                                Descuentos increíbles te esperan
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                            <p style="margin: 0 0 25px; font-size: 18px; line-height: 1.6; color: #374151;">
                                Esta es tu oportunidad de obtener productos y servicios increíbles con descuentos exclusivos.
                            </p>
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 8px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);">
                                        <a href="https://www.turbobrandcol.com" style="display: inline-block; padding: 18px 50px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 18px;">
                                            ¡Descubrir Más!
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 15px; font-size: 16px; font-weight: 600; color: #1f2937;">Turbo Brand</p>
                            <p style="margin: 0 0 15px; font-size: 14px; color: #6b7280;">Cali, Valle del Cauca, Colombia</p>
                            <p style="margin: 0 0 15px; font-size: 14px;">
                                <a href="https://www.turbobrandcol.com" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Sitio Web</a> |
                                <a href="https://www.turbobrandcol.com/politica-privacidad" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Política de Privacidad</a> |
                                <a href="https://www.turbobrandcol.com/terminos" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Términos</a>
                            </p>
                            <p style="margin: 0 0 15px; font-size: 13px; color: #9ca3af;">
                                ¿No deseas recibir más correos? 
                                <a href="mailto:gerencia@turbobrandcol.com?subject=Darme de baja" style="color: #9ca3af; text-decoration: underline;">Darse de baja</a>
                            </p>
                            <p style="margin: 0 0 10px; font-size: 12px; color: #9ca3af;">© 2026 Turbo Brand. Todos los derechos reservados.</p>
                            <p style="margin: 0; font-size: 11px; color: #cbd5e1;">Estás recibiendo este correo porque te suscribiste a nuestras comunicaciones.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>',
    true
);

-- 3. NEWSLETTER MENSUAL
INSERT INTO email_templates (organization_id, name, category, subject, html_content, is_active)
VALUES (
    '5e5b7400-1a66-42dc-880e-e501021edadc',
    'Boletín Mensual',
    'newsletter',
    'Newsletter - Novedades de Turbo Brand',
    '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="background-color: #1f2937; padding: 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Newsletter Turbo Brand</h1>
                            <p style="margin: 10px 0 0; color: #9ca3af; font-size: 14px;">Lo más destacado del mes</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="margin: 0 0 15px; color: #1f2937; font-size: 22px; font-weight: 600;">Novedades y Actualizaciones</h2>
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                Descubre las últimas novedades, consejos y recursos que hemos preparado para ti este mes.
                            </p>
                            <table role="presentation" style="margin: 20px auto 0;">
                                <tr>
                                    <td style="border-radius: 6px; background-color: #3b82f6;">
                                        <a href="https://www.turbobrandcol.com" style="display: inline-block; padding: 14px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                                            Leer Más
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 15px; font-size: 16px; font-weight: 600; color: #1f2937;">Turbo Brand</p>
                            <p style="margin: 0 0 15px; font-size: 14px; color: #6b7280;">Cali, Valle del Cauca, Colombia</p>
                            <p style="margin: 0 0 15px; font-size: 14px;">
                                <a href="https://www.turbobrandcol.com" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Sitio Web</a> |
                                <a href="https://www.turbobrandcol.com/politica-privacidad" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Política de Privacidad</a> |
                                <a href="https://www.turbobrandcol.com/terminos" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Términos</a>
                            </p>
                            <p style="margin: 0 0 15px; font-size: 13px; color: #9ca3af;">
                                ¿No deseas recibir más correos? 
                                <a href="mailto:gerencia@turbobrandcol.com?subject=Darme de baja" style="color: #9ca3af; text-decoration: underline;">Darse de baja</a>
                            </p>
                            <p style="margin: 0 0 10px; font-size: 12px; color: #9ca3af;">© 2026 Turbo Brand. Todos los derechos reservados.</p>
                            <p style="margin: 0; font-size: 11px; color: #cbd5e1;">Estás recibiendo este correo porque te suscribiste a nuestras comunicaciones.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>',
    true
);

-- 4. ACTUALIZACIONES DE PRODUCTO
INSERT INTO email_templates (organization_id, name, category, subject, html_content, is_active)
VALUES (
    '5e5b7400-1a66-42dc-880e-e501021edadc',
    'Actualizaciones de Producto',
    'newsletter',
    'Nuevas Funcionalidades - Turbo Brand',
    '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualizaciones</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 40px 30px 30px; text-align: center;">
                            <h1 style="margin: 0 0 10px; color: #1f2937; font-size: 28px; font-weight: bold;">¡Novedades en Turbo Brand!</h1>
                            <p style="margin: 0; color: #6b7280; font-size: 16px;">Descubre las nuevas funcionalidades</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <div style="background-color: #f0fdf4; border-radius: 8px; padding: 25px; margin-bottom: 15px;">
                                <h3 style="margin: 0 0 15px; color: #166534; font-size: 18px; font-weight: 600;">✨ Nuevas Características</h3>
                                <p style="margin: 0; font-size: 15px; line-height: 1.8; color: #15803d;">
                                    Hemos mejorado nuestros servicios para ofrecerte una mejor experiencia.
                                </p>
                            </div>
                            <table role="presentation" style="margin: 20px auto 0;">
                                <tr>
                                    <td style="border-radius: 6px; background-color: #10b981;">
                                        <a href="https://www.turbobrandcol.com" style="display: inline-block; padding: 14px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                                            Más Información
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 15px; font-size: 16px; font-weight: 600; color: #1f2937;">Turbo Brand</p>
                            <p style="margin: 0 0 15px; font-size: 14px; color: #6b7280;">Cali, Valle del Cauca, Colombia</p>
                            <p style="margin: 0 0 15px; font-size: 14px;">
                                <a href="https://www.turbobrandcol.com" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Sitio Web</a> |
                                <a href="https://www.turbobrandcol.com/politica-privacidad" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Política de Privacidad</a> |
                                <a href="https://www.turbobrandcol.com/terminos" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Términos</a>
                            </p>
                            <p style="margin: 0 0 15px; font-size: 13px; color: #9ca3af;">
                                ¿No deseas recibir más correos? 
                                <a href="mailto:gerencia@turbobrandcol.com?subject=Darme de baja" style="color: #9ca3af; text-decoration: underline;">Darse de baja</a>
                            </p>
                            <p style="margin: 0 0 10px; font-size: 12px; color: #9ca3af;">© 2026 Turbo Brand. Todos los derechos reservados.</p>
                            <p style="margin: 0; font-size: 11px; color: #cbd5e1;">Estás recibiendo este correo porque te suscribiste a nuestras comunicaciones.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>',
    true
);

-- 5. DESCUENTO POR TEMPORADA
INSERT INTO email_templates (organization_id, name, category, subject, html_content, is_active)
VALUES (
    '5e5b7400-1a66-42dc-880e-e501021edadc',
    'Descuento por Temporada',
    'promocional',
    '❄️ Especial de Temporada - Descuentos Exclusivos',
    '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Descuento Temporada</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #dbeafe;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 50px 30px; text-align: center;">
                            <h1 style="margin: 0 0 10px; color: #ffffff; font-size: 42px; font-weight: bold;">
                                ❄️ Especial de Temporada
                            </h1>
                            <p style="margin: 0; color: #dbeafe; font-size: 24px; font-weight: 600;">
                                Descuentos exclusivos para ti
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 25px; font-size: 18px; line-height: 1.6; color: #1f2937; text-align: center;">
                                Celebra esta temporada con increíbles ofertas en nuestros productos y servicios seleccionados.
                            </p>
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 8px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);">
                                        <a href="https://www.turbobrandcol.com" style="display: inline-block; padding: 18px 50px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 18px;">
                                            Ver Todas las Ofertas
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 15px; font-size: 16px; font-weight: 600; color: #1f2937;">Turbo Brand</p>
                            <p style="margin: 0 0 15px; font-size: 14px; color: #6b7280;">Cali, Valle del Cauca, Colombia</p>
                            <p style="margin: 0 0 15px; font-size: 14px;">
                                <a href="https://www.turbobrandcol.com" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Sitio Web</a> |
                                <a href="https://www.turbobrandcol.com/politica-privacidad" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Política de Privacidad</a> |
                                <a href="https://www.turbobrandcol.com/terminos" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Términos</a>
                            </p>
                            <p style="margin: 0 0 15px; font-size: 13px; color: #9ca3af;">
                                ¿No deseas recibir más correos? 
                                <a href="mailto:gerencia@turbobrandcol.com?subject=Darme de baja" style="color: #9ca3af; text-decoration: underline;">Darse de baja</a>
                            </p>
                            <p style="margin: 0 0 10px; font-size: 12px; color: #9ca3af;">© 2026 Turbo Brand. Todos los derechos reservados.</p>
                            <p style="margin: 0; font-size: 11px; color: #cbd5e1;">Estás recibiendo este correo porque te suscribiste a nuestras comunicaciones.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>',
    true
);

-- 6. NOTIFICACIÓN GENERAL
INSERT INTO email_templates (organization_id, name, category, subject, html_content, is_active)
VALUES (
    '5e5b7400-1a66-42dc-880e-e501021edadc',
    'Notificación General',
    'general',
    'Actualización Importante - Turbo Brand',
    '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notificación</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 30px 30px 20px; border-bottom: 3px solid #3b82f6;">
                            <h2 style="margin: 0; color: #1f2937; font-size: 24px; font-weight: 600;">Actualización Importante</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                                <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #1e40af;">
                                    Tenemos información importante que compartir contigo.
                                </p>
                            </div>
                            <p style="margin: 20px 0 0; font-size: 14px; color: #6b7280;">
                                Para más información, visita nuestro sitio web o contáctanos directamente.
                            </p>
                            <table role="presentation" style="margin: 20px auto 0;">
                                <tr>
                                    <td style="border-radius: 6px; background-color: #3b82f6;">
                                        <a href="https://www.turbobrandcol.com" style="display: inline-block; padding: 14px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                                            Más Información
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 15px; font-size: 16px; font-weight: 600; color: #1f2937;">Turbo Brand</p>
                            <p style="margin: 0 0 15px; font-size: 14px; color: #6b7280;">Cali, Valle del Cauca, Colombia</p>
                            <p style="margin: 0 0 15px; font-size: 14px;">
                                <a href="https://www.turbobrandcol.com" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Sitio Web</a> |
                                <a href="https://www.turbobrandcol.com/politica-privacidad" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Política de Privacidad</a> |
                                <a href="https://www.turbobrandcol.com/terminos" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Términos</a>
                            </p>
                            <p style="margin: 0 0 15px; font-size: 13px; color: #9ca3af;">
                                ¿No deseas recibir más correos? 
                                <a href="mailto:gerencia@turbobrandcol.com?subject=Darme de baja" style="color: #9ca3af; text-decoration: underline;">Darse de baja</a>
                            </p>
                            <p style="margin: 0 0 10px; font-size: 12px; color: #9ca3af;">© 2026 Turbo Brand. Todos los derechos reservados.</p>
                            <p style="margin: 0; font-size: 11px; color: #cbd5e1;">Estás recibiendo este correo porque te suscribiste a nuestras comunicaciones.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>',
    true
);

-- VERIFICACIÓN FINAL
SELECT 
    name,
    category,
    CASE 
        WHEN html_content LIKE '%turbobrandcol.com%' THEN '✅'
        ELSE '❌'
    END as tiene_link_web,
    CASE 
        WHEN html_content LIKE '%Darse de baja%' THEN '✅'
        ELSE '❌'
    END as tiene_unsubscribe,
    CASE 
        WHEN html_content LIKE '%Política de Privacidad%' THEN '✅'
        ELSE '❌'
    END as tiene_privacy,
    created_at
FROM email_templates
WHERE organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc'
ORDER BY category, name;
