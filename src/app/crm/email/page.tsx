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
        monthlyLimit: 2000,
        monthlySent: 0
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

            // 2. Calcular Estadísticas Globales
            const sentCampaigns = campaignsData?.filter(c => c.status === 'sent') || [];

            // Sumar totales de todas las campañas
            const totalSent = sentCampaigns.reduce((sum, c) => sum + (c.total_sent || 0), 0);
            const totalOpened = sentCampaigns.reduce((sum, c) => sum + (c.total_opened || 0), 0);
            const totalClicked = sentCampaigns.reduce((sum, c) => sum + (c.total_clicked || 0), 0);

            // Calcular tasas
            const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
            const clickRate = totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0;

            // Obtener límite mensual y contador
            const orgId = '5e5b7400-1a66-42dc-880e-e501021edadc';

            const { data: org } = await supabase
                .from('organizations')
                .select('email_monthly_limit')
                .eq('id', orgId)
                .single();

            const monthlyLimit = org?.email_monthly_limit || 2000;

            // Contar emails enviados este mes
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();

            const { data: monthlyCount } = await supabase
                .rpc('get_monthly_email_count', {
                    p_organization_id: orgId,
                    p_month: currentMonth,
                    p_year: currentYear
                });

            setStats({
                totalSent: sentCampaigns.length,
                openRate,
                clickRate,
                monthlyLimit,
                monthlySent: monthlyCount || 0
            });

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
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">Tasa de Apertura</p>
                        <BarChart2 className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.openRate}%</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">Clicks</p>
                        <Users className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.clickRate}%</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">Límite Mensual</p>
                        <FileText className="h-4 w-4 text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.monthlySent} / {stats.monthlyLimit}</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all ${stats.monthlySent / stats.monthlyLimit > 0.8 ? 'bg-red-500' :
                                    stats.monthlySent / stats.monthlyLimit > 0.6 ? 'bg-yellow-500' :
                                        'bg-green-500'
                                }`}
                            style={{ width: `${Math.min((stats.monthlySent / stats.monthlyLimit) * 100, 100)}%` }}
                        />
                    </div>
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

                                    {/* Stats (Ahora con datos reales) */}
                                    {campaign.status === 'sent' && (
                                        <div className="flex items-center gap-8">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-900">{campaign.total_opened || 0}</p>
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Abiertos</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-900">{campaign.total_clicked || 0}</p>
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Clicks</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500">
                                                    {campaign.total_sent || 0} enviados
                                                </p>
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
