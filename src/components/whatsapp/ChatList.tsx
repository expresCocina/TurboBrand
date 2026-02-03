"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, MessageCircle, Clock } from 'lucide-react';

interface ChatListProps {
    onSelect: (conversation: any) => void;
    activeId: string | null;
}

export default function ChatList({ onSelect, activeId }: ChatListProps) {
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConversations();

        // Suscripción a nuevos mensajes
        const channel = supabase
            .channel('whatsapp_updates')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'whatsapp_conversations' },
                () => loadConversations()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function loadConversations() {
        try {
            const { data, error } = await supabase
                .from('whatsapp_conversations')
                .select(`
                    *,
                    contacts (name, phone)
                `)
                .order('last_message_at', { ascending: false });

            if (error) throw error;
            setConversations(data || []);
        } catch (error) {
            console.error('Error loading chats:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="p-4 text-center text-gray-500">Cargando chats...</div>;

    if (conversations.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <MessageCircle className="h-8 w-8 text-gray-300 mb-2" />
                <p>No hay conversaciones aún.</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-100 overflow-y-auto h-full">
            {conversations.map((conv) => (
                <div
                    key={conv.id}
                    onClick={() => onSelect(conv)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${activeId === conv.id ? 'bg-purple-50 border-l-4 border-purple-600' : 'border-l-4 border-transparent'
                        }`}
                >
                    <div className="flex items-start justify-between mb-1">
                        <div className="font-semibold text-gray-900 truncate">
                            {conv.contacts?.name || conv.phone}
                        </div>
                        {conv.last_message_at && (
                            <div className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(conv.last_message_at).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                    <div className="text-sm text-gray-600 truncate flex items-center gap-2">
                        {conv.status === 'open' ? (
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        ) : (
                            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                        )}
                        <span className="truncate">{conv.phone}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
