"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
    CheckCircle,
    Circle,
    Clock,
    Calendar,
    AlertCircle,
    Plus,
    Search,
    Filter,
    MoreVertical,
    ArrowRight
} from 'lucide-react';

interface Task {
    id: string;
    title: string;
    description: string;
    due_date: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    related_to_type: string;
    created_at: string;
}

export default function TareasPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('pending');

    useEffect(() => {
        loadTasks();
    }, [filterStatus]);

    async function loadTasks() {
        setLoading(true);
        try {
            let query = supabase
                .from('tasks')
                .select('*')
                .order('due_date', { ascending: true });

            if (filterStatus === 'pending') {
                query = query.neq('status', 'completed');
            } else if (filterStatus === 'completed') {
                query = query.eq('status', 'completed');
            }

            const { data, error } = await query;
            if (error) throw error;
            setTasks(data || []);
        } catch (error) {
            console.error('Error cargando tareas:', error);
        } finally {
            setLoading(false);
        }
    }

    async function toggleTaskStatus(task: Task) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;

        try {
            // Optimistic update
            setTasks(tasks.map(t =>
                t.id === task.id ? { ...t, status: newStatus as any } : t
            ));

            const { error } = await supabase
                .from('tasks')
                .update({ status: newStatus, completed_at: completedAt })
                .eq('id', task.id);

            if (error) throw error;

            // Si estamos filtrando, recargar para que desaparezca/aparezca correctamente
            if (filterStatus !== 'all') {
                loadTasks();
            }

        } catch (error) {
            console.error('Error actualizando tarea:', error);
            loadTasks(); // Revertir en caso de error
        }
    }

    const priorityColors = {
        low: 'bg-blue-100 text-blue-800',
        medium: 'bg-gray-100 text-gray-800',
        high: 'bg-orange-100 text-orange-800',
        urgent: 'bg-red-100 text-red-800'
    };

    const priorityLabels = {
        low: 'Baja',
        medium: 'Media',
        high: 'Alta',
        urgent: 'Urgente'
    };

    return (
        <div className="p-6 space-y-6 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tareas</h1>
                    <p className="text-gray-500 mt-1">Gestiona tus actividades pendientes y recordatorios.</p>
                </div>
                <Link
                    href="/crm/tareas/nueva"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm font-medium"
                >
                    <Plus className="h-5 w-5" />
                    Nueva Tarea
                </Link>
            </div>

            {/* Filtros y Búsqueda */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar tareas..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterStatus('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'pending'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                            }`}
                    >
                        Pendientes
                    </button>
                    <button
                        onClick={() => setFilterStatus('completed')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'completed'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                            }`}
                    >
                        Completadas
                    </button>
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'all'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                            }`}
                    >
                        Todas
                    </button>
                </div>
            </div>

            {/* Lista de Tareas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center p-12 text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-lg font-medium text-gray-900">No hay tareas</p>
                        <p className="mb-6">No tienes tareas en esta vista.</p>
                        <Link
                            href="/crm/tareas/nueva"
                            className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
                        >
                            Crear mi primera tarea
                        </Link>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {tasks.map((task) => (
                            <li key={task.id} className="group hover:bg-gray-50 transition-colors">
                                <div className="flex items-center p-4 sm:p-6 gap-4">
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => toggleTaskStatus(task)}
                                        className={`flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full border-2 transition-all ${task.status === 'completed'
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'border-gray-300 text-transparent hover:border-purple-500'
                                            }`}
                                    >
                                        <CheckCircle className="h-4 w-4 fill-current" />
                                    </button>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className={`text-base font-medium truncate ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'
                                                }`}>
                                                {task.title}
                                            </h3>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
                                                {priorityLabels[task.priority]}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            {task.due_date && (
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span className={new Date(task.due_date) < new Date() && task.status !== 'completed' ? 'text-red-500 font-medium' : ''}>
                                                        {new Date(task.due_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                            {task.related_to_type && (
                                                <div className="hidden sm:flex items-center gap-1.5 lowercase">
                                                    <span className="capitalize">{task.related_to_type}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
