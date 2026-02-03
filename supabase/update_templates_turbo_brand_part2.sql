-- Script PARTE 2: Actualizar plantillas promocionales con branding Turbo Brand
-- Ejecutar DESPUÉS del script update_templates_turbo_brand.sql

-- Actualizar plantilla: Actualizaciones de Producto
UPDATE email_templates 
SET 
    html_content = '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuevas Funcionalidades - Turbo Brand</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; background-color: #f8fafc;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 50px 40px 40px; text-align: center; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);">
                            <h1 style="margin: 0 0 8px; color: #166534; font-size: 32px; font-weight: 700;">Turbo Brand</h1>
                            <p style="margin: 0 0 20px; color: #15803d; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Novedades</p>
                            <h2 style="margin: 0; color: #1e293b; font-size: 28px; font-weight: 700;">¡Nuevas Funcionalidades en {{producto}}!</h2>
                        </td>
                    </tr>
                    
                    <!-- Imagen del producto (opcional) -->
                    <tr>
                        <td style="padding: 0;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 200px; display: flex; align-items: center; justify-content: center;">
                                <p style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0;">{{producto}}</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Características -->
                    <tr>
                        <td style="padding: 40px;">
                            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 32px; margin-bottom: 20px; border-left: 4px solid #10b981;">
                                <h3 style="margin: 0 0 16px; color: #166534; font-size: 20px; font-weight: 700;">✨ Nuevas Características</h3>
                                <p style="margin: 0; font-size: 16px; line-height: 1.8; color: #15803d;">
                                    {{caracteristicas}}
                                </p>
                            </div>
                            
                            <p style="margin: 0 0 30px; font-size: 15px; line-height: 1.7; color: #475569; text-align: center;">
                                Estas mejoras están diseñadas para optimizar tu experiencia y aumentar tu productividad.
                            </p>
                            
                            <!-- CTA -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 8px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.4);">
                                        <a href="{{url_mas_info}}" style="display: inline-block; padding: 16px 48px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
                                            Descubrir Más
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 28px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 8px; font-size: 14px; color: #64748b; font-weight: 500;">
                                <strong>Turbo Brand</strong> | Innovación Constante
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
    description = 'Anuncio de nuevas funcionalidades con diseño fresco y moderno',
    updated_at = now()
WHERE name = 'Actualizaciones de Producto' AND organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc';

-- Actualizar plantilla: Oferta Especial
UPDATE email_templates 
SET 
    html_content = '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Oferta Especial - Turbo Brand</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
                    <!-- Header llamativo -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); padding: 60px 40px; text-align: center; position: relative;">
                            <div style="background-color: #fef3c7; color: #92400e; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 8px 20px; border-radius: 20px; display: inline-block; margin-bottom: 20px;">
                                Oferta Limitada
                            </div>
                            <h1 style="margin: 0 0 16px; color: #ffffff; font-size: 42px; font-weight: 800; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); line-height: 1.1;">
                                {{oferta}}
                            </h1>
                            <p style="margin: 0; color: #fef3c7; font-size: 24px; font-weight: 700; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">
                                ¡{{descuento}} de descuento!
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 50px 40px; text-align: center;">
                            <p style="margin: 0 0 30px; font-size: 18px; line-height: 1.7; color: #374151; font-weight: 500;">
                                Esta es tu oportunidad de obtener nuestros mejores productos con un descuento exclusivo de <strong style="color: #dc2626;">Turbo Brand</strong>.
                            </p>
                            
                            <!-- Código de descuento -->
                            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 3px dashed #f59e0b; border-radius: 12px; padding: 32px; margin-bottom: 36px; box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.2);">
                                <p style="margin: 0 0 12px; font-size: 14px; color: #92400e; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                                    Usa el código:
                                </p>
                                <p style="margin: 0; font-size: 36px; color: #dc2626; font-weight: 800; letter-spacing: 4px; font-family: monospace;">
                                    {{codigo}}
                                </p>
                            </div>
                            
                            <!-- CTA -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 12px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.4), 0 4px 6px -2px rgba(220, 38, 38, 0.05);">
                                        <a href="{{url_tienda}}" style="display: inline-block; padding: 20px 56px; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 18px;">
                                            ¡Aprovechar Ahora!
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0; font-size: 16px; color: #dc2626; font-weight: 700;">
                                ⏰ Oferta válida hasta: {{vigencia}}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #fef3c7; padding: 28px 40px; text-align: center; border-top: 1px solid #fde68a;">
                            <p style="margin: 0 0 8px; font-size: 14px; color: #92400e; font-weight: 600;">
                                <strong>Turbo Brand</strong> | Ofertas Exclusivas
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #b45309;">
                                *Términos y condiciones aplican | © 2026 Turbo Brand
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>',
    description = 'Plantilla de oferta especial con diseño impactante y llamativo',
    updated_at = now()
