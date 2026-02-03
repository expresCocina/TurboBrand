"use client";

import { useState } from 'react';
import { Save, X, ArrowRight, Zap, Mail, MessageSquare, CheckSquare, Calendar, Plus, Trash2 } from 'lucide-react';
import { Automation } from '@/lib/supabase';

interface AutomationBuilderProps {
    initialData?: Partial<Automation>;
    onSave: (data: Partial<Automation>) => Promise<void>;
    onCancel: () => void;
}

const TRIGGERS = [
    { id: 'new_lead', label: 'Nuevo Lead Creado', icon: Zap, description: 'Se ejecuta cuando se crea un contacto.' },
    { id: 'whatsapp_received', label: 'Mensaje de WhatsApp Recibido', icon: MessageSquare, description: 'Cuando un cliente escribe por WhatsApp.' },
    { id: 'deal_stage_changed', label: 'Etapa de Negocio Cambiada', icon: ArrowRight, description: 'Cuando una oportunidad se mueve de etapa.' },
];

const ACTIONS = [
    { id: 'send_email', label: 'Enviar Correo', icon: Mail },
    { id: 'create_task', label: 'Crear Tarea', icon: CheckSquare },
    { id: 'send_whatsapp', label: 'Enviar WhatsApp', icon: MessageSquare },
];

export default function AutomationBuilder({ initialData, onSave, onCancel }: AutomationBuilderProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [triggerType, setTriggerType] = useState(initialData?.trigger_type || '');
    const [selectedActions, setSelectedActions] = useState<any[]>(initialData?.actions as any[] || []);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !triggerType) return;

        setSaving(true);
        try {
            await onSave({
                name,
                description,
                trigger_type: triggerType,
                actions: selectedActions,
                is_active: true
            });
        } finally {
            setSaving(false);
        }
    };

    const addAction = (type: string) => {
        setSelectedActions([...selectedActions, { type, config: {} }]);
    };

    const removeAction = (index: number) => {
        setSelectedActions(selectedActions.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-full max-h-[85vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">
                    {initialData?.id ? 'Editar Automatización' : 'Nueva Automatización'}
                </h2>
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* 1. Basic Info */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Flujo</label>
                        <input
                            type="text"
                            required
                            placeholder="Ej: Bienvenida Nuevos Leads"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Opcional)</label>
                        <input
                            type="text"
                            placeholder="Breve descripción de lo que hace..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6"></div>

                {/* 2. Trigger Selection */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        Disparador (Trigger)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {TRIGGERS.map((trigger) => {
                            const Icon = trigger.icon;
                            return (
                                <button
                                    key={trigger.id}
                                    type="button"
                                    onClick={() => setTriggerType(trigger.id)}
                                    className={`p-4 rounded-xl border text-left transition-all ${triggerType === trigger.id
                                        ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500'
                                        : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className={`h-6 w-6 mb-3 ${triggerType === trigger.id ? 'text-purple-600' : 'text-gray-400'}`} />
                                    <div className="font-semibold text-gray-900 text-sm">{trigger.label}</div>
                                    <div className="text-xs text-gray-500 mt-1">{trigger.description}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {triggerType && (
                    <>
                        <div className="flex justify-center py-2">
                            <ArrowRight className="h-6 w-6 text-gray-300 transform rotate-90" />
                        </div>

                        {/* 3. Actions */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                Acciones
                            </h3>

                            {/* List of selected actions */}
                            <div className="space-y-3">
                                {selectedActions.map((action, index) => {
                                    const actionDef = ACTIONS.find(a => a.id === action.type);
                                    const Icon = actionDef?.icon || Zap;
                                    return (
                                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl relative group">
                                            <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                                                <Icon className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-medium text-gray-900">{actionDef?.label || action.type}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeAction(index)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Add Action Buttons */}
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-3">Agregar acción:</p>
                                <div className="flex gap-2 flex-wrap">
                                    {ACTIONS.map(action => (
                                        <button
                                            key={action.id}
                                            type="button"
                                            onClick={() => addAction(action.id)}
                                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center gap-2"
                                        >
                                            <Plus className="h-3 w-3" />
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 text-gray-600 font-medium hover:text-gray-800 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={saving || !name || !triggerType || selectedActions.length === 0}
                    className={`px-6 py-2.5 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2
                        ${saving || !name || !triggerType || selectedActions.length === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200'
                        }`}
                >
                    {saving ? 'Guardando...' : 'Guardar Automatización'}
                    {!saving && <Save className="h-4 w-4" />}
                </button>
            </div>
        </form>
    );
}
