"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    Save,
    ArrowLeft,
    Calendar,
    Clock,
    AlertCircle,
    Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';

export default function NuevaTareaPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState<any[]>([]);
    const [opportunities, setOpportunities] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        due_time: '09:00',
        priority: 'medium',
        related_to_type: 'contact', // contact | opportunity
        related_to_id: '',
    });

    useEffect(() => {
        loadRelations();
    }, []);

    async function loadRelations() {
        // Cargar contactos y oportunidades para el selector "Relacionado con"
        const { data: contactsData } = await supabase.from('contacts').select('id, name');
        const { data: oppsData } = await supabase.from('opportunities').select('id, title');

        setContacts(contactsData || []);
        setOpportunities(oppsData || []);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            // Combinar fecha y hora
            const combinedDate = new Date(`${formData.due_date}T${formData.due_time}:00`);

            // Obtener ID de organización (Hardcoded safe fallback)
            const organizationId = '5e5b7400-1a66-42dc-880e-e501021edadc';

            const { error } = await supabase
                .from('tasks')
                .insert([{
                    title: formData.title,
                    description: formData.description,
                    due_date: combinedDate.toISOString(),
                    priority: formData.priority,
                    related_to_type: formData.related_to_type,
                    related_to_id: formData.related_to_id || null, // Null si está vacío
                    status: 'pending',
                    organization_id: organizationId
                }]);

            if (error) throw error;

            router.push('/crm/tareas');
            router.refresh();
        } catch (error) {
            console.error('Error creando tarea:', error);
            alert('Error al crear la tarea. Revisa la consola.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/crm/tareas"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-2 text-sm font-medium"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a Tareas
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Nueva Tarea</h1>
                <p className="text-gray-500 mt-1">Programa una nueva actividad o recordatorio.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
                {/* 1. Detalles de la Tarea */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Información Principal</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Título de la Tarea *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ej: Llamar cliente seguimiento propuesta"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                                placeholder="Detalles adicionales sobre la tarea..."
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Fecha y Prioridad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Vencimiento *</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="date"
                                required
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Hora</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="time"
                                value={formData.due_time}
                                onChange={(e) => setFormData({ ...formData, due_time: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Prioridad</label>
                        <div className="relative">
                            <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all cursor-pointer"
                            >
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                                <option value="urgent">Urgente</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 3. Relación (Opcional) */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Relacionado con (Opcional)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Registro</label>
                            <select
                                value={formData.related_to_type}
                                onChange={(e) => {
                                    setFormData({ ...formData, related_to_type: e.target.value, related_to_id: '' });
                                }}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            >
                                <option value="contact">Contacto</option>
                                <option value="opportunity">Oportunidad</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                {formData.related_to_type === 'contact' ? 'Seleccionar Contacto' : 'Seleccionar Oportunidad'}
                            </label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <select
                                    value={formData.related_to_id}
                                    onChange={(e) => setFormData({ ...formData, related_to_id: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all cursor-pointer"
                                >
                                    <option value="">-- Ninguno --</option>
                                    {formData.related_to_type === 'contact' ? (
                                        contacts.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))
                                    ) : (
                                        opportunities.map(o => (
                                            <option key={o.id} value={o.id}>{o.title}</option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all transform hover:scale-[1.02] shadow-md shadow-purple-200 disabled:opacity-70 font-medium text-lg"
                    >
                        <Save className="h-5 w-5" />
                        {loading ? 'Guardando...' : 'Crear Tarea'}
                    </button>
                </div>
            </form>
        </div>
    );
}
