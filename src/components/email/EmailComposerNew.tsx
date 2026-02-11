'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, Bold, Italic, Link as LinkIcon, ChevronDown, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Contact {
    id: string;
    name: string;
    email: string;
}

interface EmailComposerProps {
    isOpen: boolean;
    onClose: () => void;
    threadId?: string;
    contactId?: string;
    onSent?: () => void;
}

export default function EmailComposer({ isOpen, onClose, threadId, contactId, onSent }: EmailComposerProps) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [user, setUser] = useState<any>(null);

    // UI State
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [manualMode, setManualMode] = useState(false);
    const [manualEmail, setManualEmail] = useState('');
    const [manualName, setManualName] = useState('');

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            loadUser();
            loadContacts();
            // Reset form
            setSelectedContact(null);
            setSubject('');
            setContent('');
            setManualEmail('');
            setManualName('');
            setSearchQuery('');
            setManualMode(false);
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    async function loadUser() {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    }

    async function loadContacts() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch('/api/contacts', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setContacts(data.contacts || []);
            }
        } catch (error) {
            console.error('Error loading contacts:', error);
        }
    }

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function handleSelectContact(contact: Contact) {
        setSelectedContact(contact);
        setShowDropdown(false);
        setSearchQuery('');
    }

    async function handleSend() {
        if (!user) return;

        // Validar campos
        if (manualMode) {
            if (!manualEmail || !subject || !content) {
                alert('Por favor completa todos los campos');
                return;
            }
        } else {
            if (!selectedContact || !subject || !content) {
                alert('Por favor completa todos los campos');
                return;
            }
        }

        setSending(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            const response = await fetch('/api/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    contactId: manualMode ? undefined : selectedContact?.id,
                    manualEmail: manualMode ? manualEmail : undefined,
                    manualName: manualMode ? (manualName || manualEmail.split('@')[0]) : undefined,
                    subject,
                    content,
                    threadId
                })
            });

            if (response.ok) {
                alert('Email enviado exitosamente');
                onSent?.();
                onClose();
            } else {
                const error = await response.json();
                alert(`Error: ${error.error || 'No se pudo enviar el email'}`);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Error al enviar el email');
        } finally {
            setSending(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
                    <h2 className="text-xl font-bold text-gray-900">
                        {threadId ? '✉️ Responder Email' : '📧 Nuevo Email'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-5 overflow-y-auto flex-1">
                    {/* Para */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-gray-700">
                                Para:
                            </label>
                            {!contactId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setManualMode(!manualMode);
                                        setSelectedContact(null);
                                        setManualEmail('');
                                    }}
                                    className="text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
                                >
                                    {manualMode ? '← Seleccionar de contactos' : '✍️ Escribir email manualmente'}
                                </button>
                            )}
                        </div>

                        {manualMode ? (
                            // Modo manual
                            <div className="space-y-3">
                                <input
                                    type="email"
                                    value={manualEmail}
                                    onChange={(e) => setManualEmail(e.target.value)}
                                    placeholder="destinatario@ejemplo.com"
                                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                />
                                <input
                                    type="text"
                                    value={manualName}
                                    onChange={(e) => setManualName(e.target.value)}
                                    placeholder="Nombre del destinatario (opcional)"
                                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                />
                            </div>
                        ) : (
                            // Selector de contactos con dropdown custom
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    disabled={!!contactId}
                                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-left flex items-center justify-between hover:border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                                >
                                    <span className={selectedContact ? 'text-gray-900' : 'text-gray-400'}>
                                        {selectedContact
                                            ? `${selectedContact.name} (${selectedContact.email})`
                                            : 'Seleccionar contacto...'}
                                    </span>
                                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown */}
                                {showDropdown && (
                                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-80 overflow-hidden">
                                        {/* Search */}
                                        <div className="p-3 border-b border-gray-200">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="🔍 Buscar contacto..."
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                autoFocus
                                            />
                                        </div>

                                        {/* Contact List */}
                                        <div className="max-h-60 overflow-y-auto">
                                            {filteredContacts.length === 0 ? (
                                                <div className="p-4 text-center text-gray-500">
                                                    {searchQuery ? `No se encontró "${searchQuery}"` : 'No hay contactos'}
                                                </div>
                                            ) : (
                                                filteredContacts.map((contact) => (
                                                    <button
                                                        key={contact.id}
                                                        type="button"
                                                        onClick={() => handleSelectContact(contact)}
                                                        className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center justify-between group"
                                                    >
                                                        <div>
                                                            <div className="font-medium text-gray-900 group-hover:text-purple-700">
                                                                {contact.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {contact.email}
                                                            </div>
                                                        </div>
                                                        {selectedContact?.id === contact.id && (
                                                            <Check className="h-5 w-5 text-purple-600" />
                                                        )}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Asunto */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Asunto:
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Escribe el asunto del email..."
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        />
                    </div>

                    {/* Mensaje */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Mensaje:
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={12}
                            placeholder="Escribe tu mensaje aquí..."
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={sending}
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
                    >
                        <Send className="h-4 w-4" />
                        {sending ? 'Enviando...' : 'Enviar Email'}
                    </button>
                </div>
            </div>
        </div>
    );
}
