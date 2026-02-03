"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, DollarSign, Calendar, Target, User } from 'lucide-react';
import Link from 'next/link';

export default function NuevaOportunidadPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState<any[]>([]); // Lista simplificada para select
    const [formData, setFormData] = useState({
        title: '',
        contact_id: '',
        value: 0,
        currency: 'COP',
        stage: 'lead',
        probability: 10,
        expected_close_date: '',
        description: ''
    });

    useEffect(() => {
        // Cargar contactos para el selector
        async function loadContacts() {
            const { data } = await supabase.from('contacts').select('id, name');
            setContacts(data || []);
        }
        loadContacts();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('opportunities')
                .insert([{
                    ...formData,
                }]);

            if (error) throw error;

            router.push('/crm/ventas');
        } catch (error) {
            console.error('Error creando oportunidad:', error);
            alert('Error al crear la oportunidad');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/crm/ventas"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-2 text-sm font-medium"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al Pipeline
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Nueva Oportunidad</h1>
                <p className="text-gray-500 mt-1">Registra una nueva oportunidad comercial para seguimiento.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">

                {/* 1. Detalles Principales */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Detalles de la Oportunidad</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Título de la Oportunidad *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ej: Venta de Lotes Campestres - Cliente Juan"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contacto Asociado *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <select
                                    required
                                    value={formData.contact_id}
                                    onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all cursor-pointer"
                                >
                                    <option value="">Seleccionar Contacto...</option>
                                    {contacts.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">¿No existe? <Link href="/crm/contactos/nuevo" className="text-purple-600 hover:underline">Crea el contacto primero</Link></p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Valor Estimado (COP)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Estado y Probabilidad */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Estado y Pronóstico</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Etapa Inicial</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Probabilidad de Cierre (%)</label>
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Cierre Estimada</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="date"
                                    value={formData.expected_close_date}
                                    onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción / Notas</label>
                    <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Detalles adicionales sobre la oportunidad..."
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all transform hover:scale-[1.02] shadow-md shadow-purple-200 disabled:opacity-70 font-medium text-lg"
                    >
                        <Save className="h-5 w-5" />
                        {loading ? 'Creando...' : 'Crear Oportunidad'}
                    </button>
                </div>
            </form>
        </div>
    );
}
