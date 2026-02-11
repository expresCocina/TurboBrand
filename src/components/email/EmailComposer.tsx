'use client';

import { useState, useEffect } from 'react';
import { X, Send, Bold, Italic, Link as LinkIcon } from 'lucide-react';
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
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: crmUser } = await supabase
                .from('crm_users')
                .select('organization_id')
                .eq('id', user.id)
                .single();

            if (!crmUser) return;

            const { data: contactsData } = await supabase
                .from('contacts')
                .select('id, name, email')
                .eq('organization_id', crmUser.organization_id)
                .order('name');

            if (contactsData) {
                setContacts(contactsData);
            }
        } catch (error) {
            console.error('Error loading contacts:', error);
        }
    }

    async function handleSend() {
        if (!selectedContact || !subject || !content) {
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
                    contactId: selectedContact,
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
                    {/* To */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Para:
                        </label>
                        <select
                            value={selectedContact}
                            onChange={(e) => setSelectedContact(e.target.value)}
                            disabled={!!contactId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                        >
                            <option value="">Seleccionar contacto...</option>
                            {contacts.map((contact) => (
                                <option key={contact.id} value={contact.id}>
                                    {contact.name} ({contact.email})
                                </option>
                            ))}
                        </select>
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
