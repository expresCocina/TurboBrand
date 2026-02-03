/**
 * Motor de plantillas simple para reemplazo de variables
 */

export interface TemplateVariables {
    [key: string]: string;
}

/**
 * Reemplaza las variables en formato {{variable}} con sus valores
 * @param template String con el contenido de la plantilla
 * @param variables Objeto con los valores de las variables
 * @returns String con las variables reemplazadas
 */
export function replaceVariables(
    template: string,
    variables: TemplateVariables
): string {
    if (!template) return '';

    let result = template;

    // Iterar sobre cada variable disponible
    Object.entries(variables).forEach(([key, value]) => {
        // Crear expresión regular global para reemplazar todas las ocurrencias
        // Escapamos caracteres especiales por seguridad
        const regex = new RegExp(`{{${key}}}`, 'g');
        const safeValue = value || ''; // Manejar valores nulos

        result = result.replace(regex, safeValue);
    });

    return result;
}

/**
 * Extrae todas las variables únicas encontradas en el texto
 * @param text Contenido a analizar
 * @returns Array de strings con los nombres de las variables encontradas
 */
export function extractVariables(text: string): string[] {
    if (!text) return [];

    const regex = /{{([a-zA-Z0-9_]+)}}/g;
    const matches = [...text.matchAll(regex)];

    // Retornar solo el grupo de captura (nombre de la variable) y eliminar duplicados
    return [...new Set(matches.map(match => match[1]))];
}

/**
 * Obtiene variables de ejemplo para vista previa
 */
export function getExampleVariables(): TemplateVariables {
    return {
        nombre: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        empresa: 'Empresa Demo S.A.S',
        cargo: 'Gerente General',
        fecha: new Date().toLocaleDateString('es-CO'),
        unsubscribe_url: '#'
    };
}
