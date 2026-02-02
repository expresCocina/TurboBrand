import { Opportunity } from '@/lib/supabase';
import KanbanCard from './KanbanCard';


interface KanbanColumnProps {
    id: string;
    title: string;
    opportunities: Opportunity[];
    contactsMap: Record<string, string>; // ID -> Nombre del contacto
    onDrop: (opportunityId: string, newStage: string) => void;
    color: string;
}

export default function KanbanColumn({ id, title, opportunities, contactsMap, onDrop, color }: KanbanColumnProps) {
    const totalValue = opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const opportunityId = e.dataTransfer.getData('opportunityId');
        if (opportunityId) {
            onDrop(opportunityId, id);
        }
    };

    return (
        <div
            className="flex-shrink-0 w-80 flex flex-col h-full bg-gray-50/50 rounded-xl"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* Header de Columna */}
            <div className={`p-3 rounded-t-xl border-b-2 ${color} bg-white flex justify-between items-center sticky top-0 z-10 shadow-sm`}>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">{title}</span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                        {opportunities.length}
                    </span>
                </div>
                {totalValue > 0 && (
                    <span className="text-xs font-semibold text-gray-500">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', notation: 'compact' }).format(totalValue)}
                    </span>
                )}
            </div>

            {/* Area de tarjetas */}
            <div className="flex-1 p-2 overflow-y-auto min-h-[150px] space-y-3 scrollbar-hide">
                {opportunities.map((opp) => (
                    <KanbanCard
                        key={opp.id}
                        opportunity={opp}
                        contactName={contactsMap[opp.contact_id]}
                    />
                ))}
            </div>
        </div>
    );
}
