"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    Send,
    Save,
    ArrowLeft,
    User,
    Eye,
    Users
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
        preview_text: ''
    });

    const [stats, setStats] = useState({
        totalContacts: 0
    });

    // Cargar número de contactos para mostrar el alcance potencial
    useState(() => {
        async function loadStats() {
            const { count } = await supabase.from('contacts').select('*', { count: 'exact', head: true });
            setStats({ totalContacts: count || 0 });
        }
        loadStats();
    });

    const handleSend = async () => {
        if (!confirm(`¿Estás seguro de enviar esta campaña a ${stats.totalContacts} contactos?`)) return;

        setLoading(true);
        try {
            // 1. Guardar la campaña en DB como 'sending'
            // NOTA: En un caso real, esto llamaría a un API Route que maneje la cola de envíos.
            // Por simplicidad inicial, llamaremos a un API Route que hace el broadcast inmediato.

            const response = await fetch('/api/email/campaigns/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    subject: formData.subject,
                    content: formData.content,
                    organization_id: '5e5b7400-1a66-42dc-880e-e501021edadc' // Hardcoded ID
                })
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error);

            alert('¡Campaña enviada exitosamente!');
            router.push('/crm/email');

        } catch (error: any) {
            console.error('Error enviando campaña:', error);
            alert(`Error al enviar: ${error.message}`);
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
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            {loading ? 'Enviando...' : 'Enviar Campaña Ahora'}
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
