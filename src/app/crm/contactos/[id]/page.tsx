"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Contact } from '@/lib/supabase';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Mail,
    Phone,
    Building2,
    Briefcase,
    Tag,
    TrendingUp,
    CheckCircle,
    Calendar,
    Plus
} from 'lucide-react';
import Link from 'next/link';

interface Task {
    id: string;
    title: string;
    description: string;
    due_date: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'completed';
    created_at: string;
}

export default function ContactoDetallePage() {
    const params = useParams();
    const router = useRouter();
    const [contact, setContact] = useState<Contact | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            loadContactAndTasks(params.id as string);
        }
    }, [params.id]);

    async function loadContactAndTasks(id: string) {
        try {
            // 1. Cargar contacto
            const { data: contactData, error: contactError } = await supabase
                .from('contacts')
                .select('*')
                .eq('id', id)
                .single();

            if (contactError) throw contactError;
            setContact(contactData);

            // 2. Cargar tareas relacionadas
            const { data: tasksData, error: tasksError } = await supabase
                .from('tasks')
                .select('*')
                .eq('related_to_type', 'contact')
                .eq('related_to_id', id)
                .order('created_at', { ascending: false });

            if (tasksError) console.error("Error cargando tareas:", tasksError);
            setTasks(tasksData || []);

        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!contact) return;
        if (!confirm('¿Estás seguro de eliminar este contacto?')) return;

        try {
            const { error } = await supabase
                .from('contacts')
                .delete()
                .eq('id', contact.id);

            if (error) throw error;
            router.push('/crm/contactos');
        } catch (error) {
            console.error('Error eliminando contacto:', error);
            alert('Error al eliminar el contacto');
        }
    }

    async function toggleTaskStatus(task: Task) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;

        try {
            // Optimistic update
            setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus as any } : t));

            await supabase
                .from('tasks')
                .update({ status: newStatus, completed_at: completedAt })
                .eq('id', task.id);
        } catch (error) {
            console.error('Error actualizando tarea:', error);
        }
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!contact) {
        return <div className="p-6 text-gray-600">Contacto no encontrado</div>;
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/crm/contactos"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a contactos
                </Link>

                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-purple-600">
                                {contact.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{contact.name}</h1>
                            {contact.position && contact.company && (
                                <p className="text-gray-600 mt-1">
                                    {contact.position} en {contact.company}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={`/crm/contactos/${contact.id}/editar`}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm"
                        >
                            <Edit className="h-4 w-4" />
                            Editar
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
                        >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna Central - Información y Actividad */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tarjeta Info */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h2>
                        <div className="space-y-3">
                            {contact.email && (
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <a href={`mailto:${contact.email}`} className="text-purple-600 hover:underline">{contact.email}</a>
                                    </div>
                                </div>
                            )}
                            {contact.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-600">Teléfono</p>
                                        <a href={`tel:${contact.phone}`} className="text-purple-600 hover:underline">{contact.phone}</a>
                                    </div>
                                </div>
                            )}
                            {contact.company && (
                                <div className="flex items-center gap-3">
                                    <Building2 className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-600">Empresa</p>
                                        <p className="text-gray-900">{contact.company}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tareas y Actividad */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Tareas y Actividades</h2>
                            <Link
                                href="/crm/tareas/nueva"
                                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                            >
                                <Plus className="h-4 w-4" />
                                Nueva Tarea
                            </Link>
                        </div>

                        {tasks.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <p className="text-sm">No hay tareas asociadas a este contacto.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {tasks.map((task) => (
                                    <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-purple-200 transition-colors">
                                        <button
                                            onClick={() => toggleTaskStatus(task)}
                                            className={`mt-0.5 flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full border transition-all ${task.status === 'completed'
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'border-gray-300 hover:border-purple-500'
                                                }`}
                                        >
                                            <CheckCircle className="h-3.5 w-3.5 fill-current" />
                                        </button>
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                                {task.title}
                                            </p>
                                            {task.description && <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>}
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                                    task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {task.priority === 'urgent' ? 'Urgente' : task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                                                </span>
                                                {task.due_date && (
                                                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(task.due_date).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Derecho */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-700">Lead Score</h3>
                            <TrendingUp className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-purple-600">{contact.lead_score}</span>
                            <span className="text-gray-600 mb-1">/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${contact.lead_score}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Acciones Rápidas</h3>
                        <div className="space-y-2">
                            <a href={`mailto:${contact.email}`} className="block w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 text-center text-sm font-medium">Enviar Email</a>
                            <a href={`https://wa.me/${contact.phone?.replace(/\D/g, '')}`} target="_blank" className="block w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-center text-sm font-medium">WhatsApp</a>
                            <Link href="/crm/ventas/nueva" className="block w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-center text-sm font-medium">Crear Oportunidad</Link>
                            <Link href="/crm/tareas/nueva" className="block w-full px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 text-center text-sm font-medium">Nueva Tarea</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
