"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Plus, Trash2, Filter } from 'lucide-react';

interface Segment {
    id: string;
    name: string;
    description: string;
    type: 'manual' | 'dynamic';
    filter_criteria: any;
    contact_count: number;
    created_at: string;
}

export default function SegmentosPage() {
    const [segments, setSegments] = useState<Segment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'manual' as 'manual' | 'dynamic'
    });

    useEffect(() => {
        loadSegments();
    }, []);

    async function loadSegments() {
        try {
            const { data, error } = await supabase
                .from('contact_segments')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Obtener conteo de contactos para cada segmento
            const segmentsWithCount = await Promise.all(
                (data || []).map(async (segment) => {
                    const { count } = await supabase
                        .from('contact_segment_members')
                        .select('*', { count: 'exact', head: true })
                        .eq('segment_id', segment.id);

                    return {
                        ...segment,
                        contact_count: count || 0
                    };
                })
            );

            setSegments(segmentsWithCount);
        } catch (error) {
            console.error('Error cargando segmentos:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateSegment(e: React.FormEvent) {
        e.preventDefault();

        try {
            const { error } = await supabase
                .from('contact_segments')
                .insert({
                    name: formData.name,
                    description: formData.description,
                    type: formData.type,
                    filter_criteria: null,
                    organization_id: '5e5b7400-1a66-42dc-880e-e501021edadc' // TODO: Obtener de sesión
                });

            if (error) throw error;

            alert('Segmento creado correctamente');
            setShowModal(false);
            setFormData({ name: '', description: '', type: 'manual' });
            loadSegments();
        } catch (error) {
            console.error('Error creando segmento:', error);
            alert('Error al crear el segmento');
        }
    }

    async function handleDeleteSegment(id: string) {
        if (!confirm('¿Estás seguro de eliminar este segmento?')) return;

        try {
            const { error } = await supabase
                .from('contact_segments')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Segmento eliminado');
            loadSegments();
        } catch (error) {
            console.error('Error eliminando segmento:', error);
            alert('Error al eliminar el segmento');
        }
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Segmentos de Contactos</h1>
                    <p className="text-gray-600 mt-1">Organiza tus contactos en grupos para campañas dirigidas</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                    <Plus className="h-5 w-5" />
                    Nuevo Segmento
                </button>
            </div>

            {/* Lista de Segmentos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {segments.length === 0 ? (
                    <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay segmentos</h3>
                        <p className="text-gray-600 mb-4">Crea tu primer segmento para organizar tus contactos</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                            <Plus className="h-5 w-5" />
                            Crear Segmento
                        </button>
                    </div>
                ) : (
                    segments.map((segment) => (
                        <div
                            key={segment.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        {segment.type === 'dynamic' ? (
                                            <Filter className="h-6 w-6 text-purple-600" />
                                        ) : (
                                            <Users className="h-6 w-6 text-purple-600" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{segment.name}</h3>
                                        <span className="text-xs text-gray-500 capitalize">{segment.type}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteSegment(segment.id)}
                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>

                            {segment.description && (
                                <p className="text-sm text-gray-600 mb-4">{segment.description}</p>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users className="h-4 w-4" />
                                    <span className="font-medium">{segment.contact_count}</span>
                                    <span>contactos</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Crear Segmento */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuevo Segmento</h2>

                        <form onSubmit={handleCreateSegment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del Segmento
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                                    placeholder="Ej: Clientes VIP"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                                    placeholder="Describe este segmento..."
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                                >
                                    <option value="manual">Manual</option>
                                    <option value="dynamic">Dinámico</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Manual: Agregas contactos manualmente. Dinámico: Se actualiza automáticamente según criterios.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                >
                                    Crear Segmento
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setFormData({ name: '', description: '', type: 'manual' });
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
