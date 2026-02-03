"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Code, HelpCircle, Variable } from 'lucide-react';
import Link from 'next/link';
import { replaceVariables, getExampleVariables, extractVariables } from '@/lib/templateEngine';

interface TemplateEditorProps {
    initialData?: any;
    mode: 'create' | 'edit';
}

export default function TemplateEditor({ initialData, mode }: TemplateEditorProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        category: 'general',
        description: '',
        html_content: ''
    });

    // Cargar datos iniciales si es modo edición
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                subject: initialData.subject || '',
                category: initialData.category || 'general',
                description: initialData.description || '',
                html_content: initialData.html_content || ''
            });
        }
    }, [initialData]);

    // Calcular variables detectadas
    const detectedVariables = extractVariables(formData.html_content);

    // Generar preview
    const previewContent = replaceVariables(formData.html_content, getExampleVariables());

    async function handleSave() {
        if (!formData.name || !formData.html_content) {
            alert('Nombre y contenido son obligatorios');
            return;
        }

        setSaving(true);
        try {
            const endpoint = mode === 'create'
                ? '/api/email/templates'
                : `/api/email/templates/${initialData.id}`;

            const method = mode === 'create' ? 'POST' : 'PUT';

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    variables: detectedVariables
                })
            });

            if (!response.ok) throw new Error('Error al guardar');

            router.push('/crm/email/plantillas');
            router.refresh();

        } catch (error) {
            console.error(error);
            alert('Error al guardar la plantilla');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="p-6 min-h-screen bg-gray-50 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/crm/email/plantillas" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {mode === 'create' ? 'Nueva Plantilla' : 'Editar Plantilla'}
                        </h1>
                        <p className="text-gray-600 text-sm">Diseña tu correo. Usa {"{{variable}}"} para contenido dinámico.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-200 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('edit')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'edit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <Code className="h-4 w-4 inline mr-2" />
                            Código
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'preview' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <Eye className="h-4 w-4 inline mr-2" />
                            Vista Previa
                        </button>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
                    >
                        {saving ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span> : <Save className="h-4 w-4" />}
                        Guardar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
                {/* Left Panel: Settings & Variables */}
                <div className="space-y-6 overflow-y-auto">
                    {/* General Info */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-4">
                        <h3 className="font-semibold text-gray-900 border-b pb-2">Información General</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Plantilla</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ej: Bienvenida Clientes 2024"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Asunto (Default)</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="Ej: ¡Bienvenido a Turbo Brand!"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                            >
                                <option value="general">General</option>
                                <option value="newsletter">Newsletter</option>
                                <option value="promotional">Promocional</option>
                                <option value="transactional">Transaccional</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Variable Guide */}
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <Variable className="h-4 w-4" /> Variables Disponibles
                        </h3>
                        <p className="text-xs text-blue-700 mb-4">Usa estas variables en tu HTML para personalizar el correo.</p>

                        <div className="space-y-2">
                            {[
                                { name: 'nombre', desc: 'Nombre del contacto' },
                                { name: 'email', desc: 'Email del contacto' },
                                { name: 'empresa', desc: 'Nombre de la empresa' },
                                { name: 'cargo', desc: 'Cargo del contacto' },
                                { name: 'fecha', desc: 'Fecha actual' }
                            ].map((v) => (
                                <div key={v.name} className="flex items-center justify-between text-sm bg-white/50 p-2 rounded cursor-pointer hover:bg-white transition-colors"
                                    onClick={() => {
                                        // TODO: Insertar variable en cursor (si fuera posible con este textarea simple)
                                        navigator.clipboard.writeText(`{{${v.name}}}`);
                                        alert(`Variable {{${v.name}}} copiada`);
                                    }}>
                                    <code className="text-purple-700 font-mono text-xs bg-purple-50 px-1 py-0.5 rounded">{`{{${v.name}}}`}</code>
                                    <span className="text-blue-600 text-xs">{v.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detected Variables Stats */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Variables Detectadas ({detectedVariables.length})</h3>
                        <div className="flex flex-wrap gap-2">
                            {detectedVariables.length > 0 ? detectedVariables.map(v => (
                                <span key={v} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-mono border border-gray-200">
                                    {v}
                                </span>
                            )) : (
                                <span className="text-gray-400 text-xs italic">No se detectaron variables aún.</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Editor / Preview */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-full">
                    {activeTab === 'edit' ? (
                        <textarea
                            value={formData.html_content}
                            onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                            className="w-full h-full p-4 font-mono text-sm outline-none resize-none"
                            placeholder="<html><body><h1>Hola {{nombre}}...</h1></body></html>"
                            spellCheck={false}
                        />
                    ) : (
                        <div className="h-full flex flex-col">
                            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 text-xs text-gray-500 flex justify-between">
                                <span>Vista previa con datos de ejemplo</span>
                                <span>Ancho: 100%</span>
                            </div>
                            <iframe
                                srcDoc={previewContent}
                                className="w-full flex-1 border-none bg-white"
                                title="Email Preview"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
