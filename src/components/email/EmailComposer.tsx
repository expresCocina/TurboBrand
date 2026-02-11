'use client';

import { useState, useEffect } from 'react';
import { X, Send, Bold, Italic, Link as LinkIcon, Search, Mail } from 'lucide-react';
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
    const [selectedContact, setSelectedContact] = useState<string>(contactId || '');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Nuevas funcionalidades
    const [searchQuery, setSearchQuery] = useState('');
    const [manualMode, setManualMode] = useState(false);
    const [manualEmail, setManualEmail] = useState('');
    const [manualName, setManualName] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadUser();
            loadContacts();
        }
    }, [isOpen]);

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

    // Filtrar contactos por búsqueda
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Validar email
    function isValidEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async function handleSend() {
        let contactToUse = selectedContact;

        // Si está en modo manual, crear o buscar contacto
        if (manualMode) {
            if (!manualEmail || !isValidEmail(manualEmail)) {
                alert('Por favor ingresa un email válido');
                return;
            }

            // Buscar si el contacto ya existe
            const existingContact = contacts.find(c => c.email.toLowerCase() === manualEmail.toLowerCase());

            if (existingContact) {
                contactToUse = existingContact.id;
            } else {
                // Crear nuevo contacto
                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    const response = await fetch('/api/contacts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${session?.access_token}`
                        },
                        body: JSON.stringify({
                            name: manualName || manualEmail.split('@')[0],
                            email: manualEmail,
                            source: 'email_manual'
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        contactToUse = data.contact.id;
                    } else {
                        throw new Error('No se pudo crear el contacto');
                    }
                } catch (error: any) {
                    alert('Error creando contacto: ' + error.message);
                    return;
                }
            }
        }

        if (!contactToUse || !subject || !content) {
            alert('Por favor completa todos los campos');
            return;
        }

        try {
            setSending(true);

            const response = await fetch('/api/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                },
                body: JSON.stringify({
                    contactId: contactToUse,
                    subject,
                    content,
                    threadId
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('✅ Email enviado exitosamente');
                setSelectedContact('');
                setSubject('');
                setContent('');
                setManualEmail('');
                setManualName('');
                setSearchQuery('');
                onSent?.();
                onClose();
            } else {
                throw new Error(data.error || 'Error enviando email');
            }
        } catch (error: any) {
            console.error('Error:', error);
            alert('❌ Error enviando email: ' + error.message);
        } finally {
            setSending(false);
        }
    }

    function insertFormatting(format: 'bold' | 'italic' | 'link') {
        const textarea = document.getElementById('email-content') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        let newText = '';
        let cursorOffset = 0;

        switch (format) {
            case 'bold':
                newText = `<strong>${selectedText || 'texto'}</strong>`;
                cursorOffset = selectedText ? newText.length : 8;
                break;
            case 'italic':
                newText = `<em>${selectedText || 'texto'}</em>`;
                cursorOffset = selectedText ? newText.length : 4;
                break;
            case 'link':
                const url = prompt('URL:');
                if (url) {
                    newText = `<a href="${url}">${selectedText || 'enlace'}</a>`;
                    cursorOffset = newText.length;
                }
                break;
        }

        if (newText) {
            const newContent = content.substring(0, start) + newText + content.substring(end);
            setContent(newContent);

            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
            }, 0);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {threadId ? 'Responder Email' : 'Nuevo Email'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {/* To - Modo Toggle */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Para:
                            </label>
                            {!contactId && (
                                <button
                                    type="button"
                                    onClick={() => setManualMode(!manualMode)}
                                    className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    {manualMode ? '← Seleccionar de contactos' : '✉️ Escribir email manualmente'}
                                </button>
                            )}
                        </div>

                        {manualMode ? (
                            // Modo manual: escribir email directamente
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="email"
                                        value={manualEmail}
                                        onChange={(e) => setManualEmail(e.target.value)}
                                        placeholder="email@ejemplo.com"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={manualName}
                                    onChange={(e) => setManualName(e.target.value)}
                                    placeholder="Nombre (opcional)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        ) : (
                            // Modo selector: buscar y seleccionar contacto
                            <div className="space-y-2">
                                {/* Búsqueda */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Buscar contacto..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Selector */}
                                <select
                                    value={selectedContact}
                                    onChange={(e) => setSelectedContact(e.target.value)}
                                    disabled={!!contactId}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                                    size={Math.min(filteredContacts.length + 1, 5)}
                                >
                                    <option value="">Seleccionar contacto...</option>
                                    {filteredContacts.map((contact) => (
                                        <option key={contact.id} value={contact.id}>
                                            {contact.name} ({contact.email})
                                        </option>
                                    ))}
                                </select>

                                {searchQuery && filteredContacts.length === 0 && (
                                    <p className="text-sm text-gray-500">No se encontraron contactos</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Asunto:
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Asunto del email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* Formatting Toolbar */}
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <button
                            type="button"
                            onClick={() => insertFormatting('bold')}
                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                            title="Negrita"
                        >
                            <Bold className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => insertFormatting('italic')}
                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                            title="Cursiva"
                        >
                            <Italic className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => insertFormatting('link')}
                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                            title="Enlace"
                        >
                            <LinkIcon className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mensaje:
                        </label>
                        <textarea
                            id="email-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Escribe tu mensaje aquí..."
                            rows={12}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            Puedes usar HTML básico: &lt;strong&gt;, &lt;em&gt;, &lt;a href=""&gt;
                        </p>
                    </div>

                    {/* Tracking Options */}
                    <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="track-opens"
                                defaultChecked
                                className="rounded text-purple-600 focus:ring-purple-500"
                            />
                            <label htmlFor="track-opens" className="text-sm text-gray-700">
                                Rastrear aperturas
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="track-clicks"
                                defaultChecked
                                className="rounded text-purple-600 focus:ring-purple-500"
                            />
                            <label htmlFor="track-clicks" className="text-sm text-gray-700">
                                Rastrear clicks
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        disabled={sending}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={sending || !selectedContact || !subject || !content}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="h-4 w-4" />
                        {sending ? 'Enviando...' : 'Enviar Email'}
                    </button>
                </div>
            </div>
        </div>
    );
}
