"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RefreshCw, Play, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function EmailDebugPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [invoking, setInvoking] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            // Cargar campañas programadas
            const { data: scheduled } = await supabase
                .from('email_campaigns')
                .select('*')
                .in('status', ['scheduled', 'failed'])
                .order('scheduled_at', { ascending: true });

            setCampaigns(scheduled || []);

            // Intentar cargar logs (si tienes permisos de rpc, si no, lo haremos por API)
            // Como no tenemos un RPC específico, mostraremos lo que sabemos
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function forceRunCron() {
        setInvoking(true);
        try {
            const response = await fetch('https://turbo-brand.vercel.app/api/email/campaigns/process-scheduled', { // Intentamos llamar al endpoint directamente si existiera, o invocamos Edge Function via Supabase Rest
                // Pero como es Edge Function, la invocaremos via REST si sabemos la URL
            });

            // Simular invocación manual llamando al endpoint de proceso que creamos si la edge function falla
            alert('Para forzar la ejecución, por favor usa el botón "Invoke" en el dashboard de Supabase -> Edge Functions');
        } catch (error) {
            alert('Error invocando');
        } finally {
            setInvoking(false);
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <AlertTriangle className="text-orange-500" />
                Diagnóstico de Envíos Programados
            </h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Campañas en Cola</h2>
                    <button onClick={loadData} className="p-2 hover:bg-gray-100 rounded-full">
                        <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Programado Para (UTC)</th>
                                <th className="p-3">Hora Local Tuya</th>
                                <th className="p-3">¿Ya debió enviarse?</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {campaigns.map(c => {
                                const scheduledDate = new Date(c.scheduled_at);
                                const now = new Date();
                                const shouldHaveSent = scheduledDate <= now;

                                return (
                                    <tr key={c.id}>
                                        <td className="p-3 font-medium">{c.name}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="p-3 font-mono">{c.scheduled_at}</td>
                                        <td className="p-3 font-mono">{scheduledDate.toLocaleString()}</td>
                                        <td className="p-3">
                                            {shouldHaveSent ? (
                                                <span className="flex items-center gap-1 text-red-600 font-bold">
                                                    <AlertTriangle className="h-4 w-4" /> SÍ (Retrasado)
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-green-600">
                                                    <Clock className="h-4 w-4" /> Aún no
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {campaigns.length === 0 && <p className="text-center py-8 text-gray-500">No hay campañas programadas pendientes.</p>}
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-2">Posibles Causas de Error</h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                    <li>La <strong>zona horaria</strong> es diferente. Verifica la columna "Hora Local Tuya".</li>
                    <li>El <strong>Cron Job</strong> de Supabase no se está ejecutando (revisar Dashboard).</li>
                    <li>La <strong>Edge Function</strong> está fallando (revisar Logs en Supabase).</li>
                </ul>
            </div>
        </div>
    );
}
