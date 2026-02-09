import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// DELETE: Eliminar una campaña
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Eliminar la campaña
        const { error } = await supabase
            .from('email_campaigns')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Campaña eliminada exitosamente' });

    } catch (error: any) {
        console.error('Error eliminando campaña:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
