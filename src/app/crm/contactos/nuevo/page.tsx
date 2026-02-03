"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, User, Briefcase, Tag, Building, Phone, Mail, Globe, Hash } from 'lucide-react';
import Link from 'next/link';

import { checkAndRunAutomations } from '@/lib/automations';

export default function NuevoContactoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        sector: '',
        source: 'manual',
        lead_score: 50,
        address: '',
        city: '',
        department: '',
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            // Usamos el ID de Turbo Brand directamente (Obtenido de tu base de datos)
            const organizationId = '5e5b7400-1a66-42dc-880e-e501021edadc';



            // ... (inside component)

            const { data, error } = await supabase
                .from('contacts')
                .insert([{
                    ...formData,
                    organization_id: organizationId,
                }])
                .select()
                .single();

            if (error) throw error;

            // 🤖 EJECUTAR AUTOMATIZACIONES
            if (data) {
                // No esperamos esto (void) para no bloquear la UI
                checkAndRunAutomations('new_lead', data, supabase);
            }

            router.push(`/crm/contactos`);
        } catch (error) {
            console.error('Error creando contacto:', error);
            alert('Error al crear el contacto');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-8 max-w-5xl mx-auto min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link
                        href="/crm/contactos"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-2 text-sm font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a contactos
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Nuevo Contacto</h1>
                    <p className="text-gray-500 mt-1">Ingresa la información detallada para registrar un nuevo lead o cliente.</p>
                </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna Izquierda - Información Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tarjeta: Información Personal */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                    <User className="h-5 w-5" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Información Personal</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Nombre completo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Ej: Juan Pérez"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            placeholder="juan@empresa.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Teléfono
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            placeholder="+57 300 123 4567"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NUEVA Tarjeta: Ubicación */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Ubicación</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Ej: Calle 123 # 45 - 67"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Departamento
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Ej: Antioquia"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Ciudad
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Ej: Medellín"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta: Información Profesional */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Datos Profesionales</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Empresa
                                    </label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Empresa S.A.S"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Cargo
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Gerente Comercial"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Sector Industrial
                                    </label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.sector}
                                            onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Tecnología, Salud, etc."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha - Configuración y Score */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <Tag className="h-5 w-5" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Clasificación</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Fuente de origen
                                    </label>
                                    <select
                                        value={formData.source}
                                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all cursor-pointer"
                                    >
                                        <option value="manual">Entrada Manual</option>
                                        <option value="web">Sitio Web</option>
                                        <option value="whatsapp">WhatsApp</option>
                                        <option value="referral">Referido</option>
                                        <option value="event">Evento</option>
                                        <option value="cold_call">Llamada en frío</option>
                                    </select>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Lead Score Inicial
                                        </label>
                                        <span className={`text-sm font-bold ${formData.lead_score >= 80 ? 'text-green-600' :
                                            formData.lead_score >= 50 ? 'text-yellow-600' : 'text-red-500'
                                            }`}>
                                            {formData.lead_score}
                                        </span>
                                    </div>
                                    <div className="relative pt-1">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            value={formData.lead_score}
                                            onChange={(e) => setFormData({ ...formData, lead_score: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                        />
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>Frio (0)</span>
                                            <span>Tibio (50)</span>
                                            <span>Caliente (100)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all transform hover:scale-[1.02] shadow-md shadow-purple-200 disabled:opacity-70 font-medium"
                                    >
                                        <Save className="h-5 w-5" />
                                        {loading ? 'Guardando...' : 'Guardar Contacto'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
