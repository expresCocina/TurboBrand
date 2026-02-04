"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, MessageCircle, Clock } from 'lucide-react';

interface ChatListProps {
    onSelect: (conversation: any) => void;
    activeId: string | null;
}

interface Contact {
    id: string;
    name: string;
    phone: string;
}

interface ConversationWithMessages {
    id: string;
    phone_number: string;
    contacts?: Contact;
    last_message?: {
        content: string;
        timestamp: string;
        direction: string;
    };
    unread_count?: number;
    tags?: string[];
}

export default function ChatList({ onSelect, activeId }: ChatListProps) {
    const [conversations, setConversations] = useState<ConversationWithMessages[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConversations();

        // Real-time subscription for new messages and conversations
        const channel = supabase
            .channel('whatsapp_realtime')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'whatsapp_conversations' },
                () => loadConversations()
            )
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'whatsapp_messages' },
                () => loadConversations()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function loadConversations() {
        const { data, error } = await supabase
            .from('whatsapp_conversations')
            .select(`
                *,
                contacts (
                    id,
                    name,
                    phone
                )
            `)
            .eq('status', 'open')
            .order('last_message_at', { ascending: false }); // Sort by most recent first

        if (error) {
            console.error('Error loading conversations:', error);
            setLoading(false);
            return;
        }

        // Process conversations with last message and unread count
        const conversationsWithData = await Promise.all(
            (data || []).map(async (conv: any) => {
                // Get last message
                const { data: lastMsg } = await supabase
                    .from('whatsapp_messages')
                    .select('content, timestamp, direction')
                    .eq('conversation_id', conv.id)
                    .order('timestamp', { ascending: false })
                    .limit(1)
                    .single();

                // Count unread messages
                const { count } = await supabase
                    .from('whatsapp_messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('conversation_id', conv.id)
                    .eq('direction', 'inbound')
                    .is('read_at', null);

                return {
                    ...conv,
                    last_message: lastMsg,
                    unread_count: count || 0,
                    tags: conv.tags || []
                };
            })
        );

        // Sort again by last message timestamp to ensure correct order
        conversationsWithData.sort((a, b) => {
            const timeA = a.last_message?.timestamp || a.created_at || '';
            const timeB = b.last_message?.timestamp || b.created_at || '';
            return new Date(timeB).getTime() - new Date(timeA).getTime();
        });

        setConversations(conversationsWithData);
        setLoading(false);
    }

    function formatTime(timestamp: string) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return 'Ayer';
        } else if (days < 7) {
            return date.toLocaleDateString('es-ES', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
        }
    }

    function getInitials(name: string): string {
        if (!name) return '?';
        const words = name.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    function getTagColor(tagValue: string): string {
        const tagColors: Record<string, string> = {
            'nuevo': 'bg-blue-100 text-blue-700',
            'interesado': 'bg-yellow-100 text-yellow-700',
            'cliente': 'bg-green-100 text-green-700',
            'cotizacion': 'bg-purple-100 text-purple-700',
            'seguimiento': 'bg-orange-100 text-orange-700',
            'cerrado': 'bg-gray-100 text-gray-700',
            'spam': 'bg-red-100 text-red-700',
        };
        return tagColors[tagValue] || 'bg-gray-100 text-gray-700';
    }

    function getTagLabel(tagValue: string): string {
        const tagLabels: Record<string, string> = {
            'nuevo': 'Nuevo',
            'interesado': 'Interesado',
            'cliente': 'Cliente',
            'cotizacion': 'Cotización',
            'seguimiento': 'Seguimiento',
            'cerrado': 'Cerrado',
            'spam': 'Spam',
        };
        return tagLabels[tagValue] || tagValue;
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
        <div className="divide-y divide-gray-100 overflow-y-auto h-full bg-white">
            {conversations.map((conv) => (
                <div
                    key={conv.id}
                    onClick={() => onSelect(conv)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors relative ${activeId === conv.id ? 'bg-[#f0f2f5]' : ''
                        }`}
                >
                    <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 text-white font-semibold">
                            {getInitials(conv.contacts?.name || conv.phone_number)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between mb-1">
                                <h3 className={`font-semibold truncate ${(conv.unread_count ?? 0) > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {conv.contacts?.name || conv.phone_number}
                                </h3>
                                {conv.last_message && (
                                    <span className={`text-xs ml-2 flex-shrink-0 ${(conv.unread_count ?? 0) > 0 ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                                        {formatTime(conv.last_message.timestamp)}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm truncate ${(conv.unread_count ?? 0) > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                        {conv.last_message ? (
                                            <>
                                                {conv.last_message.direction === 'outbound' && (
                                                    <span className="text-blue-500 mr-1">✓✓</span>
                                                )}
                                                {conv.last_message.content}
                                            </>
                                        ) : (
                                            <span className="italic">Sin mensajes</span>
                                        )}
                                    </p>

                                    {/* Tag Indicators */}
                                    {conv.tags && conv.tags.length > 0 && (
                                        <div className="flex items-center gap-1 mt-1">
                                            {conv.tags.slice(0, 2).map((tag: string) => (
                                                <span
                                                    key={tag}
                                                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${getTagColor(tag)}`}
                                                >
                                                    {getTagLabel(tag)}
                                                </span>
                                            ))}
                                            {conv.tags.length > 2 && (
                                                <span className="text-[10px] text-gray-400">+{conv.tags.length - 2}</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Unread badge */}
                                {(conv.unread_count ?? 0) > 0 && (
                                    <span className="ml-2 bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                                        {conv.unread_count}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
