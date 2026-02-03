"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Clock, Save, Trash2, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function EditCampaignPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Estados
    const [segments, setSegments] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        content: '',
        segment_id: '',
        status: ''
    });
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);

            // 1. Cargar Segmentos
            const { data: segmentsData } = await supabase
                .from('contact_segments')
                .select('id, name');
            setSegments(segmentsData || []);

            // 2. Cargar Campaña
            const { data: campaign, error } = await supabase
                .from('email_campaigns')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (!campaign) throw new Error('Campaña no encontrada');

            // Solo permitir editar si no se ha enviado
            if (campaign.status === 'sent' || campaign.status === 'sending') {
                alert('No se puede editar una campaña que ya se envió o se está enviando');
                router.push('/crm/email');
                return;
            }

            setFormData({
                name: campaign.name,
                subject: campaign.subject,
                content: campaign.content,
                segment_id: campaign.segment_id || '',
                status: campaign.status
            });

            // Parsear fecha programada si existe
            if (campaign.scheduled_at) {
                const date = new Date(campaign.scheduled_at);
                // Ajustar a zona horaria local para los inputs
                // Formato YYYY-MM-DD
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');

                setScheduledDate(`${year}-${month}-${day}`);
                setScheduledTime(`${hours}:${minutes}`);
            }

        } catch (error) {
            console.error('Error cargando datos:', error);
            alert(`Error al cargar la campaña: ${(error as any)?.message || 'Error desconocido'}`);
            router.push('/crm/email');
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async (newStatus?: string) => {
        if (!formData.subject || !formData.content) {
            alert('Por favor completa el asunto y el contenido');
            return;
        }

        if (!scheduledDate || !scheduledTime) {
            alert('Debes definir fecha y hora para programar');
            return;
        }

        // Validar fecha futura
        const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
        const now = new Date();

        if (scheduledDateTime <= now) {
            alert('La fecha programada debe ser futura');
            return;
        }

        setSaving(true);
        try {
            const body = {
                id: id,
                name: formData.name,
                subject: formData.subject,
                content: formData.content,
                segment_id: formData.segment_id || null,
                scheduled_at: scheduledDateTime.toISOString(),
                status: newStatus || 'scheduled'
            };

            const response = await fetch('/api/email/campaigns/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error('Error al actualizar');

            alert('Campaña actualizada y reprogramada correctamente');
            router.push('/crm/email');

        } catch (error: any) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de eliminar esta campaña?')) return;

        try {
            const { error } = await supabase
                .from('email_campaigns')
                .delete()
                .eq('id', id);

            if (error) throw error;
            router.push('/crm/email');
        } catch (error) {
            console.error('Error eliminando:', error);
            alert('Error al eliminar la campaña');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/crm/email" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Editar Campaña Programada</h1>
                        <p className="text-gray-500">Modifica los detalles o cambia la fecha de envío</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Formulario */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">

                        {/* Nombre Interno */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre de la Campaña</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>

                        {/* Asunto */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Asunto del Correo</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>

                        {/* Segmento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <Users className="h-4 w-4" /> Segmento
                            </label>
                            <select
                                value={formData.segment_id}
                                onChange={(e) => setFormData({ ...formData, segment_id: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                            >
                                <option value="">Todos los contactos</option>
                                {segments.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Reprogramación */}
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <h3 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                                <Clock className="h-4 w-4" /> Reprogramar Envío
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha</label>
                                    <input
                                        type="date"
                                        value={scheduledDate}
                                        onChange={(e) => setScheduledDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Hora</label>
                                    <input
                                        type="time"
                                        value={scheduledTime}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contenido */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contenido (HTML)</label>
                            <textarea
                                rows={10}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full p-4 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Acciones */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Acciones</h3>

                        <button
                            onClick={() => handleSave()}
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 mb-3"
                        >
                            {saving ? (
                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>

                        <div className="text-sm text-gray-500 text-center mt-4">
                            Status actual: <span className="font-mono font-bold uppercase">{formData.status}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
