"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    Send,
    Save,
    ArrowLeft,
    User,
    Eye,
    Users,
    Clock,
    Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function NuevaCampanaPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Edición, 2: Revisión

    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        content: '',
        preview_text: '',
        segment_id: '' // '' = todos los contactos
    });

    const [sendMode, setSendMode] = useState<'now' | 'scheduled'>('now');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');

    const [stats, setStats] = useState({
        totalContacts: 0
    });

    const [segments, setSegments] = useState<any[]>([]);

    // Cargar segmentos y contactos
    useEffect(() => {
        async function loadData() {
            // Cargar segmentos
            const { data: segmentsData } = await supabase
                .from('contact_segments')
                .select('*')
                .order('name');

            setSegments(segmentsData || []);

            // Cargar número total de contactos
            const { count } = await supabase
                .from('contacts')
                .select('*', { count: 'exact', head: true })
                .not('email', 'is', null);

            setStats({ totalContacts: count || 0 });
        }
        loadData();
    }, []);

    const handleSend = async () => {
        // Validar datos básicos
        if (!formData.subject || !formData.content) {
            alert('Por favor completa el asunto y el contenido');
            return;
        }

        // Validar fecha programada si está en modo scheduled
        if (sendMode === 'scheduled') {
            if (!scheduledDate || !scheduledTime) {
                alert('Por favor selecciona fecha y hora para el envío programado');
                return;
            }

            const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
            const now = new Date();

            if (scheduledDateTime <= now) {
                alert('La fecha programada debe ser futura');
                return;
            }
        }

        const confirmMessage = sendMode === 'now'
            ? `¿Estás seguro de enviar esta campaña a ${stats.totalContacts} contactos AHORA?`
            : `¿Programar esta campaña para ${new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString('es-ES')}?`;

        if (!confirm(confirmMessage)) return;

        setLoading(true);
        try {
            const body: any = {
                name: formData.name || `Campaña ${new Date().toLocaleDateString()}`,
                subject: formData.subject,
                content: formData.content,
                segment_id: formData.segment_id || null,
                organization_id: '5e5b7400-1a66-42dc-880e-e501021edadc'
            };

            let endpoint = '/api/email/campaigns/send';
            let successMessage = '¡Campaña enviada exitosamente!';

            if (sendMode === 'scheduled') {
                // Programar envío
                body.scheduled_at = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
                endpoint = '/api/email/campaigns/schedule';
                successMessage = '¡Campaña programada exitosamente!';
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error);

            alert(result.message || successMessage);
            router.push('/crm/email');

        } catch (error: any) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/crm/email"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-2 text-sm font-medium"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a Email Marketing
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Nueva Campaña</h1>
                <p className="text-gray-500 mt-1">Crea y diseña tu correo masivo.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Formulario */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre de la Campaña (Interno)</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ej: Newsletter Febrero 2026"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Asunto del Correo</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ej: ¡Tenemos grandes noticias para ti!"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Segmento de Contactos</label>
                            <select
                                value={formData.segment_id}
                                onChange={(e) => setFormData({ ...formData, segment_id: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="">Todos los contactos</option>
                                {segments.map((segment) => (
                                    <option key={segment.id} value={segment.id}>
                                        {segment.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Selecciona un segmento específico o envía a todos los contactos
                            </p>
                        </div>

                        {/* Modo de Envío */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Modo de Envío</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSendMode('now')}
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${sendMode === 'now'
                                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Send className="h-5 w-5" />
                                    <span className="font-medium">Enviar Ahora</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSendMode('scheduled')}
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${sendMode === 'scheduled'
                                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Clock className="h-5 w-5" />
                                    <span className="font-medium">Programar</span>
                                </button>
                            </div>
                        </div>

                        {/* Campos de Fecha/Hora (solo si está en modo programado) */}
                        {sendMode === 'scheduled' && (
                            <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <Calendar className="h-4 w-4 inline mr-1" />
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        value={scheduledDate}
                                        onChange={(e) => setScheduledDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <Clock className="h-4 w-4 inline mr-1" />
                                        Hora
                                    </label>
                                    <input
                                        type="time"
                                        value={scheduledTime}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                                <p className="col-span-2 text-xs text-purple-700">
                                    La campaña se enviará automáticamente en la fecha y hora seleccionada
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contenido (HTML simple)</label>
                            <textarea
                                rows={12}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full p-4 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono text-sm placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-y"
                                placeholder="<h1>Hola!</h1><p>Escribe tu mensaje aquí...</p>"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Tip: Puedes usar HTML básico para dar formato.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Vista Previa y Acciones */}
                <div className="space-y-6">
                    {/* Resumen de Audiencia */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-600" />
                            Audiencia
                        </h3>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-sm">Destinatarios totales:</span>
                            <span className="font-bold text-gray-900">{stats.totalContacts}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                            Se enviará a todos los contactos activos en la base de datos.
                        </p>
                    </div>

                    {/* Vista Previa Rápida */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Eye className="h-4 w-4 text-purple-600" />
                            Vista Previa
                        </h3>
                        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50 min-h-[200px] text-sm overflow-auto">
                            {formData.content ? (
                                <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                            ) : (
                                <p className="text-gray-400 italic text-center mt-8">El contenido aparecerá aquí...</p>
                            )}
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
                        <button
                            onClick={handleSend}
                            disabled={loading || !formData.subject || !formData.content}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                            ) : sendMode === 'scheduled' ? (
                                <Clock className="h-4 w-4" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            {loading
                                ? (sendMode === 'scheduled' ? 'Programando...' : 'Enviando...')
                                : (sendMode === 'scheduled' ? 'Programar Campaña' : 'Enviar Campaña Ahora')
                            }
                        </button>

                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                            <Save className="h-4 w-4" />
                            Guardar Borrador
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
