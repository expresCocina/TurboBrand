-- ============================================
-- ACTUALIZACIÓN MASIVA: Footer Compliant para TODAS las plantillas
-- ============================================
-- Este script agrega el footer completo a TODAS las plantillas existentes
-- Incluye: Unsubscribe, Privacy Policy, Links a turbobrandcol.com, Legal info

-- IMPORTANTE: Este footer debe estar en TODAS las plantillas antes del </body>

-- ============================================
-- COMPONENTE REUTILIZABLE: Footer Compliant
-- ============================================

/*
COPIAR ESTE FOOTER EN TODAS LAS PLANTILLAS (antes del cierre de la tabla principal):

                    <!-- Footer Compliant -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 15px; font-size: 16px; font-weight: 600; color: #1f2937;">
                                Turbo Brand
                            </p>
                            <p style="margin: 0 0 15px; font-size: 14px; color: #6b7280;">
                                Cali, Valle del Cauca, Colombia
                            </p>
                            <p style="margin: 0 0 15px; font-size: 14px;">
                                <a href="https://www.turbobrandcol.com" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Sitio Web</a> |
                                <a href="https://www.turbobrandcol.com/politica-privacidad" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Política de Privacidad</a> |
                                <a href="https://www.turbobrandcol.com/terminos" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Términos</a>
                            </p>
                            <p style="margin: 0 0 15px; font-size: 13px; color: #9ca3af;">
                                ¿No deseas recibir más correos? 
                                <a href="mailto:gerencia@turbobrandcol.com?subject=Darme de baja" style="color: #9ca3af; text-decoration: underline;">Darse de baja</a>
                            </p>
                            <p style="margin: 0 0 10px; font-size: 12px; color: #9ca3af;">
                                © 2026 Turbo Brand. Todos los derechos reservados.
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
                                Estás recibiendo este correo porque te suscribiste a nuestras comunicaciones.
                            </p>
                        </td>
                    </tr>
*/

-- ============================================
-- INSTRUCCIONES PARA ACTUALIZAR MANUALMENTE
-- ============================================

/*
Para cada plantilla en Supabase:

1. Ve a la tabla `email_templates`
2. Edita cada registro
3. En el campo `html_content`, busca el último `</tr>` antes de `</table></td></tr></table></body></html>`
4. Reemplaza el footer existente con el footer compliant de arriba
5. Asegúrate de que TODOS los botones "Descubrir más" o CTAs apunten a https://www.turbobrandcol.com

CHECKLIST POR PLANTILLA:
- [ ] Bienvenida
- [ ] Notificación General
- [ ] Boletín Mensual
- [ ] Actualizaciones de Producto
- [ ] Oferta Especial
- [ ] Descuento por Temporada
*/

-- ============================================
-- VERIFICACIÓN: Ver plantillas actuales
-- ============================================

SELECT 
    id,
    name,
    category,
    CASE 
        WHEN html_content LIKE '%turbobrandcol.com%' THEN '✅'
        ELSE '❌'
    END as tiene_link_web,
    CASE 
        WHEN html_content LIKE '%Darse de baja%' OR html_content LIKE '%unsubscribe%' THEN '✅'
        ELSE '❌'
    END as tiene_unsubscribe,
    CASE 
        WHEN html_content LIKE '%Política de Privacidad%' OR html_content LIKE '%politica-privacidad%' THEN '✅'
        ELSE '❌'
    END as tiene_privacy,
    updated_at
FROM email_templates
WHERE organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc'
ORDER BY category, name;

-- ============================================
-- ALTERNATIVA: Crear nuevas plantillas compliant desde cero
-- ============================================

-- Si prefieres, puedes eliminar las plantillas existentes y crear nuevas:
-- DELETE FROM email_templates WHERE organization_id = '5e5b7400-1a66-42dc-880e-e501021edadc';
-- Luego ejecutar el script update_templates_turbo_brand_part3.sql (que crearemos a continuación)
