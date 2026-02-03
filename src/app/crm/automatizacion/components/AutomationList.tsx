"use client";

import { useState } from 'react';
import { Automation } from '@/lib/supabase';
import { Play, Pause, Trash2, Edit, Plus, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface AutomationListProps {
    automations: AutomationWithStats[];
    onEdit: (automation: AutomationWithStats) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string, active: boolean) => void;
    onCreate: () => void;
}

// Interfaz extendida para incluir stats simulados o joins futuros
export interface AutomationWithStats extends Automation {
    run_count?: number;
    last_run_at?: string;
}

export default function AutomationList({ automations, onEdit, onDelete, onToggle, onCreate }: AutomationListProps) {
    if (automations.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Play className="h-8 w-8 text-purple-600 ml-1" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sin Automatizaciones</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    Crea tu primer flujo de trabajo para automatizar tareas repetitivas y ahorrar tiempo.
                </p>
                <button
                    onClick={onCreate}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors shadow-sm inline-flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Crear Nueva Automatización
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Flujos Activos ({automations.length})</h2>
                <button
                    onClick={onCreate}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Nueva Automatización
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {automations.map((auto) => (
                    <div
                        key={auto.id}
                        className={`bg-white rounded-xl border p-5 transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${auto.is_active ? 'border-gray-200' : 'border-gray-200 opacity-75 bg-gray-50'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${auto.is_active ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-500'}`}>
                                <Play className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg">{auto.name}</h3>
                                <p className="text-sm text-gray-500 mb-1">{auto.description || 'Sin descripción'}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <span className="flex items-center gap-1 font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600 uppercase tracking-wide">
                                        Trigger: {auto.trigger_type}
                                    </span>
                                    {auto.last_run_at && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            Ejecutado {formatDistanceToNow(new Date(auto.last_run_at), { addSuffix: true, locale: es })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center">
                            <button
                                onClick={() => onToggle(auto.id, !auto.is_active)}
                                className={`p-2 rounded-lg border transition-colors ${auto.is_active
                                        ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                                        : 'border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                                    }`}
                                title={auto.is_active ? 'Desactivar' : 'Activar'}
                            >
                                {auto.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </button>
                            <button
                                onClick={() => onEdit(auto)}
                                className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-transparent hover:border-purple-100"
                                title="Editar"
                            >
                                <Edit className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => onDelete(auto.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                title="Eliminar"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
