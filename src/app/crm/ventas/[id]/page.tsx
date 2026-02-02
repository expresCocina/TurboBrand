"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Trash2, DollarSign, Calendar, Target, User, Building, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function DetalleOportunidadPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [contact, setContact] = useState<any>(null);

    useEffect(() => {
        if (id) loadData();
    }, [id]);

    async function loadData() {
        try {
            setLoading(true);
            const { data: opp, error } = await supabase
                .from('opportunities')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setFormData(opp);

            // Cargar contacto asociado
            if (opp.contact_id) {
                const { data: contactData } = await supabase
                    .from('contacts')
                    .select('*')
                    .eq('id', opp.contact_id)
                    .single();
                setContact(contactData);
            }

        } catch (error) {
            console.error('Error cargando oportunidad:', error);
            // router.push('/crm/ventas');
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            const { error } = await supabase
                .from('opportunities')
                .update({
                    title: formData.title,
                    value: formData.value,
                    stage: formData.stage,
                    probability: formData.probability,
                    expected_close_date: formData.expected_close_date,
                    description: formData.description
                })
                .eq('id', id);

            if (error) throw error;
            alert('Oportunidad actualizada correctamente');
        } catch (error) {
            console.error('Error actualizando:', error);
            alert('Error al actualizar');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!confirm('¿Estás seguro de eliminar esta oportunidad? Esta acción no se puede deshacer.')) return;

        setDeleting(true);
        try {
            const { error } = await supabase
                .from('opportunities')
                .delete()
                .eq('id', id);

            if (error) throw error;
            router.push('/crm/ventas');
        } catch (error) {
            console.error('Error eliminando:', error);
            alert('Error al eliminar');
            setDeleting(false);
        }
    }

    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div></div>;
    if (!formData) return <div className="p-8">Oportunidad no encontrada</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link
                        href="/crm/ventas"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-2 text-sm font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Pipeline
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">{formData.title}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                            ${formData.stage === 'won' ? 'bg-green-100 text-green-700' :
                                formData.stage === 'lost' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}
                        >
                            {formData.stage === 'won' ? 'Ganada' :
                                formData.stage === 'lost' ? 'Perdida' :
                                    formData.stage === 'negotiation' ? 'Negociación' :
                                        formData.stage === 'proposal' ? 'Propuesta' :
                                            formData.stage === 'contacted' ? 'Contactado' : 'Lead Nuevo'}
                        </span>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-500 text-sm">Creada el {new Date(formData.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                    >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-md font-medium"
                    >
                        <Save className="h-4 w-4" />
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Principal: Formulario de Edición */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-2">Detalles de la Negociación</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Título</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Valor (COP)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha Cierre Estimada</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="date"
                                            value={formData.expected_close_date || ''}
                                            onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Etapa</label>
                                    <select
                                        value={formData.stage}
                                        onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="lead">Nuevos Leads</option>
                                        <option value="contacted">Contactados</option>
                                        <option value="proposal">Propuesta Enviada</option>
                                        <option value="negotiation">En Negociación</option>
                                        <option value="won">Ganada</option>
                                        <option value="lost">Perdida</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Probabilidad (%)</label>
                                    <div className="relative">
                                        <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.probability}
                                            onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notas / Descripción</label>
                                <textarea
                                    rows={6}
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna Lateral: Información del Contacto */}
                <div className="space-y-6">
                    {contact ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-2 flex items-center gap-2">
                                <User className="h-5 w-5 text-purple-600" />
                                Contacto Asociado
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                        {contact.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{contact.name}</p>
                                        <p className="text-sm text-gray-500">{contact.position}</p>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3 border-t border-gray-100">
                                    {contact.company && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Building className="h-4 w-4 text-gray-400" />
                                            {contact.company}
                                        </div>
                                    )}
                                    {contact.email && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <a href={`mailto:${contact.email}`} className="hover:text-purple-600 hover:underline">{contact.email}</a>
                                        </div>
                                    )}
                                    {contact.phone && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <a href={`https://wa.me/${contact.phone.replace(/\+/g, '')}`} target="_blank" className="hover:text-green-600 hover:underline">{contact.phone}</a>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href={`/crm/contactos`} // Idealmente iría al detalle del contacto
                                    className="block w-full text-center py-2 mt-4 text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors font-medium border border-purple-100"
                                >
                                    Ver perfil completo
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-500">
                            No hay contacto asociado
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
