"use client";

import { useState, useEffect } from 'react';
import { Search, Layout, X, Check } from 'lucide-react';

interface TemplateSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (template: any) => void;
}

export default function TemplateSelector({ isOpen, onClose, onSelect }: TemplateSelectorProps) {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadTemplates();
        }
    }, [isOpen]);

    async function loadTemplates() {
        setLoading(true);
        try {
            const response = await fetch('/api/email/templates');
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

    const filtered = templates.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Seleccionar Plantilla</h2>
                        <p className="text-sm text-gray-500">Elige un diseño base para tu campaña</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o asunto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-200 border-t-purple-600"></div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No se encontraron plantillas.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {filtered.map(template => (
                                <div
                                    key={template.id}
                                    onClick={() => setSelectedId(template.id)}
                                    className={`
                                        cursor-pointer bg-white rounded-lg border-2 overflow-hidden transition-all relative group
                                        ${selectedId === template.id ? 'border-purple-600 ring-2 ring-purple-100' : 'border-gray-200 hover:border-purple-300'}
                                    `}
                                >
                                    {/* Preview renderizado */}
                                    <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 relative overflow-hidden">
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
                                            <div className="flex items-center justify-center h-full">
                                                <Layout className="h-8 w-8 text-gray-300" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200 whitespace-nowrap capitalize">
                                                {template.category}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-2">{template.description || template.subject}</p>
                                    </div>

                                    {/* Selection Indicator */}
                                    {selectedId === template.id && (
                                        <div className="absolute top-2 right-2 bg-purple-600 text-white p-1.5 rounded-full shadow-lg">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            const selected = templates.find(t => t.id === selectedId);
                            if (selected) onSelect(selected);
                        }}
                        disabled={!selectedId}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Usar Plantilla
                    </button>
                </div>
            </div>
        </div>
    );
}
