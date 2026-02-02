"use client";

import { Opportunity } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { MoreHorizontal, Calendar, DollarSign, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface KanbanCardProps {
    opportunity: Opportunity;
    contactName?: string;
}

export default function KanbanCard({ opportunity, contactName }: KanbanCardProps) {
    const router = useRouter();

    // Formatear moneda
    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Color basado en probabilidad
    const getProbabilityColor = (prob: number) => {
        if (prob >= 80) return 'bg-green-100 text-green-700';
        if (prob >= 50) return 'bg-yellow-100 text-yellow-700';
        return 'bg-red-100 text-red-700';
    };

    return (
        <motion.div
            layoutId={opportunity.id}
            draggable
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:border-purple-300 transition-colors group mb-3"
            onDragStart={(e: any) => {
                e.dataTransfer.setData('opportunityId', opportunity.id);
                e.dataTransfer.effectAllowed = 'move';
            }}
            onClick={() => router.push(`/crm/ventas/${opportunity.id}`)}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getProbabilityColor(opportunity.probability)}`}>
                    {opportunity.probability}% Prob.
                </span>
                <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </div>

            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2" title={opportunity.title}>
                {opportunity.title}
            </h3>

            {contactName && (
                <div className="flex items-center text-xs text-gray-500 mb-3">
                    <User className="h-3 w-3 mr-1" />
                    <span className="truncate">{contactName}</span>
                </div>
            )}

            <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-50 mt-2">
                <div className="flex items-center text-gray-700 font-medium">
                    <DollarSign className="h-3.5 w-3.5 mr-0.5 text-gray-400" />
                    {formatCurrency(opportunity.value || 0, opportunity.currency)}
                </div>

                {opportunity.expected_close_date && (
                    <div className="flex items-center text-xs text-gray-400" title="Fecha estimada de cierre">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(opportunity.expected_close_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
