"use client";

import { useState, useEffect } from 'react';
import AutomationList, { AutomationWithStats } from './components/AutomationList';
import AutomationBuilder from './components/AutomationBuilder';
import { supabase } from '@/lib/supabase';
import { Automation } from '@/lib/supabase';

export default function AutomatizacionPage() {
    const [view, setView] = useState<'list' | 'builder'>('list');
    const [automations, setAutomations] = useState<AutomationWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingAuto, setEditingAuto] = useState<Partial<Automation> | undefined>(undefined);

    useEffect(() => {
        loadAutomations();
    }, []);

    async function loadAutomations() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('automations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAutomations(data || []);
        } catch (error) {
            console.error('Error loading automations:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleCreate = () => {
        setEditingAuto(undefined);
        setView('builder');
    };

    const handleEdit = (auto: AutomationWithStats) => {
        setEditingAuto(auto);
        setView('builder');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta automatización?')) return;
        try {
            const { error } = await supabase.from('automations').delete().eq('id', id);
            if (error) throw error;
            setAutomations(automations.filter(a => a.id !== id));
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Error al eliminar');
        }
    };

    const handleToggle = async (id: string, active: boolean) => {
        // Optimistic update
        setAutomations(auto => auto.map(a => a.id === id ? { ...a, is_active: active } : a));
        try {
            await supabase.from('automations').update({ is_active: active }).eq('id', id);
        } catch (error) {
            console.error('Error toggling:', error);
            loadAutomations(); // Revert on error
        }
    };

    const handleSave = async (data: Partial<Automation>) => {
        try {
            if (editingAuto?.id) {
                // Update
                const { error } = await supabase
                    .from('automations')
                    .update(data)
                    .eq('id', editingAuto.id);
                if (error) throw error;
            } else {
                // Insert
                // En single tenant, obtener organization_id de la sesion o tomar el primero
                // Mejor: Obtener la primera organizacion disponible
                const { data: org } = await supabase.from('organizations').select('id').limit(1).single();

                const { error } = await supabase
                    .from('automations')
                    .insert([{ ...data, organization_id: org?.id }]);
                if (error) throw error;
            }

            setView('list');
            loadAutomations();
        } catch (error: any) {
            console.error('Error saving:', error);
            alert('Error al guardar: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="max-w-6xl mx-auto h-full">
                {view === 'list' ? (
                    <>
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Automatización</h1>
                                <p className="text-gray-500 mt-1">Gestiona tus reglas y flujos de trabajo.</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                            </div>
                        ) : (
                            <AutomationList
                                automations={automations}
                                onCreate={handleCreate}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggle={handleToggle}
                            />
                        )}
                    </>
                ) : (
                    <AutomationBuilder
                        initialData={editingAuto}
                        onSave={handleSave}
                        onCancel={() => setView('list')}
                    />
                )}
            </div>
        </div>
    );
}
