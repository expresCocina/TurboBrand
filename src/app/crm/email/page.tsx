"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
    Mail,
    Plus,
    Send,
    BarChart2,
    Users,
    FileText,
    MoreVertical,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

export default function EmailMarketingPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSent: 0,
        openRate: 0,
        clickRate: 0,
        monthlyLimit: 3000 // Límite ejemplo plan free
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);

            // 1. Cargar Campañas
            const { data: campaignsData, error } = await supabase
                .from('email_campaigns')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setCampaigns(campaignsData || []);

            // 2. Calcular Estadísticas (Simuladas/Básicas por ahora hasta tener webhooks)
            // En un futuro, esto se calcularía sumando eventos de la tabla 'email_sends' o 'email_events'

            // Ejemplo simple: Contar campañas enviadas
            const sentCampaigns = campaignsData?.filter(c => c.status === 'sent') || [];
            // Asumimos un promedio de destinatarios por campaña para el demo, o si tuvieramos el count real
            // Como no guardamos el count en campaigns (mala practica corregible), estimamos o dejamos en 0.

            setStats(prev => ({
                ...prev,
                totalSent: sentCampaigns.length, // Esto es campañas enviadas, no emails individuales
                // openRate y clickRate vendrán de webhooks
            }));

        } catch (error) {
            console.error('Error cargando campañas:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 space-y-6 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Email Marketing</h1>
                    <p className="text-gray-600 mt-1">Gestiona tus campañas de correo y automatizaciones.</p>
                </div>
                <Link
                    href="/crm/email/nueva"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm font-medium"
                >
                    <Plus className="h-5 w-5" />
                    Nueva Campaña
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">Campañas Enviadas</p>
                        <Send className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSent}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 opacity-60">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">Tasa de Apertura</p>
                        <BarChart2 className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">--%</p>
                    <p className="text-xs text-gray-400">Requiere Webhhoks</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 opacity-60">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">Clicks</p>
                        <Users className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">--%</p>
                    <p className="text-xs text-gray-400">Requiere Webhhoks</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">Límite Mensual</p>
                        <FileText className="h-4 w-4 text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.monthlyLimit}</p>
                </div>
            </div>

            {/* Campaigns List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Campañas Recientes</h2>
                    <button onClick={loadData} className="text-sm text-purple-600 hover:text-purple-700 font-medium">Actualizar</button>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-purple-600"></div>
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No hay campañas creadas aún.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {campaigns.map((campaign) => (
                            <div key={campaign.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${campaign.status === 'sent' ? 'bg-green-100 text-green-600' :
                                                campaign.status === 'failed' ? 'bg-red-100 text-red-600' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900">{campaign.name}</h3>
                                            <p className="text-sm text-gray-500 truncate max-w-md">{campaign.subject}</p>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${campaign.status === 'sent'
                                                        ? 'bg-green-50 text-green-700 border border-green-100'
                                                        : campaign.status === 'failed'
                                                            ? 'bg-red-50 text-red-700 border border-red-100'
                                                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                    }`}>
                                                    {campaign.status === 'sent' && <><CheckCircle className="h-3 w-3" /> Enviado</>}
                                                    {campaign.status === 'failed' && <><AlertCircle className="h-3 w-3" /> Error</>}
                                                    {campaign.status === 'draft' && <><Clock className="h-3 w-3" /> Borrador</>}
                                                    {campaign.status === 'sending' && <><Clock className="h-3 w-3 animate-spin" /> Enviando...</>}
                                                </span>
                                                {campaign.sent_at && (
                                                    <span>{new Date(campaign.sent_at).toLocaleDateString()} {new Date(campaign.sent_at).toLocaleTimeString()}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats (Placeholder hasta tener webhooks) */}
                                    {campaign.status === 'sent' && (
                                        <div className="flex items-center gap-8 opacity-50 grayscale" title="Estadísticas requieren configuración de Webhooks">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-900">-</p>
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Abiertos</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-900">-</p>
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Clicks</p>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
