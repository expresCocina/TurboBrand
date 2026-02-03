"use client";

import { useState } from 'react';
import ChatList from '@/components/whatsapp/ChatList';
import ChatWindow from '@/components/whatsapp/ChatWindow';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppPage() {
    const [selectedConversation, setSelectedConversation] = useState<any>(null);

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200 m-6">
            {/* Sidebar List (35%) */}
            <div className={`w-full md:w-[350px] lg:w-[400px] border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                        WhatsApp
                    </h2>
                    {/* <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                        + Nueva
                    </button> */}
                </div>

                <div className="flex-1 overflow-hidden">
                    <ChatList
                        onSelect={setSelectedConversation}
                        activeId={selectedConversation?.id}
                    />
                </div>
            </div>

            {/* Chat Window (65%) */}
            <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                {selectedConversation ? (
                    <>
                        {/* Mobile Back Button Area could go here if needed */}
                        <div className="md:hidden p-2 bg-gray-100 border-b flex items-center">
                            <button onClick={() => setSelectedConversation(null)} className="text-sm text-gray-600">
                                ← Volver
                            </button>
                        </div>
                        <ChatWindow conversation={selectedConversation} />
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5] text-gray-400">
                        <div className="w-64 h-64 bg-gray-200 rounded-full flex items-center justify-center mb-6 opacity-50">
                            <img src="/LogoTurboBrand.webp" alt="Turbo Brand" className="w-32 opacity-50 grayscale" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-500">Selecciona una conversación</h3>
                        <p className="max-w-md text-center mt-2 text-sm">
                            Envía y recibe mensajes de WhatsApp directamente desde el CRM.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
