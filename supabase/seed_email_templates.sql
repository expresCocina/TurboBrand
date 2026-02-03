-- Script para crear tabla email_templates e insertar plantillas preestablecidas
-- Ejecutar en Supabase SQL Editor

-- ============================================
-- CREAR TABLA SI NO EXISTE
-- ============================================

-- Tabla para Plantillas de Email
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    name TEXT NOT NULL,
    subject TEXT,
    html_content TEXT NOT NULL, -- Contenido HTML
    description TEXT,
    category TEXT DEFAULT 'general', -- 'newsletter', 'promocional', 'general'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Políticas de Seguridad (RLS)
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Users can view templates from their organization" ON email_templates;
DROP POLICY IF EXISTS "Users can insert templates for their organization" ON email_templates;
DROP POLICY IF EXISTS "Users can update templates from their organization" ON email_templates;
DROP POLICY IF EXISTS "Users can delete templates from their organization" ON email_templates;

-- Crear políticas permisivas para todos los usuarios autenticados
CREATE POLICY "allow_all_select_templates" ON email_templates FOR SELECT USING (true);
CREATE POLICY "allow_all_insert_templates" ON email_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update_templates" ON email_templates FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete_templates" ON email_templates FOR DELETE USING (true);

-- Índices
CREATE INDEX IF NOT EXISTS idx_email_templates_org ON email_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);

-- ============================================
-- INSERTAR PLANTILLAS PREESTABLECIDAS
-- ============================================

-- Limpiar plantillas existentes (opcional, comentar si no quieres borrar)
-- DELETE FROM email_templates WHERE organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc';

-- ============================================
-- CATEGORÍA: GENERAL
-- ============================================

