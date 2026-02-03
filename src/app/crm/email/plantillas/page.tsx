"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Layout, Search, Filter, MoreVertical, Edit, Trash2, Copy, FileCode } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TemplatesPage() {
    const router = useRouter();
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadTemplates();
    }, [filter]);

    async function loadTemplates() {
        setLoading(true);
        try {
            const url = filter === 'all'
                ? '/api/email/templates'
                : `/api/email/templates?category=${filter}`;

            const response = await fetch(url);
            const data = await response.json();

            if (Array.isArray(data)) {
                setTemplates(data);
            }
        } catch (error) {
            console.error('Error loading templates:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Estás seguro de eliminar esta plantilla?')) return;

        try {
            const response = await fetch(`/api/email/templates/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setTemplates(templates.filter(t => t.id !== id));
            } else {
                alert('Error al eliminar');
            }
        } catch (error) {
            console.error(error);
            alert('Error al eliminar');
        }
    }

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 min-h-screen bg-gray-50 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Plantillas de Email</h1>
                    <p className="text-gray-600">Crea y gestiona diseños reutilizables para tus campañas.</p>
                </div>
                <Link
                    href="/crm/email/plantillas/nueva"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm"
                >
                    <Plus className="h-5 w-5" />
                    Nueva Plantilla
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'all' ? 'bg-purple-100 text-purple-700 border-purple-200 border' : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'}`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setFilter('general')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'general' ? 'bg-purple-100 text-purple-700 border-purple-200 border' : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'}`}
                    >
                        General
                    </button>
                    <button
                        onClick={() => setFilter('newsletter')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'newsletter' ? 'bg-purple-100 text-purple-700 border-purple-200 border' : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'}`}
                    >
                        Newsletter
                    </button>
                    <button
                        onClick={() => setFilter('promotional')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'promotional' ? 'bg-purple-100 text-purple-700 border-purple-200 border' : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'}`}
                    >
                        Promocional
                    </button>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar plantilla..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-200 border-t-purple-600"></div>
                </div>
            ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Layout className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No hay plantillas</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mt-1 mb-6">Comienza creando tu primera plantilla de email para reutilizar en tus campañas.</p>
                    <Link
                        href="/crm/email/plantillas/nueva"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                    >
                        Crear Plantilla
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                        <div key={template.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                            {/* Preview Area con HTML Renderizado */}
                            <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 relative overflow-hidden">
                                {template.html_content ? (
                                    <iframe
                                        srcDoc={template.html_content}
                                        className="w-full h-full pointer-events-none scale-[0.25] origin-top-left"
                                        style={{
                                            width: '400%',
                                            height: '400%',
                                            border: 'none'
                                        }}
                                        title={`Preview de ${template.name}`}
                                        sandbox="allow-same-origin"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300">
                                        <FileCode className="h-16 w-16" />
                                    </div>
                                )}

                                {/* Overlay con gradiente para mejor legibilidad */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <Link
                                        href={`/crm/email/plantillas/editar/${template.id}`}
                                        className="p-3 bg-white rounded-full text-gray-700 hover:text-purple-600 hover:scale-110 transition-all shadow-lg"
                                        title="Editar"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(template.id)}
                                        className="p-3 bg-white rounded-full text-gray-700 hover:text-red-600 hover:scale-110 transition-all shadow-lg"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-semibold text-gray-900 truncate" title={template.name}>
                                        {template.name}
                                    </h3>
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200 whitespace-nowrap capitalize">
                                        {template.category}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                                    {template.description || 'Sin descripción'}
                                </p>

                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                                    <span>Creado: {new Date(template.created_at).toLocaleDateString()}</span>
                                    {template.variables?.length > 0 && (
                                        <span className="flex items-center gap-1" title="Variables dinámicas">
                                            <FileCode className="h-3 w-3" /> {template.variables.length} vars
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
