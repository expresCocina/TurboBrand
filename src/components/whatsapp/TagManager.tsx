"use client";

import { useState } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TagManagerProps {
    conversationId: string;
    currentTags: string[];
    onTagsUpdate: (tags: string[]) => void;
}

const AVAILABLE_TAGS = [
    { value: 'nuevo', label: 'Nuevo', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'interesado', label: 'Interesado', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { value: 'cliente', label: 'Cliente', color: 'bg-green-100 text-green-700 border-green-300' },
    { value: 'cotizacion', label: 'Cotización', color: 'bg-purple-100 text-purple-700 border-purple-300' },
    { value: 'seguimiento', label: 'Seguimiento', color: 'bg-orange-100 text-orange-700 border-orange-300' },
    { value: 'cerrado', label: 'Cerrado', color: 'bg-gray-100 text-gray-700 border-gray-300' },
    { value: 'spam', label: 'Spam', color: 'bg-red-100 text-red-700 border-red-300' },
];

export default function TagManager({ conversationId, currentTags, onTagsUpdate }: TagManagerProps) {
    const [showMenu, setShowMenu] = useState(false);

    async function addTag(tagValue: string) {
        const newTags = [...currentTags, tagValue];

        const { error } = await supabase
            .from('whatsapp_conversations')
            .update({ tags: newTags })
            .eq('id', conversationId);

        if (!error) {
            onTagsUpdate(newTags);
        }
        setShowMenu(false);
    }

    async function removeTag(tagValue: string) {
        const newTags = currentTags.filter(t => t !== tagValue);

        const { error } = await supabase
            .from('whatsapp_conversations')
            .update({ tags: newTags })
            .eq('id', conversationId);

        if (!error) {
            onTagsUpdate(newTags);
        }
    }

    function getTagConfig(tagValue: string) {
        return AVAILABLE_TAGS.find(t => t.value === tagValue) || {
            value: tagValue,
            label: tagValue,
            color: 'bg-gray-100 text-gray-700 border-gray-300'
        };
    }

    const availableToAdd = AVAILABLE_TAGS.filter(tag => !currentTags.includes(tag.value));

    return (
        <div className="relative flex items-center gap-2 flex-wrap">
            {/* Current Tags */}
            {currentTags.map((tag) => {
                const config = getTagConfig(tag);
                return (
                    <span
                        key={tag}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
                    >
                        {config.label}
                        <button
                            onClick={() => removeTag(tag)}
                            className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                );
            })}

            {/* Add Tag Button */}
            {availableToAdd.length > 0 && (
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <Plus className="h-3 w-3" />
                        Tag
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-[100]"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[101] min-w-[160px] max-h-[300px] overflow-y-auto">
                                {availableToAdd.map((tag) => (
                                    <button
                                        key={tag.value}
                                        onClick={() => addTag(tag.value)}
                                        className="w-full text-left px-3 py-2.5 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors flex items-center gap-2 text-sm text-gray-900"
                                    >
                                        <span className={`w-3 h-3 rounded-full ${tag.color.split(' ')[0]}`} />
                                        <span>{tag.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
