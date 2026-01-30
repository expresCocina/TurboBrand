import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PATCH - Actualizar zona
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const updates = await request.json();

        console.log('PATCH request for zone:', id, 'with updates:', updates);

        // Si se marca como ocupada, agregar metadata
        if (updates.status === 'occupied' && !updates.metadata?.occupiedDate) {
            updates.metadata = {
                ...updates.metadata,
                occupiedDate: new Date().toISOString()
            };
        }

        // Si se libera, limpiar metadata
        if (updates.status === 'available') {
            updates.metadata = null;
        }

        const { data, error } = await supabase
            .from('zones')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            );
        }

        console.log('Zone updated successfully:', data);

        return NextResponse.json({
            success: true,
            zone: data,
            message: 'Zone updated successfully'
        });
    } catch (error) {
        console.error('Error updating zone:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update zone' },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar zona
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        console.log('DELETE request for zone:', id);

        const { data, error } = await supabase
            .from('zones')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            );
        }

        console.log('Zone deleted successfully:', data);

        return NextResponse.json({
            success: true,
            zone: data,
            message: 'Zone deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting zone:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete zone' },
            { status: 500 }
        );
    }
}
