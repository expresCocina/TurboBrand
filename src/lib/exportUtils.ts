/**
 * Utilidades para exportar datos a diferentes formatos
 */

/**
 * Convierte un array de objetos a formato CSV
 */
export function arrayToCSV(data: any[], headers?: string[]): string {
    if (!data || data.length === 0) return '';

    // Si no se proporcionan headers, usar las keys del primer objeto
    const csvHeaders = headers || Object.keys(data[0]);

    // Crear fila de encabezados
    const headerRow = csvHeaders.join(',');

    // Crear filas de datos
    const dataRows = data.map(row => {
        return csvHeaders.map(header => {
            const value = row[header];

            // Escapar valores que contengan comas, comillas o saltos de línea
            if (value === null || value === undefined) return '';

            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }

            return stringValue;
        }).join(',');
    });

    // Combinar todo
    return [headerRow, ...dataRows].join('\n');
}

/**
 * Descarga un string como archivo CSV
 */
export function downloadCSV(csvContent: string, filename: string): void {
    // Agregar BOM para que Excel reconozca UTF-8
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Formatea una fecha para CSV
 */
export function formatDateForCSV(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-CO') + ' ' + d.toLocaleTimeString('es-CO');
}

/**
 * Formatea un porcentaje para CSV
 */
export function formatPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
}
