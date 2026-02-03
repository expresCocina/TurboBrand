"use client";

import { useState, useEffect, use } from 'react';
import TemplateEditor from '@/components/email/TemplateEditor';

export default function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargar datos de la plantilla
        fetch(`/api/email/templates/${resolvedParams.id}`)
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setTemplate(data);
                } else {
                    alert('Error cargando plantilla');
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [resolvedParams.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
            </div>
        );
    }

    if (!template) {
        return <div className="p-10 text-center">Plantilla no encontrada</div>;
    }

    return <TemplateEditor mode="edit" initialData={template} />;
}