-- 1. Plantilla: Bienvenida
INSERT INTO email_templates (organization_id, name, category, subject, html_content, is_active)
VALUES (
    '5e5b7400-1a66-42dc-880e-e501021edadc',
    'Bienvenida',
    'general',
    '¡Bienvenido a {{empresa}}!',
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
                    <!-- Header con gradiente -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">¡Bienvenido!</h1>
                        </td>
                    </tr>
                    
                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                                Hola <strong>{{nombre}}</strong>,
                            </p>
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                                Estamos emocionados de tenerte con nosotros en <strong>{{empresa}}</strong>. Tu cuenta ha sido creada exitosamente y ya puedes comenzar a disfrutar de todos nuestros servicios.
                            </p>
                            <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                                Si tienes alguna pregunta, no dudes en contactarnos. Estamos aquí para ayudarte.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                        <a href="{{url_inicio}}" style="display: inline-block; padding: 14px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                                            Comenzar Ahora
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 10px; font-size: 14px; color: #6c757d;">
                                {{empresa}} | {{direccion}}
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #adb5bd;">
                                © 2026 Todos los derechos reservados
                            </p>
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

-- 2. Plantilla: Notificación General
INSERT INTO email_templates (organization_id, name, category, subject, html_content, is_active)
VALUES (
    '5e5b7400-1a66-42dc-880e-e501021edadc',
    'Notificación General',
    'general',
    '{{titulo}} - Actualización Importante',
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
                    <!-- Header minimalista -->
                    <tr>
                        <td style="padding: 30px 30px 20px; border-bottom: 3px solid #3b82f6;">
                            <h2 style="margin: 0; color: #1f2937; font-size: 24px; font-weight: 600;">{{titulo}}</h2>
                            <p style="margin: 10px 0 0; font-size: 14px; color: #6b7280;">{{fecha}}</p>
                        </td>
                    </tr>
                    
                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 30px;">
                            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                                <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #1e40af;">
                                    {{mensaje}}
                                </p>
                            </div>
                            
                            <p style="margin: 20px 0 0; font-size: 14px; color: #6b7280;">
                                Para más información, visita nuestro sitio web o contáctanos directamente.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
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
    true
);

-- ============================================
-- CATEGORÍA: NEWSLETTER
-- ============================================

-- 3. Plantilla: Boletín Mensual
INSERT INTO email_templates (organization_id, name, category, subject, html_content, is_active)
VALUES (
    '5e5b7400-1a66-42dc-880e-e501021edadc',
    'Boletín Mensual',
    'newsletter',
    'Newsletter {{mes}} - Novedades y Actualizaciones',
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
                    <!-- Header con logo -->
                    <tr>
                        <td style="background-color: #1f2937; padding: 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Newsletter {{mes}}</h1>
                            <p style="margin: 10px 0 0; color: #9ca3af; font-size: 14px;">Lo más destacado del mes</p>
                        </td>
                    </tr>
                    
                    <!-- Artículo 1 -->
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="margin: 0 0 15px; color: #1f2937; font-size: 22px; font-weight: 600;">{{titulo_1}}</h2>
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                {{contenido_1}}
                            </p>
                            <a href="{{link_1}}" style="color: #3b82f6; text-decoration: none; font-weight: 600; font-size: 14px;">
                                Leer más →
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Separador -->
                    <tr>
                        <td style="padding: 0 30px;">
                            <div style="border-top: 1px solid #e5e7eb;"></div>
                        </td>
                    </tr>
                    
                    <!-- Artículo 2 -->
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="margin: 0 0 15px; color: #1f2937; font-size: 22px; font-weight: 600;">{{titulo_2}}</h2>
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                {{contenido_2}}
                            </p>
                            <a href="{{link_2}}" style="color: #3b82f6; text-decoration: none; font-weight: 600; font-size: 14px;">
                                Leer más →
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
                                Síguenos en redes sociales
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                <a href="{{url_cancelar}}" style="color: #9ca3af; text-decoration: underline;">Cancelar suscripción</a>
                            </p>
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

-- 4. Plantilla: Actualizaciones de Producto
INSERT INTO email_templates (organization_id, name, category, subject, html_content, is_active)
VALUES (
    '5e5b7400-1a66-42dc-880e-e501021edadc',
    'Actualizaciones de Producto',
    'newsletter',
    'Nuevas Funcionalidades en {{producto}}',
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
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 30px 30px; text-align: center;">
                            <h1 style="margin: 0 0 10px; color: #1f2937; font-size: 28px; font-weight: bold;">¡Novedades en {{producto}}!</h1>
                            <p style="margin: 0; color: #6b7280; font-size: 16px;">Descubre las nuevas funcionalidades</p>
                        </td>
                    </tr>
                    
                    <!-- Imagen del producto -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <img src="{{imagen_url}}" alt="{{producto}}" style="width: 100%; max-width: 540px; height: auto; border-radius: 8px; display: block;">
                        </td>
                    </tr>
                    
                    <!-- Características -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <div style="background-color: #f0fdf4; border-radius: 8px; padding: 25px; margin-bottom: 15px;">
                                <h3 style="margin: 0 0 15px; color: #166534; font-size: 18px; font-weight: 600;">✨ Nuevas Características</h3>
                                <p style="margin: 0; font-size: 15px; line-height: 1.8; color: #15803d;">
                                    {{caracteristicas}}
                                </p>
                            </div>
                            
                            <!-- CTA -->
                            <table role="presentation" style="margin: 20px auto 0;">
                                <tr>
                                    <td style="border-radius: 6px; background-color: #10b981;">
                                        <a href="{{url_mas_info}}" style="display: inline-block; padding: 14px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                                            Más Información
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                © 2026 {{empresa}}. Todos los derechos reservados.
                            </p>
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

-- ============================================
-- CATEGORÍA: PROMOCIONAL
-- ============================================

-- 5. Plantilla: Oferta Especial
INSERT INTO email_templates (organization_id, name, category, subject, html_content, is_active)
VALUES (
    '5e5b7400-1a66-42dc-880e-e501021edadc',
    'Oferta Especial',
    'promocional',
    '🎉 {{oferta}} - ¡Solo por tiempo limitado!',
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
                    <!-- Header llamativo -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); padding: 50px 30px; text-align: center;">
                            <h1 style="margin: 0 0 15px; color: #ffffff; font-size: 36px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
                                🎉 {{oferta}}
                            </h1>
                            <p style="margin: 0; color: #fef3c7; font-size: 20px; font-weight: 600;">
                                ¡Aprovecha {{descuento}} de descuento!
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                            <p style="margin: 0 0 25px; font-size: 18px; line-height: 1.6; color: #374151;">
                                Esta es tu oportunidad de obtener productos increíbles con un descuento exclusivo.
                            </p>
                            
                            <!-- Código de descuento -->
                            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px dashed #f59e0b; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                                <p style="margin: 0 0 10px; font-size: 14px; color: #92400e; font-weight: 600; text-transform: uppercase;">
                                    Usa el código:
                                </p>
                                <p style="margin: 0; font-size: 32px; color: #dc2626; font-weight: bold; letter-spacing: 3px; font-family: monospace;">
                                    {{codigo}}
                                </p>
                            </div>
                            
                            <!-- CTA -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 8px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);">
                                        <a href="{{url_tienda}}" style="display: inline-block; padding: 18px 50px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 18px;">
                                            ¡Comprar Ahora!
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 25px 0 0; font-size: 14px; color: #dc2626; font-weight: 600;">
                                ⏰ Oferta válida hasta: {{vigencia}}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #fef3c7; padding: 25px 30px; text-align: center; border-top: 1px solid #fde68a;">
                            <p style="margin: 0 0 5px; font-size: 12px; color: #92400e;">
                                *Términos y condiciones aplican
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #b45309;">
                                © 2026 {{empresa}}
                            </p>
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

-- 6. Plantilla: Descuento por Temporada
INSERT INTO email_templates (organization_id, name, category, subject, html_content, is_active)
VALUES (
    '5e5b7400-1a66-42dc-880e-e501021edadc',
    'Descuento por Temporada',
    'promocional',
    '❄️ Especial {{temporada}} - {{porcentaje}} OFF',
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
                    <!-- Header festivo -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 50px 30px; text-align: center;">
                            <h1 style="margin: 0 0 10px; color: #ffffff; font-size: 42px; font-weight: bold;">
                                ❄️ {{temporada}}
                            </h1>
                            <p style="margin: 0; color: #dbeafe; font-size: 24px; font-weight: 600;">
                                Hasta {{porcentaje}} de descuento
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 25px; font-size: 18px; line-height: 1.6; color: #1f2937; text-align: center;">
                                Celebra {{temporada}} con increíbles ofertas en nuestros productos seleccionados.
                            </p>
                            
                            <!-- Productos destacados -->
                            <div style="background-color: #eff6ff; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                                <h3 style="margin: 0 0 15px; color: #1e40af; font-size: 20px; font-weight: 600; text-align: center;">
                                    🎁 Productos en Oferta
                                </h3>
                                <p style="margin: 0; font-size: 16px; line-height: 1.8; color: #1e3a8a; text-align: center;">
                                    {{productos}}
                                </p>
                            </div>
                            
                            <!-- Urgencia -->
                            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                                <p style="margin: 0; font-size: 16px; color: #991b1b; font-weight: 600; text-align: center;">
                                    ⏰ ¡Últimos días! Oferta termina el {{fecha_limite}}
                                </p>
                            </div>
                            
                            <!-- CTA -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 8px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);">
                                        <a href="{{url_ofertas}}" style="display: inline-block; padding: 18px 50px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 18px;">
                                            Ver Todas las Ofertas
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #eff6ff; padding: 25px 30px; text-align: center; border-top: 1px solid #bfdbfe;">
                            <p style="margin: 0 0 10px; font-size: 14px; color: #1e40af;">
                                ¿No quieres recibir más ofertas? <a href="{{url_cancelar}}" style="color: #1e40af; text-decoration: underline;">Cancelar suscripción</a>
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #60a5fa;">
                                © 2026 {{empresa}}. Todos los derechos reservados.
                            </p>
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

-- Verificar plantillas insertadas
SELECT id, name, category, is_active, created_at
FROM email_templates
WHERE organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc'
ORDER BY category, name;
