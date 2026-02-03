"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Plus, Trash2, Filter, Search } from 'lucide-react';

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

    // Estados para selección de contactos
    const [contacts, setContacts] = useState<any[]>([]);
    const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [orgId, setOrgId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: crmUser } = await supabase
                .from('crm_users')
                .select('organization_id')
                .eq('id', user.id)
                .single();

            if (crmUser) {
                setOrgId(crmUser.organization_id);
                loadSegments(crmUser.organization_id);
                loadContacts(crmUser.organization_id);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function loadContacts(organizationId: string) {
        try {
            const { data, error } = await supabase
                .from('contacts')
                .select('id, name, email')
                .eq('organization_id', organizationId)
                .order('name', { ascending: true })
                .limit(100);

            if (error) {
                console.error('Error cargando contactos:', error);
                return;
            }

            console.log('Contactos cargados:', data?.length, data);
            setContacts(data || []);
        } catch (e) {
            console.error('Error cargando contactos:', e);
        }
    }

    async function loadSegments(organizationId: string) {
        try {
            // Usamos la API pero pasando el orgId
            const response = await fetch(`/api/email/segments?organization_id=${organizationId}`);
            const data = await response.json();

            // Obtener conteo de contactos (client-side join temporal, idealmente backend)
            // Nota: La API ya devuelve contact_count si se actualizó el route, verifiquemos.
            // Si la API devuelve los datos listos:
            // setSegments(data);

            // Si la API NO devuelve conteo (versión simple), mantenemos la lógica client-side pero filtrando por org
            // Para simplificar y asegurar consistencia con el route modificado, asumimos que devuelve objetos Segment

            setSegments(data || []);

        } catch (error) {
            console.error('Error cargando segmentos:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateSegment(e: React.FormEvent) {
        e.preventDefault();

        try {
            const response = await fetch('/api/email/segments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    filter_type: formData.type,
                    organization_id: orgId, // ID dinámico
                    contact_ids: formData.type === 'manual' ? Array.from(selectedContacts) : [],
                    // Si es dinámico sin filtros, el backend podría asumir "todos" o podríamos enviar un flag especial.
                    // Por ahora, filter_config: null implica 'todos' en nuestra lógica simplificada de backend si así lo definimos.
                    filter_config: formData.type === 'dynamic' ? { all: true } : null
                })
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || 'Error al crear segmento');

            alert('Segmento creado correctamente');
            setShowModal(false);
            setFormData({ name: '', description: '', type: 'manual' });
            setSelectedContacts(new Set());
            if (orgId) loadSegments(orgId);
        } catch (error: any) {
            console.error('Error creando segmento:', error);
            alert(`Error al crear el segmento: ${error.message}`);
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
            if (orgId) loadSegments(orgId);
        } catch (error) {
            console.error('Error eliminando segmento:', error);
            alert('Error al eliminar el segmento');
        }
    }

    const toggleContact = (id: string) => {
        const newSelected = new Set(selectedContacts);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedContacts(newSelected);
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
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
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
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
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
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
                                    <option value="dynamic">Dinámico (Todos)</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.type === 'manual'
                                        ? 'Manual: Selecciona contactos de la lista.'
                                        : 'Dinámico: Incluirá automáticamente a TODOS los contactos existentes y futuros.'}
                                </p>
                            </div>

                            {/* Selector de Contactos (Solo si es Manual) */}
                            {formData.type === 'manual' && (
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-medium text-gray-700">Seleccionar Contactos</label>
                                        <span className="text-xs text-purple-600 font-medium">
                                            {selectedContacts.size} seleccionados
                                        </span>
                                    </div>

                                    <div className="relative mb-3">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar contacto..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none text-gray-900 focus:border-purple-500 placeholder-gray-400"
                                        />
                                    </div>

                                    <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                                        {filteredContacts.length > 0 ? (
                                            filteredContacts.map(contact => (
                                                <div
                                                    key={contact.id}
                                                    onClick={() => toggleContact(contact.id)}
                                                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${selectedContacts.has(contact.id) ? 'bg-purple-100' : 'hover:bg-gray-200'
                                                        }`}
                                                >
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedContacts.has(contact.id) ? 'bg-purple-600 border-purple-600' : 'border-gray-400 bg-white'
                                                        }`}>
                                                        {selectedContacts.has(contact.id) && (
                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="text-sm">
                                                        <p className="font-medium text-gray-900">
                                                            {contact.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{contact.email}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-sm text-gray-500 py-4">
                                                {contacts.length === 0 ? 'Cargando o no hay contactos...' : 'No se encontraron coincidencias'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

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
                                        setSelectedContacts(new Set());
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
