"use client";

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, Image, Paperclip, MoreVertical, Phone } from 'lucide-react';

interface ChatWindowProps {
    conversation: any;
}

export default function ChatWindow({ conversation }: ChatWindowProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (conversation) {
            loadMessages();
            // Suscribirse a nuevos mensajes de ESTA conversación
            const channel = supabase
                .channel(`chat:${conversation.id}`)
                .on('postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'whatsapp_messages', filter: `conversation_id=eq.${conversation.id}` },
                    (payload) => setMessages(prev => [...prev, payload.new])
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
        const { data } = await supabase
            .from('whatsapp_messages')
            .select('*')
            .eq('conversation_id', conversation.id)
            .order('timestamp', { ascending: true });

        setMessages(data || []);
    }

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            // Guardar en BD (Simulado, luego conectaremos API real)
            const { error } = await supabase
                .from('whatsapp_messages')
                .insert([{
                    conversation_id: conversation.id,
                    content: newMessage,
                    direction: 'outbound',
                    status: 'sent',
                    type: 'text'
                }]);

            if (error) throw error;

            // Actualizar timestamp de la conversación
            await supabase
                .from('whatsapp_conversations')
                .update({ last_message_at: new Date().toISOString() })
                .eq('id', conversation.id);

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error enviando mensaje');
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="flex flex-col h-full bg-[#E5DDD5]">
            {/* Header */}
            <div className="bg-white p-3 border-b flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        <UserIcon />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {conversation.contacts?.name || conversation.phone}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {conversation.phone}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                    <button className="p-2 hover:bg-gray-100 rounded-full"><Phone className="h-5 w-5" /></button>
                    <button className="p-2 hover:bg-gray-100 rounded-full"><MoreVertical className="h-5 w-5" /></button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 shadow-sm ${msg.direction === 'outbound'
                                    ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none' // Verde WhatsApp
                                    : 'bg-white text-gray-900 rounded-tl-none'
                                }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <div className="text-[10px] text-gray-500 text-right mt-1 opacity-70">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f2f5] p-3">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                        <Paperclip className="h-6 w-6" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un mensaje"
                        className="flex-1 py-2 px-4 rounded-lg bg-white border-none focus:ring-1 focus:ring-gray-300 outline-none placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="p-2 text-gray-500 hover:text-green-600 disabled:opacity-50"
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