WHERE name = 'Oferta Especial' AND organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc';

-- Actualizar plantilla: Descuento por Temporada
UPDATE email_templates 
SET 
    html_content = '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Descuento Temporada - Turbo Brand</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
                    <!-- Header festivo -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 60px 40px; text-align: center;">
                            <h1 style="margin: 0 0 8px; color: #ffffff; font-size: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Turbo Brand</h1>
                            <h2 style="margin: 0 0 12px; color: #ffffff; font-size: 48px; font-weight: 800; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
                                {{temporada}}
                            </h2>
                            <p style="margin: 0; color: #dbeafe; font-size: 28px; font-weight: 700;">
                                Hasta {{porcentaje}} OFF
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <p style="margin: 0 0 30px; font-size: 18px; line-height: 1.7; color: #1f2937; text-align: center; font-weight: 500;">
                                Celebra {{temporada}} con increíbles ofertas en nuestros productos seleccionados de <strong style="color: #3b82f6;">Turbo Brand</strong>.
                            </p>
                            
                            <!-- Productos destacados -->
                            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 32px; margin-bottom: 32px; border: 2px solid #3b82f6;">
                                <h3 style="margin: 0 0 20px; color: #1e40af; font-size: 22px; font-weight: 700; text-align: center;">
                                    🎁 Productos en Oferta
                                </h3>
                                <p style="margin: 0; font-size: 16px; line-height: 1.9; color: #1e3a8a; text-align: center; font-weight: 500;">
                                    {{productos}}
                                </p>
                            </div>
                            
                            <!-- Urgencia -->
                            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 24px; margin-bottom: 32px; border-radius: 8px;">
                                <p style="margin: 0; font-size: 16px; color: #991b1b; font-weight: 700; text-align: center;">
                                    ⏰ ¡Últimos días! Oferta termina el {{fecha_limite}}
                                </p>
                            </div>
                            
                            <!-- CTA -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 12px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.4);">
                                        <a href="{{url_ofertas}}" style="display: inline-block; padding: 20px 56px; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 18px;">
                                            Ver Todas las Ofertas
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #eff6ff; padding: 32px 40px; text-align: center; border-top: 1px solid #bfdbfe;">
                            <p style="margin: 0 0 12px; font-size: 14px; color: #1e40af; font-weight: 600;">
                                <strong>Turbo Brand</strong> | Ofertas de Temporada
                            </p>
                            <p style="margin: 0 0 8px; font-size: 12px; color: #3b82f6;">
                                ¿No quieres recibir más ofertas? <a href="{{url_cancelar}}" style="color: #1e40af; text-decoration: underline; font-weight: 600;">Cancelar suscripción</a>
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #60a5fa;">
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
    description = 'Plantilla de descuento estacional con diseño festivo y atractivo',
    updated_at = now()
WHERE name = 'Descuento por Temporada' AND organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc';

-- Verificar todas las actualizaciones
SELECT 
    id, 
    name, 
    category, 
    description,
    CASE 
        WHEN html_content LIKE '%Turbo Brand%' THEN 'Con branding ✓'
        ELSE 'Sin branding ✗'
    END as branding_status,
    updated_at
FROM email_templates
WHERE organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc'
ORDER BY category, name;
