"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Opportunity, Contact } from '@/lib/supabase';
import KanbanColumn from './components/KanbanColumn';
import { Plus } from 'lucide-react';
import Link from 'next/link';

// Definición de columnas y sus metadatos
const COLUMNS = [
    { id: 'lead', title: 'Nuevos Leads', color: 'border-blue-500' },
    { id: 'contacted', title: 'Contactados', color: 'border-indigo-500' },
    { id: 'proposal', title: 'Propuesta Enviada', color: 'border-purple-500' },
    { id: 'negotiation', title: 'En Negociación', color: 'border-orange-500' },
    { id: 'won', title: 'Ganadas', color: 'border-green-500' },
    { id: 'lost', title: 'Perdidas', color: 'border-red-500' },
];

export default function VentasPage() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [contactsMap, setContactsMap] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);

            // 1. Cargar Oportunidades
            const { data: oppsData, error: oppsError } = await supabase
                .from('opportunities')
                .select('*')
                .order('created_at', { ascending: false });

            if (oppsError) throw oppsError;

            // 2. Cargar Contactos para el mapa de nombres
            // Optimización: Solo cargar IDs necesarios si son muchos, por ahora cargamos todos para simplificar
            const { data: contactsData, error: contactsError } = await supabase
                .from('contacts')
                .select('id, name');

            if (contactsError) throw contactsError;

            // Crear mapa de contactos
            const newContactsMap: Record<string, string> = {};
            contactsData?.forEach(c => {
                newContactsMap[c.id] = c.name;
            });

            setOpportunities(oppsData || []);
            setContactsMap(newContactsMap);

        } catch (error) {
            console.error('Error cargando ventas:', error);
        } finally {
            setLoading(false);
        }
    }

    // Manejar movida de tarjetas
    const handleDrop = async (opportunityId: string, newStage: string) => {
        // Actualización optimista
        const originalOpportunities = [...opportunities];
        const updatedOpportunities = opportunities.map(opp =>
            opp.id === opportunityId ? { ...opp, stage: newStage as any } : opp
        );

        setOpportunities(updatedOpportunities);

        try {
            const { error } = await supabase
                .from('opportunities')
                .update({ stage: newStage })
                .eq('id', opportunityId);

            if (error) throw error;
        } catch (error) {
            console.error('Error actualizando etapa:', error);
            // Revertir en caso de error
            setOpportunities(originalOpportunities);
            alert('No se pudo actualizar la etapa de la oportunidad');
        }
    };

    return (
        <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
            {/* Header del módulo */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pipeline de Ventas</h1>
                    <div className="text-sm text-gray-500 mt-1 flex gap-4">
                        <span>Total en Pipeline: <span className="font-semibold text-gray-900">{opportunities.reduce((acc, curr) => acc + (curr.value || 0), 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</span></span>
                        <span>Oportunidades: <span className="font-semibold text-gray-900">{opportunities.length}</span></span>
                    </div>
                </div>
                <Link
                    href="/crm/ventas/nueva"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm font-medium"
                >
                    <Plus className="h-4 w-4" />
                    Nueva Oportunidad
                </Link>
            </div>

            {/* Tablero Kanban */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <div className="flex gap-6 h-full min-w-[1600px]">
                    {/* Min-width forza scroll horizontal si no cabe */}
                    {loading ? (
                        <div className="w-full flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
                        </div>
                    ) : (
                        COLUMNS.map(col => (
                            <KanbanColumn
                                key={col.id}
                                id={col.id}
                                title={col.title}
                                color={col.color}
                                opportunities={opportunities.filter(o => o.stage === col.id)}
                                contactsMap={contactsMap}
                                onDrop={handleDrop}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
