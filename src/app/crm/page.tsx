"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
    Users,
    Mail,
    MessageSquare,
    TrendingUp,
    Target,
    Clock,
    CheckCircle
} from 'lucide-react';

interface DashboardStats {
    totalContacts: number;
    contactsChange: number;
    totalOpportunities: number;
    totalOpportunitiesValue: number;
    whatsappConversations: number;
    conversionRate: number;
    emailsSent: number;
    emailOpenRate: number;
}

interface PipelineStage {
    stage: string;
    count: number;
    value: number;
}

interface Activity {
    id: string;
    type: 'contact' | 'opportunity' | 'whatsapp' | 'task';
    message: string;
    time: string;
    created_at: string;
}

export default function CRMDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalContacts: 0,
        contactsChange: 0,
        totalOpportunities: 0,
        totalOpportunitiesValue: 0,
        whatsappConversations: 0,
        conversionRate: 0,
        emailsSent: 0,
        emailOpenRate: 0
    });
    const [pipeline, setPipeline] = useState<PipelineStage[]>([]);
    const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

    useEffect(() => {
        if (!authLoading && user) {
            loadDashboardData();
        } else if (!authLoading && !user) {
            // No user, stop loading (although layout protects this, good practice)
            setLoading(false);
        }
    }, [user, authLoading]);

    async function loadDashboardData() {
        if (!user) return;
        try {
            setLoading(true);

            // 1. Cargar estadísticas de contactos (GLOBAL)
            const { data: contacts, count: totalContacts, error: contactsError } = await supabase
                .from('contacts')
                .select('*', { count: 'exact' });

            if (contactsError) console.error('Dashboard - Contacts Error:', contactsError);

            // Calcular contactos del mes anterior para el cambio porcentual
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            const { count: lastMonthContacts } = await supabase
                .from('contacts')
                .select('*', { count: 'exact', head: true })
                .lt('created_at', lastMonth.toISOString());

            const contactsChange = lastMonthContacts && lastMonthContacts > 0
                ? Math.round(((totalContacts || 0) - lastMonthContacts) / lastMonthContacts * 100)
                : 0;

            // 2. Cargar oportunidades (GLOBAL)
            const { data: opportunities, count: totalOpportunities } = await supabase
                .from('opportunities')
                .select('*', { count: 'exact' });

            const totalOpportunitiesValue = opportunities?.reduce((sum, opp) => sum + (opp.value || 0), 0) || 0;

            // 3. Cargar conversaciones de WhatsApp (GLOBAL)
            const { count: whatsappConversations } = await supabase
                .from('whatsapp_conversations')
                .select('*', { count: 'exact', head: true });

            // 4. Calcular tasa de conversión (oportunidades ganadas / total contactos)
            const { count: wonOpportunities } = await supabase
                .from('opportunities')
                .select('*', { count: 'exact', head: true })
                .eq('stage', 'won');

            const conversionRate = totalContacts && totalContacts > 0
                ? Math.round((wonOpportunities || 0) / totalContacts * 100)
                : 0;

            // 5. Cargar estadísticas de Email (GLOBAL)
            const { data: sentCampaigns } = await supabase
                .from('email_campaigns')
                .select('total_sent, total_opened')
                .eq('status', 'sent');

            const totalEmailsSent = sentCampaigns?.reduce((sum, c) => sum + (c.total_sent || 0), 0) || 0;
            const totalEmailsOpened = sentCampaigns?.reduce((sum, c) => sum + (c.total_opened || 0), 0) || 0;
            const emailOpenRate = totalEmailsSent > 0 ? Math.round((totalEmailsOpened / totalEmailsSent) * 100) : 0;

            // 6. Cargar pipeline por etapas (GLOBAL)
            const stages = ['lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost'];
            const stageNames: { [key: string]: string } = {
                lead: 'Leads',
                contacted: 'Contactados',
                proposal: 'Propuesta',
                negotiation: 'Negociación',
                won: 'Ganados',
                lost: 'Perdidos'
            };

            const pipelineData: PipelineStage[] = [];
            for (const stage of stages) {
                const { data: stageOpps } = await supabase
                    .from('opportunities')
                    .select('value')
                    .eq('stage', stage);

                const count = stageOpps?.length || 0;
                const value = stageOpps?.reduce((sum, opp) => sum + (opp.value || 0), 0) || 0;

                pipelineData.push({
                    stage: stageNames[stage],
                    count,
                    value
                });
            }

            // 7. Cargar actividades recientes (GLOBAL)
            const activities: Activity[] = [];

            // Últimos contactos creados
            const { data: recentContacts } = await supabase
                .from('contacts')
                .select('name, created_at')
                .order('created_at', { ascending: false })
                .limit(5);

            recentContacts?.forEach(contact => {
                activities.push({
                    id: `contact-${contact.created_at}`,
                    type: 'contact',
                    message: `Nuevo contacto: ${contact.name}`,
                    time: getRelativeTime(contact.created_at),
                    created_at: contact.created_at
                });
            });

            // Últimas oportunidades creadas
            const { data: recentOpps } = await supabase
                .from('opportunities')
                .select('title, created_at')
                .order('created_at', { ascending: false })
                .limit(5);

            recentOpps?.forEach(opp => {
                activities.push({
                    id: `opp-${opp.created_at}`,
                    type: 'opportunity',
                    message: `Nueva oportunidad: ${opp.title}`,
                    time: getRelativeTime(opp.created_at),
                    created_at: opp.created_at
                });
            });

            // Ordenar actividades por fecha
            activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            // Actualizar estados
            setStats({
                totalContacts: totalContacts || 0,
                contactsChange,
                totalOpportunities: totalOpportunities || 0,
                totalOpportunitiesValue,
                whatsappConversations: whatsappConversations || 0,
                conversionRate,
                emailsSent: totalEmailsSent,
                emailOpenRate
            });

            setPipeline(pipelineData);
            setRecentActivities(activities.slice(0, 10));

        } catch (error) {
            console.error('Error cargando datos del dashboard:', error);
        } finally {
            setLoading(false);
        }
    }

    function getRelativeTime(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Hace un momento';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    }

    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(amount);
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            </div>
        );
    }

    const statsCards = [
        {
            label: 'Contactos Totales',
            value: stats.totalContacts.toLocaleString(),
            change: `${stats.contactsChange >= 0 ? '+' : ''}${stats.contactsChange}%`,
            icon: Users,
            color: 'bg-blue-500',
            positive: stats.contactsChange >= 0
        },
        {
            label: 'Oportunidades Activas',
            value: stats.totalOpportunities.toLocaleString(),
            change: formatCurrency(stats.totalOpportunitiesValue),
            icon: Target,
            color: 'bg-green-500',
            positive: true
        },
        {
            label: 'Emails Enviados',
            value: stats.emailsSent.toLocaleString(),
            change: `${stats.emailOpenRate}% Apertura`,
            icon: Mail,
            color: 'bg-indigo-500',
            positive: true
        },
        {
            label: 'Conversaciones WhatsApp',
            value: stats.whatsappConversations.toLocaleString(),
            change: 'Activas',
            icon: MessageSquare,
            color: 'bg-purple-500',
            positive: true
        },
        {
            label: 'Tasa de Conversión',
            value: `${stats.conversionRate}%`,
            change: 'Oportunidades ganadas',
            icon: TrendingUp,
            color: 'bg-orange-500',
            positive: true
        },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Bienvenido al CRM de Turbo Brand</p>

            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {statsCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                    <p className={`text-sm mt-1 ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.change}
                                    </p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pipeline */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Pipeline de Ventas</h2>
                        <Link href="/crm/ventas" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                            Ver todo →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {pipeline.filter(item => item.stage !== 'Perdidos').map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div>
                                    <p className="font-medium text-gray-900">{item.stage}</p>
                                    <p className="text-sm text-gray-600">{item.count} oportunidades</p>
                                </div>
                                <p className="text-lg font-semibold text-purple-600">{formatCurrency(item.value)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actividad Reciente */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
                    <div className="space-y-4">
                        {recentActivities.length > 0 ? (
                            recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        {activity.type === 'contact' && <Users className="h-5 w-5 text-blue-500" />}
                                        {activity.type === 'opportunity' && <Target className="h-5 w-5 text-green-500" />}
                                        {activity.type === 'whatsapp' && <MessageSquare className="h-5 w-5 text-purple-500" />}
                                        {activity.type === 'task' && <CheckCircle className="h-5 w-5 text-orange-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900">{activity.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">No hay actividad reciente</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/crm/contactos/nuevo" className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                        <Users className="h-8 w-8 text-purple-600 mb-2" />
                        <span className="text-sm font-medium text-gray-900">Nuevo Contacto</span>
                    </Link>
                    <button className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                        <Mail className="h-8 w-8 text-green-600 mb-2" />
                        <span className="text-sm font-medium text-gray-900">Nueva Campaña</span>
                    </button>
                    <Link href="/crm/ventas/nueva" className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        <Target className="h-8 w-8 text-blue-600 mb-2" />
                        <span className="text-sm font-medium text-gray-900">Nueva Oportunidad</span>
                    </Link>
                    <button className="flex flex-col items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                        <Clock className="h-8 w-8 text-orange-600 mb-2" />
                        <span className="text-sm font-medium text-gray-900">Nueva Tarea</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
