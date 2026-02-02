"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Contact } from '@/lib/supabase';
import {
    Plus,
    Search,
    Filter,
    Download,
    Upload,
    Mail,
    Phone,
    Building2,
    Tag,
    Edit,
    Trash2,
    Eye,
    Users,
    CheckCircle,
    Bell
} from 'lucide-react';
import Link from 'next/link';

interface ContactWithTasks extends Contact {
    pending_tasks_count?: number;
}

export default function ContactosPage() {
    const [contacts, setContacts] = useState<ContactWithTasks[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSource, setFilterSource] = useState<string>('all');

    // Filtros avanzados
    const [showFilters, setShowFilters] = useState(false);
    const [minScore, setMinScore] = useState<number>(0);
    const [maxScore, setMaxScore] = useState<number>(100);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Cargar contactos
    useEffect(() => {
        loadContactsAndTasks();
    }, []);

    async function loadContactsAndTasks() {
        try {
            setLoading(true);

            // 1. Obtener contactos
            const { data: contactsData, error: contactsError } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false });

            if (contactsError) throw contactsError;

            // 2. Obtener conteo de tareas pendientes para TODOS los contactos
            // (Hacemos esto optimizado en una sola query si es posible, o iteramos)
            // Dado que Supabase/PostgREST no soporta joins complejos con count fácilmente sin vistas,
            // y para no complicar la DB ahora, haremos un fetch de tareas pendientes y mapearemos en cliente.
            // Si la base crece mucho, esto se debe mover a una Vista SQL o función RPC.

            const { data: tasksData, error: tasksError } = await supabase
                .from('tasks')
                .select('related_to_id')
                .eq('related_to_type', 'contact')
                .neq('status', 'completed'); // Solo tareas pendientes

            if (tasksError) console.error("Error cargando tareas:", tasksError);

            // 3. Mapear conteo
            const taskCounts: { [key: string]: number } = {};
            tasksData?.forEach((t: any) => {
                const id = t.related_to_id;
                if (id) {
                    taskCounts[id] = (taskCounts[id] || 0) + 1;
                }
            });

            // 4. Combinar datos
            const contactsWithTasks = contactsData?.map(c => ({
                ...c,
                pending_tasks_count: taskCounts[c.id] || 0
            })) || [];

            setContacts(contactsWithTasks);
        } catch (error) {
            console.error('Error cargando contactos:', error);
        } finally {
            setLoading(false);
        }
    }

    // Filtrar contactos
    const filteredContacts = contacts.filter(contact => {
        const matchesSearch =
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.phone?.includes(searchTerm) ||
            contact.company?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSource = filterSource === 'all' || contact.source === filterSource;

        const matchesScore = (contact.lead_score || 0) >= minScore && (contact.lead_score || 0) <= maxScore;

        let matchesDate = true;
        if (startDate || endDate) {
            const contactDate = new Date(contact.created_at).getTime();
            const start = startDate ? new Date(startDate).getTime() : 0;
            const end = endDate ? new Date(endDate).getTime() + 86400000 : Infinity; // +1 día para incluir el final
            matchesDate = contactDate >= start && contactDate < end;
        }

        return matchesSearch && matchesSource && matchesScore && matchesDate;
    });

    // Estadísticas
    const stats = {
        total: contacts.length,
        web: contacts.filter(c => c.source === 'web').length,
        whatsapp: contacts.filter(c => c.source === 'whatsapp').length,
        manual: contacts.filter(c => c.source === 'manual').length,
    };

    // Exportar contactos a CSV
    const handleExport = () => {
        if (contacts.length === 0) {
            alert('No hay contactos para exportar');
            return;
        }

        const headers = ['Nombre', 'Email', 'Teléfono', 'Empresa', 'Cargo', 'Sector', 'Fuente', 'Lead Score', 'Fecha Creación', 'Tareas Pendientes'];

        const csvContent = contacts.map(contact => [
            `"${contact.name || ''}"`,
            `"${contact.email || ''}"`,
            `"${contact.phone || ''}"`,
            `"${contact.company || ''}"`,
            `"${contact.position || ''}"`,
            `"${contact.sector || ''}"`,
            `"${contact.source || ''}"`,
            contact.lead_score,
            `"${new Date(contact.created_at).toLocaleDateString()}"`,
            contact.pending_tasks_count || 0
        ].join(','));

        const csvString = [headers.join(','), ...csvContent].join('\n');

        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'contactos_crm_turbobrand.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Importar contactos desde CSV
    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;
                const lines = text.split('\n');

                const newContacts = [];

                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue;

                    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));

                    // Mapeo simple basado en orden esperado: Name, Email, Phone, Company
                    const contact: any = {
                        organization_id: '5e5b7400-1a66-42dc-880e-e501021edadc', // Fixed ID
                        lead_score: 50,
                        source: 'import',
                        name: values[0] || 'Sin Nombre',
                        email: values[1] || null,
                        phone: values[2] || null,
                        company: values[3] || null,
                    };

                    if (contact.name) {
                        newContacts.push(contact);
                    }
                }

                if (newContacts.length > 0) {
                    const { error } = await supabase
                        .from('contacts')
                        .insert(newContacts);

                    if (error) throw error;

                    alert(`${newContacts.length} contactos importados exitosamente`);
                    loadContactsAndTasks();
                }
            } catch (error) {
                console.error('Error importando:', error);
                alert('Error al importar el archivo. Asegúrate de usar el formato correcto.');
            } finally {
                setLoading(false);
                e.target.value = '';
            }
        };

        reader.readAsText(file);
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Contactos</h1>
                    <p className="text-gray-600 mt-1">{filteredContacts.length} contactos encontrados</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleImport}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            title="Seleccionar archivo CSV"
                        />
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors shadow-sm font-medium">
                            <Upload className="h-4 w-4" />
                            Importar CSV
                        </button>
                    </div>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors shadow-sm font-medium"
                    >
                        <Download className="h-4 w-4" />
                        Exportar CSV
                    </button>

                    <Link
                        href="/crm/contactos/nuevo"
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm font-medium"
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Contacto
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100/50">
                    <p className="text-sm font-medium text-gray-500">Total Contactos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100/50">
                    <p className="text-sm font-medium text-gray-500">Desde Web</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{stats.web}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100/50">
                    <p className="text-sm font-medium text-gray-500">WhatsApp</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{stats.whatsapp}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100/50">
                    <p className="text-sm font-medium text-gray-500">Manual</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">{stats.manual}</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Búsqueda */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar contacto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Filtro por fuente */}
                        <div className="flex items-center gap-2">
                            <select
                                value={filterSource}
                                onChange={(e) => setFilterSource(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none cursor-pointer"
                            >
                                <option value="all">Todas las fuentes</option>
                                <option value="web">Web</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="manual">Manual</option>
                                <option value="import">Importado</option>
                            </select>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilters
                                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Filter className="h-4 w-4" />
                                Filtros
                            </button>
                        </div>
                    </div>

                    {/* Panel de Filtros Avanzados */}
                    {showFilters && (
                        <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rango de Lead Score</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={minScore}
                                        onChange={(e) => setMinScore(Number(e.target.value))}
                                        className="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Min"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={maxScore}
                                        onChange={(e) => setMaxScore(Number(e.target.value))}
                                        className="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Creación</label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 w-10">Desde:</span>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500 w-full"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 w-10">Hasta:</span>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500 w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setMinScore(0);
                                        setMaxScore(100);
                                        setStartDate('');
                                        setEndDate('');
                                        setFilterSource('all');
                                        setSearchTerm('');
                                    }}
                                    className="text-sm text-gray-500 hover:text-purple-600 underline decoration-dotted"
                                >
                                    Limpiar todos los filtros
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabla de contactos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-purple-600"></div>
                        <p className="text-gray-500 mt-3 font-medium">Cargando...</p>
                    </div>
                ) : filteredContacts.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="mx-auto h-12 w-12 text-gray-300 mb-3">
                            <Users className="h-full w-full" />
                        </div>
                        <p className="text-gray-500 text-lg">No se encontraron contactos</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Contacto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Empresa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Fuente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredContacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="relative flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center border border-purple-200">
                                                    <span className="text-purple-700 font-bold text-sm">
                                                        {contact.name.charAt(0).toUpperCase()}
                                                    </span>
                                                    {/* Indicador de Tareas Pendientes */}
                                                    {contact.pending_tasks_count && contact.pending_tasks_count > 0 ? (
                                                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] h-4 w-4 flex items-center justify-center rounded-full border-2 border-white font-bold" title={`${contact.pending_tasks_count} tarea(s) pendiente(s)`}>
                                                            {contact.pending_tasks_count}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                                                            {contact.name}
                                                        </span>
                                                        {contact.pending_tasks_count && contact.pending_tasks_count > 0 ? (
                                                            <span className="flex items-center gap-0.5 text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full font-medium">
                                                                <Bell className="h-3 w-3" />
                                                                {contact.pending_tasks_count}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 mt-0.5">
                                                        {contact.email && (
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                                <Mail className="h-3 w-3" />
                                                                {contact.email}
                                                            </div>
                                                        )}
                                                        {contact.phone && (
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                                <Phone className="h-3 w-3" />
                                                                {contact.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {contact.company ? (
                                                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                                    <Building2 className="h-4 w-4 text-gray-400" />
                                                    {contact.company}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">--</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${contact.source === 'web' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                contact.source === 'whatsapp' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    contact.source === 'manual' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                        contact.source === 'import' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                            'bg-gray-50 text-gray-700 border-gray-100'
                                                }`}>
                                                {contact.source === 'web' && 'Web'}
                                                {contact.source === 'whatsapp' && 'WhatsApp'}
                                                {contact.source === 'manual' && 'Manual'}
                                                {contact.source === 'import' && 'Importado'}
                                                {!['web', 'whatsapp', 'manual', 'import'].includes(contact.source || '') && (contact.source || 'Otro')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${contact.lead_score >= 80 ? 'bg-green-500' :
                                                            contact.lead_score >= 50 ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                            }`}
                                                        style={{ width: `${contact.lead_score}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-medium text-gray-600 w-6 text-right">{contact.lead_score}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/crm/contactos/${contact.id}`}
                                                    className="p-1.5 bg-white border border-gray-200 rounded-md text-gray-500 hover:text-purple-600 hover:border-purple-200 transition-colors shadow-sm"
                                                    title="Ver detalle"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/crm/contactos/${contact.id}/editar`}
                                                    className="p-1.5 bg-white border border-gray-200 rounded-md text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
                                                    title="Editar"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
