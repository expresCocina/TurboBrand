import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface Zone {
    id: string;
    name: string;
    type: 'comuna' | 'municipio';
    status: 'available' | 'occupied';
    coordinates: any;
    metadata?: any;
    created_at?: string;
    updated_at?: string;
}

// GET - Listar todas las zonas
export async function GET() {
    try {
        const { data: zones, error } = await supabase
            .from('zones')
            .select('*')
            .order('name');

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        const stats = {
            total: zones?.length || 0,
            available: zones?.filter(z => z.status === 'available').length || 0,
            occupied: zones?.filter(z => z.status === 'occupied').length || 0
        };

        return NextResponse.json({
            success: true,
            zones,
            stats
        });
    } catch (error) {
        console.error('Error loading zones:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to load zones' },
            { status: 500 }
        );
    }
}

// POST - Crear nueva zona
export async function POST(request: NextRequest) {
    try {
        const newZone: Zone = await request.json();

        // Validaciones
        if (!newZone.id || !newZone.name || !newZone.type || !newZone.coordinates) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('zones')
            .insert([{
                ...newZone,
                status: newZone.status || 'available'
            }])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            zone: data,
            message: 'Zone created successfully'
        });
    } catch (error) {
        console.error('Error creating zone:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create zone' },
            { status: 500 }
        );
    }
}
