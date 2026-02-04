"use client";

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, Paperclip, MoreVertical, Phone } from 'lucide-react';
import TagManager from './TagManager';

interface ChatWindowProps {
    conversation: any;
}

export default function ChatWindow({ conversation }: ChatWindowProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [tags, setTags] = useState<string[]>(conversation.tags || []);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (conversation) {
            loadMessages();
            markMessagesAsRead(); // Marcar mensajes como leídos al abrir el chat

            // Real-time subscription for new messages in this conversation
            const channel = supabase
                .channel(`chat:${conversation.id}`)
                .on('postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'whatsapp_messages',
                        filter: `conversation_id=eq.${conversation.id}`
                    },
                    (payload) => {
                        console.log('📨 New message received:', payload.new);
                        setMessages(prev => [...prev, payload.new]);
                        // Auto-marcar como leído si el chat está abierto
                        if (payload.new.direction === 'inbound') {
                            markMessageAsRead(payload.new.id);
                        }
                    }
                )
                .on('postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'whatsapp_messages',
                        filter: `conversation_id=eq.${conversation.id}`
                    },
                    (payload) => {
                        console.log('📝 Message updated:', payload.new);
                        setMessages(prev => prev.map(msg =>
                            msg.id === payload.new.id ? payload.new : msg
                        ));
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [conversation.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    async function loadMessages() {
        const { data, error } = await supabase
            .from('whatsapp_messages')
            .select('*')
            .eq('conversation_id', conversation.id)
            .order('timestamp', { ascending: true });

        console.log('📨 Messages loaded:', data);
        console.log('❌ Error loading messages:', error);
        setMessages(data || []);
    }

    async function markMessagesAsRead() {
        // Marcar todos los mensajes entrantes como leídos
        await supabase
            .from('whatsapp_messages')
            .update({ read_at: new Date().toISOString() })
            .eq('conversation_id', conversation.id)
            .eq('direction', 'inbound')
            .is('read_at', null);

        console.log('✅ Messages marked as read');
    }

    async function markMessageAsRead(messageId: string) {
        await supabase
            .from('whatsapp_messages')
            .update({ read_at: new Date().toISOString() })
            .eq('id', messageId);
    }

    function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
        setNewMessage(e.target.value);

        // Show typing indicator
        setIsTyping(true);

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Hide typing indicator after 1 second of no typing
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 1000);
    }

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        setIsTyping(false);

        try {
            const apiUrl = '/api/whatsapp/send';
            console.log('📤 Sending to:', apiUrl);
            console.log('📱 Phone:', conversation.phone_number);
            console.log('💬 Message:', newMessage);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: conversation.phone_number,
                    message: newMessage,
                    conversationId: conversation.id,
                }),
            });

            console.log('📡 Response status:', response.status);
            const result = await response.json();
            console.log('📡 Response data:', result);

            if (!response.ok) {
                throw new Error(result.error || result.details || 'Failed to send message');
            }

            setNewMessage('');
            console.log('✅ Message sent successfully');
        } catch (error: any) {
            console.error('❌ Error sending message:', error);
            alert(`Error enviando mensaje: ${error.message}`);
        } finally {
            setSending(false);
        }
    }

    function formatMessageTime(timestamp: string) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }

    function getInitials(name: string): string {
        if (!name) return '?';
        const words = name.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    return (
        <div className="flex flex-col h-full bg-[#E5DDD5]">
            {/* Header */}
            <div className="bg-[#f0f2f5] p-3 border-b shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {getInitials(conversation.contacts?.name || conversation.phone_number)}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                {conversation.contacts?.name || conversation.phone_number}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {conversation.phone_number}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <Phone className="h-5 w-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Tags */}
                <div className="mt-2">
                    <TagManager
                        conversationId={conversation.id}
                        currentTags={tags}
                        onTagsUpdate={setTags}
                    />
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <p>No hay mensajes aún</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isOutbound = msg.direction === 'outbound';

                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 shadow-sm ${isOutbound
                                        ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none'
                                        : 'bg-white text-gray-900 rounded-tl-none'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                    <div className="text-[10px] text-gray-500 text-right mt-1 flex items-center justify-end gap-1">
                                        <span>{msg.timestamp ? formatMessageTime(msg.timestamp) : ''}</span>
                                        {isOutbound && (
                                            <span className="text-blue-500">✓✓</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            {isTyping && (
                <div className="px-4 pb-2">
                    <div className="flex justify-start">
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="bg-[#f0f2f5] p-3">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <button type="button" className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <Paperclip className="h-6 w-6" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleTyping}
                        placeholder="Escribe un mensaje"
                        disabled={sending}
                        className="flex-1 py-2 px-4 rounded-lg bg-white text-gray-900 border-none focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="p-2 text-gray-500 hover:text-green-600 disabled:opacity-50 disabled:hover:text-gray-500 transition-colors"
                    >
                        <Send className="h-6 w-6" />
                    </button>
                </form>
            </div>
        </div>
    );
}

function UserIcon() {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    );
}
