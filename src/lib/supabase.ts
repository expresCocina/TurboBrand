import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para TypeScript
export interface Zone {
    id: string;
    name: string;
    type: 'comuna' | 'municipio';
    status: 'available' | 'occupied';
    coordinates: any; // JSONB
    metadata?: any; // JSONB
    created_at?: string;
    updated_at?: string;
}
