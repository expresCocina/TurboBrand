import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// API Route opcional si queremos mover la lógica al servidor
// Por ahora el cliente usa Supabase directamente (Single Tenant RLS Open)
export async function GET() {
    return NextResponse.json({ message: "Automation API Ready" });
}
