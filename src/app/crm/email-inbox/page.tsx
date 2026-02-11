'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Inbox, Send, Star, Trash2, Search, Plus, ArrowLeft } from 'lucide-react';
import EmailComposer from '@/components/email/EmailComposerNew';

interface Thread {
    id: string;
    contactName: string;
    contactEmail: string;
    subject: string;
    lastMessageAt: string;
    totalMessages: number;
    unreadCount: number;
    preview: string;
    lastMessageDirection: 'inbound' | 'outbound';
}

interface Message {
    id: string;
    direction: 'inbound' | 'outbound';
    from: string;
    fromName: string;
    to: string;
    subject: string;
    htmlContent: string;
    textContent: string;
    createdAt: string;
    isRead: boolean;
    opened: boolean;
    clicked: boolean;
    totalOpens: number;
    totalClicks: number;
}

export default function EmailInboxPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [threads, setThreads] = useState<Thread[]>([]);
    const [selectedThread, setSelectedThread] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'inbox' | 'sent'>('inbox');
    const [showComposer, setShowComposer] = useState(false);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }
        setUser(user);
        loadThreads(user.id);
    }

    async function loadThreads(userId: string) {
        try {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();

            const response = await fetch(`/api/email/inbox`, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
            });
            const data = await response.json();

            if (data.threads) {
                setThreads(data.threads);
            }
        } catch (error) {
            console.error('Error loading threads:', error);
        } finally {
            setLoading(false);
        }
    }

    async function loadThread(threadId: string) {
        try {
            const response = await fetch(`/api/email/threads/${threadId}`);
            const data = await response.json();

            if (data.thread && data.messages) {
                setSelectedThread(data.thread);
                setMessages(data.messages);

                // Marcar como leído
                await fetch(`/api/email/threads/${threadId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'mark_read' })
                });

                // Actualizar lista de threads
                loadThreads(user.id);
            }
        } catch (error) {
            console.error('Error loading thread:', error);
        }
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = diff / (1000 * 60 * 60);

        if (hours < 24) {
            return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        } else if (hours < 48) {
            return 'Ayer';
        } else {
            return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-50">
            {/* Header con gradiente */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/30">
                                <Mail className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Email</h1>
                                <p className="text-xs text-gray-500">Gestiona tus conversaciones</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowComposer(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 font-medium"
                        >
                            <Plus className="h-4 w-4" />
                            Nuevo Email
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-12 gap-6">
                    {/* Sidebar con diseño premium */}
                    <div className="col-span-3">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100/50 p-5">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">Carpetas</h3>
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setView('inbox')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${view === 'inbox'
                                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                                        }`}
                                >
                                    <Inbox className="h-5 w-5" />
                                    <span className="font-semibold">Recibidos</span>
                                    {threads.filter(t => t.unreadCount > 0).length > 0 && (
                                        <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-bold ${view === 'inbox'
                                            ? 'bg-white/20 text-white'
                                            : 'bg-purple-100 text-purple-700'
                                            }`}>
                                            {threads.filter(t => t.unreadCount > 0).length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setView('sent')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${view === 'sent'
                                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                                        }`}
                                >
                                    <Send className="h-5 w-5" />
                                    <span className="font-semibold">Enviados</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Thread List con diseño moderno */}
                    <div className="col-span-4">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100/50 overflow-hidden">
                            <div className="p-5 border-b border-purple-100/50 bg-gradient-to-r from-purple-50/50 to-transparent">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                                    <input
                                        type="text"
                                        placeholder="🔍 Buscar emails..."
                                        className="w-full pl-11 pr-4 py-3 bg-white border-2 border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-500">
                                        Cargando...
                                    </div>
                                ) : threads.filter(t => {
                                    if (view === 'inbox') return t.lastMessageDirection === 'inbound';
                                    if (view === 'sent') return t.lastMessageDirection === 'outbound';
                                    return true;
                                }).length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl mb-4">
                                            <Mail className="h-12 w-12 text-purple-400" />
                                        </div>
                                        <p className="text-gray-600 font-medium">{view === 'inbox' ? 'No hay emails recibidos' : 'No hay emails enviados'}</p>
                                        <p className="text-sm text-gray-400 mt-1">Los emails aparecerán aquí</p>
                                    </div>
                                ) : (
                                    threads.filter(t => {
                                        if (view === 'inbox') return t.lastMessageDirection === 'inbound';
                                        if (view === 'sent') return t.lastMessageDirection === 'outbound';
                                        return true;
                                    }).map((thread) => (
                                        <button
                                            key={thread.id}
                                            onClick={() => loadThread(thread.id)}
                                            className={`w-full p-4 text-left border-b border-purple-50 transition-all hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-transparent group ${selectedThread?.id === thread.id
                                                    ? 'bg-gradient-to-r from-purple-100/70 to-purple-50/30 border-l-4 border-l-purple-500'
                                                    : thread.unreadCount > 0
                                                        ? 'bg-blue-50/30'
                                                        : ''
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <span className={`font-semibold ${thread.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                                                    } group-hover:text-purple-700 transition-colors`}>
                                                    {thread.contactName}
                                                </span>
                                                <span className="text-xs text-gray-500 font-medium">
                                                    {formatDate(thread.lastMessageAt)}
                                                </span>
                                            </div>
                                            <div className="text-sm font-medium text-gray-800 mb-1.5 truncate">
                                                {thread.subject}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate">
                                                {thread.preview}
                                            </div>
                                            {thread.unreadCount > 0 && (
                                                <div className="mt-2">
                                                    <span className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                                                        {thread.unreadCount} nuevo{thread.unreadCount > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Message View */}
                    <div className="col-span-5">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            {selectedThread ? (
                                <>
                                    {/* Thread Header */}
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="flex items-start justify-between mb-2">
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {selectedThread.subject}
                                            </h2>
                                            <button
                                                onClick={() => setSelectedThread(null)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <ArrowLeft className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className="font-medium">{selectedThread.contact.name}</span>
                                            <span className="text-gray-400">•</span>
                                            <span>{selectedThread.contact.email}</span>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="p-6 space-y-6 max-h-[calc(100vh-400px)] overflow-y-auto">
                                        {messages.map((message) => (
                                            <div key={message.id} className={`${message.direction === 'outbound' ? 'ml-12' : 'mr-12'}`}>
                                                <div className={`rounded-lg p-4 ${message.direction === 'outbound'
                                                    ? 'bg-purple-50 border border-purple-200'
                                                    : 'bg-gray-50 border border-gray-200'
                                                    }`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-sm text-gray-900">
                                                            {message.direction === 'outbound' ? 'Tú' : message.fromName}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {formatDate(message.createdAt)}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="text-sm text-gray-700 prose prose-sm max-w-none"
                                                        dangerouslySetInnerHTML={{ __html: message.htmlContent || message.textContent }}
                                                    />
                                                    {message.direction === 'outbound' && (
                                                        <div className="mt-3 pt-3 border-t border-purple-200 flex items-center gap-4 text-xs text-gray-600">
                                                            {message.opened && (
                                                                <span className="flex items-center gap-1">
                                                                    ✓ Abierto {message.totalOpens > 1 && `(${message.totalOpens}x)`}
                                                                </span>
                                                            )}
                                                            {message.clicked && (
                                                                <span className="flex items-center gap-1">
                                                                    🔗 {message.totalClicks} click{message.totalClicks > 1 ? 's' : ''}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Reply Box */}
                                    <div className="p-6 border-t border-gray-200">
                                        <button
                                            onClick={() => setShowComposer(true)}
                                            className="w-full px-4 py-2 text-left text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Escribir respuesta...
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="p-12 text-center text-gray-500">
                                    <Mail className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg">Selecciona una conversación</p>
                                    <p className="text-sm mt-2">Elige un email de la lista para verlo aquí</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Composer Modal */}
            <EmailComposer
                isOpen={showComposer}
                onClose={() => setShowComposer(false)}
                threadId={selectedThread?.id}
                contactId={selectedThread?.contact?.id}
                onSent={() => {
                    loadThreads(user.id);
                    if (selectedThread) {
                        loadThread(selectedThread.id);
                    }
                }}
            />
        </div>
    );
}
