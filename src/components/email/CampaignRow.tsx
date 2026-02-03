"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle, Clock, MoreVertical, Edit, Trash2, FileText } from 'lucide-react';

export default function CampaignRow({ campaign }: { campaign: any }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="p-6 hover:bg-gray-50 transition-colors relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${campaign.status === 'sent' ? 'bg-green-100 text-green-600' :
                        campaign.status === 'failed' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                        }`}>
                        <Mail className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">{campaign.name}</h3>
                        <p className="text-sm text-gray-500 truncate max-w-md">{campaign.subject}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${campaign.status === 'sent'
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : campaign.status === 'failed'
                                    ? 'bg-red-50 text-red-700 border border-red-100'
                                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                                }`}>
                                {campaign.status === 'sent' && <><CheckCircle className="h-3 w-3" /> Enviado</>}
                                {campaign.status === 'failed' && <><AlertCircle className="h-3 w-3" /> Error</>}
                                {campaign.status === 'draft' && <><Clock className="h-3 w-3" /> Borrador</>}
                                {campaign.status === 'scheduled' && <><Clock className="h-3 w-3" /> Programado</>}
                                {campaign.status === 'sending' && <><Clock className="h-3 w-3 animate-spin" /> Enviando...</>}
                            </span>
                            {campaign.sent_at && (
                                <span>{new Date(campaign.sent_at).toLocaleDateString()} {new Date(campaign.sent_at).toLocaleTimeString()}</span>
                            )}
                            {campaign.status === 'scheduled' && campaign.scheduled_at && (
                                <span className="text-purple-600 font-medium">
                                    Para: {new Date(campaign.scheduled_at).toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                {campaign.status === 'sent' && (
                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{campaign.total_opened || 0}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Abiertos</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{campaign.total_clicked || 0}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Clicks</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500">
                                {campaign.total_sent || 0} enviados
                            </p>
                        </div>
                    </div>
                )}

                {/* Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <MoreVertical className="h-5 w-5" />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1 animation-fade-in">
                            {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                                <Link
                                    href={`/crm/email/editar/${campaign.id}`}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                    Editar Campaña
                                </Link>
                            )}
                            {/* Opciones futuras */}
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left">
                                <FileText className="h-4 w-4" />
                                Ver Detalles
                            </button>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                                <Trash2 className="h-4 w-4" />
                                Eliminar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
