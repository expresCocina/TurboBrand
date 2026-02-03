"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Building2, Key, Users, Globe, MapPin, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ConfiguracionPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    // Estado inicial completo
    const [orgData, setOrgData] = useState({
        id: '',
        name: '',
        domain: '',
        address: '',
        phone: '',
        industry: '',
        timezone: 'America/Bogota',
        currency: 'COP',
        description: '',
        whatsapp_access_token: '',
        whatsapp_business_id: '',
        whatsapp_verify_token: ''
    });

    useEffect(() => {
        if (user) loadData();
    }, [user]);

    async function loadData() {
        try {
            // Usamos maybeSingle para no lanzar error si hay 0 o multiples (tomamos el 1ro si hay multiples con limit)
            const { data, error } = await supabase
                .from('organizations')
                .select('*')
                .limit(1)
                .maybeSingle();

            if (data) {
                setOrgData({
                    id: data.id,
                    name: data.name || '',
                    domain: data.domain || '',
                    address: data.address || '',
                    phone: data.phone || '',
                    industry: data.industry || '',
                    timezone: data.timezone || 'America/Bogota',
                    currency: data.currency || 'COP',
                    description: data.description || '',
                    whatsapp_access_token: data.whatsapp_access_token || '',
                    whatsapp_business_id: data.whatsapp_business_id || '',
                    whatsapp_verify_token: data.whatsapp_verify_token || 'turbo_brand_verify_token'
                });
            } else {
                console.log("No se encontró organización, se creará al guardar.");
            }
        } catch (error) {
            console.error('Error cargando configuración:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            let error;

            if (orgData.id) {
                // UPDATE existente
                const res = await supabase
                    .from('organizations')
                    .update({
                        name: orgData.name,
                        domain: orgData.domain,
                        address: orgData.address,
                        phone: orgData.phone,
                        industry: orgData.industry,
                        timezone: orgData.timezone,
                        currency: orgData.currency,
                        description: orgData.description,
                        whatsapp_access_token: orgData.whatsapp_access_token,
                        whatsapp_business_id: orgData.whatsapp_business_id,
                        whatsapp_verify_token: orgData.whatsapp_verify_token
                    })
                    .eq('id', orgData.id);
                error = res.error;
            } else {
                // INSERT nueva (Auto-creación)
                const res = await supabase
                    .from('organizations')
                    .insert([{
                        name: orgData.name || 'Mi Organización',
                        domain: orgData.domain,
                        address: orgData.address,
                        phone: orgData.phone,
                        industry: orgData.industry,
                        timezone: orgData.timezone,
                        currency: orgData.currency,
                        description: orgData.description,
                        whatsapp_access_token: orgData.whatsapp_access_token,
                        whatsapp_business_id: orgData.whatsapp_business_id,
                        whatsapp_verify_token: orgData.whatsapp_verify_token || 'turbo_brand_verify_token'
                    }])
                    .select('id')
                    .single();

                if (res.data) {
                    setOrgData(prev => ({ ...prev, id: res.data.id })); // Guardamos el nuevo ID
                }
                error = res.error;
            }

            if (error) throw error;
            alert('Configuración guardada correctamente');

            // Recargar para asegurar consistencia
            loadData();

        } catch (error: any) {
            console.error('Error guardando:', error);
            if (error.message?.includes('column')) {
                alert('⚠️ Faltan columnas en la base de datos. Por favor ejecuta el script "supabase/fix_organization_rls.sql".');
            } else {
                alert('Error al guardar: ' + error.message);
            }
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>;

    // Estilo común para inputs
    const inputClass = "w-full px-4 py-2.5 bg-white border border-gray-300 shadow-sm rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-900 placeholder-gray-400";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Configuración</h1>
                        <p className="text-gray-500 mt-1">Gestiona los detalles de tu empresa y preferencias del sistema.</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar de Navegación */}
                    <nav className="lg:w-64 flex-shrink-0 space-y-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('general')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'general' ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Building2 className="h-5 w-5" />
                            General
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('integrations')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'integrations' ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Key className="h-5 w-5" />
                            Integraciones
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('regional')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'regional' ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Globe className="h-5 w-5" />
                            Regional
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('team')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'team' ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Users className="h-5 w-5" />
                            Equipo
                        </button>
                    </nav>

                    {/* Área de Contenido */}
                    <div className="flex-1">
                        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                            {/* GENERAL SETTINGS */}
                            {activeTab === 'general' && (
                                <div className="p-8 space-y-8">
                                    <div className="pb-6 border-b border-gray-100">
                                        <h2 className="text-xl font-semibold text-gray-900">Perfil de Empresa</h2>
                                        <p className="text-sm text-gray-500 mt-1">Información pública de tu organización.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div className="col-span-2">
                                            <label className={labelClass}>Nombre de la Organización</label>
                                            <input
                                                type="text"
                                                className={inputClass}
                                                value={orgData.name}
                                                onChange={e => setOrgData({ ...orgData, name: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className={labelClass}>Descripción Breve</label>
                                            <textarea
                                                rows={3}
                                                className={inputClass}
                                                placeholder="Ej: Agencia de Marketing Digital especializada en..."
                                                value={orgData.description}
                                                onChange={e => setOrgData({ ...orgData, description: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass + " flex items-center gap-2"}>
                                                <Globe className="h-4 w-4 text-gray-400" /> Sitio Web
                                            </label>
                                            <input
                                                type="text"
                                                className={inputClass}
                                                placeholder="turbobrand.com"
                                                value={orgData.domain}
                                                onChange={e => setOrgData({ ...orgData, domain: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass + " flex items-center gap-2"}>
                                                <Phone className="h-4 w-4 text-gray-400" /> Teléfono
                                            </label>
                                            <input
                                                type="text"
                                                className={inputClass}
                                                placeholder="+57 300 000 0000"
                                                value={orgData.phone}
                                                onChange={e => setOrgData({ ...orgData, phone: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className={labelClass + " flex items-center gap-2"}>
                                                <MapPin className="h-4 w-4 text-gray-400" /> Dirección Fiscal
                                            </label>
                                            <input
                                                type="text"
                                                className={inputClass}
                                                placeholder="Calle 123 # 45-67, Ciudad"
                                                value={orgData.address}
                                                onChange={e => setOrgData({ ...orgData, address: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className={labelClass}>Sector / Industria</label>
                                            <select
                                                className={inputClass}
                                                value={orgData.industry}
                                                onChange={e => setOrgData({ ...orgData, industry: e.target.value })}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="marketing">Marketing & Publicidad</option>
                                                <option value="technology">Tecnología y Software</option>
                                                <option value="retail">Retail y Ecommerce</option>
                                                <option value="services">Servicios Profesionales</option>
                                                <option value="health">Salud y Bienestar</option>
                                                <option value="real_estate">Bienes Raíces</option>
                                                <option value="other">Otro</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* REGIONAL SETTINGS */}
                            {activeTab === 'regional' && (
                                <div className="p-8 space-y-8">
                                    <div className="pb-6 border-b border-gray-100">
                                        <h2 className="text-xl font-semibold text-gray-900">Configuración Regional</h2>
                                        <p className="text-sm text-gray-500 mt-1">Moneda, horario e idioma por defecto.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div>
                                            <label className={labelClass}>Zona Horaria</label>
                                            <select
                                                className={inputClass}
                                                value={orgData.timezone}
                                                onChange={e => setOrgData({ ...orgData, timezone: e.target.value })}
                                            >
                                                <option value="America/Bogota">Bogotá (GMT-5)</option>
                                                <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                                                <option value="America/Lima">Lima (GMT-5)</option>
                                                <option value="America/Santiago">Santiago (GMT-4)</option>
                                                <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                                                <option value="America/New_York">New York (EST)</option>
                                                <option value="Europe/Madrid">Madrid (CET)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className={labelClass}>Moneda Principal</label>
                                            <select
                                                className={inputClass}
                                                value={orgData.currency}
                                                onChange={e => setOrgData({ ...orgData, currency: e.target.value })}
                                            >
                                                <option value="COP">Peso Colombiano (COP)</option>
                                                <option value="MXN">Peso Mexicano (MXN)</option>
                                                <option value="USD">Dólar Estadounidense (USD)</option>
                                                <option value="EUR">Euro (EUR)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* INTEGRATIONS (WHATSAPP) */}
                            {activeTab === 'integrations' && (
                                <div className="p-8 space-y-8">
                                    <div className="pb-6 border-b border-gray-100">
                                        <h2 className="text-xl font-semibold text-gray-900">Integraciones</h2>
                                        <p className="text-sm text-gray-500 mt-1">Conecta tus herramientas favoritas.</p>
                                    </div>

                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-emerald-100 w-24 h-24 rounded-full opacity-50 blur-xl"></div>

                                        <div className="flex items-start gap-4 relatie z-10">
                                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm text-2xl">
                                                📱
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-emerald-900">WhatsApp Business Cloud API</h3>
                                                <p className="text-sm text-emerald-700 mt-1 mb-4">
                                                    Conecta la API oficial de Meta para enviar y recibir mensajes directamente en el CRM.
                                                </p>

                                                <div className="space-y-4 bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-emerald-100">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Access Token</label>
                                                        <input
                                                            type="password"
                                                            placeholder="Pegar token EAAB..."
                                                            className="w-full px-4 py-2 bg-white border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-mono text-xs text-gray-600 shadow-sm"
                                                            value={orgData.whatsapp_access_token}
                                                            onChange={e => setOrgData({ ...orgData, whatsapp_access_token: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Phone Number ID</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Ej: 10567..."
                                                            className="w-full px-4 py-2 bg-white border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-mono text-xs text-gray-600 shadow-sm"
                                                            value={orgData.whatsapp_business_id}
                                                            onChange={e => setOrgData({ ...orgData, whatsapp_business_id: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Webhook Verify Token</label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                readOnly
                                                                className="flex-1 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-gray-500 font-mono text-xs shadow-inner"
                                                                value={orgData.whatsapp_verify_token}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => navigator.clipboard.writeText(orgData.whatsapp_verify_token)}
                                                                className="px-3 py-1 bg-white border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700 hover:bg-emerald-50 shadow-sm"
                                                            >
                                                                Copiar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TEAM SETTINGS */}
                            {activeTab === 'team' && (
                                <div className="p-12 text-center">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="h-10 w-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Gestión de Equipo</h3>
                                    <p className="text-gray-500 max-w-sm mx-auto mt-2">Próximamente podrás invitar miembros, asignar roles y gestionar permisos desde este panel.</p>
                                    <button className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium text-sm transition-colors opacity-50 cursor-not-allowed">
                                        Invitar Miembro
                                    </button>
                                </div>
                            )}

                            {/* Footer Sticky with Save Button */}
                            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end items-center">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 disabled:opacity-70 font-semibold"
                                >
                                    {saving ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-5 w-5" />
                                            Guardar Cambios
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
