import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for backend operations (bypasses RLS)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : supabase; // Fallback to regular client if no service key

// =============================================
// TIPOS PARA ZONES (existente)
// =============================================
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

// =============================================
// TIPOS PARA CRM
// =============================================
export interface Organization {
    id: string;
    name: string;
    domain?: string;
    logo_url?: string;
    settings: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface CRMUser {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    role: 'admin' | 'manager' | 'agent' | 'client';
    organization_id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Contact {
    id: string;
    email?: string;
    phone?: string;
    name: string;
    company?: string;
    position?: string;
    sector?: string;
    source?: string;
    tags?: string[];
    custom_fields?: Record<string, any>;
    lead_score: number;
    organization_id: string;
    assigned_to?: string;
    created_at: string;
    updated_at: string;
}

export interface Opportunity {
    id: string;
    contact_id: string;
    title: string;
    description?: string;
    value?: number;
    currency: string;
    stage: 'lead' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost';
    probability: number;
    expected_close_date?: string;
    actual_close_date?: string;
    lost_reason?: string;
    organization_id: string;
    owner_id?: string;
    created_at: string;
    updated_at: string;
}

export interface EmailCampaign {
    id: string;
    name: string;
    subject: string;
    content: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
    scheduled_at?: string;
    sent_at?: string;
    organization_id: string;
    created_by?: string;
    created_at: string;
    updated_at: string;
}

export interface EmailSend {
    id: string;
    campaign_id: string;
    contact_id: string;
    status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'spam' | 'failed';
    sent_at?: string;
    delivered_at?: string;
    opened_at?: string;
    clicked_at?: string;
    bounced_at?: string;
    open_count: number;
    click_count: number;
    device_info?: Record<string, any>;
    location?: Record<string, any>;
    created_at: string;
}

export interface EmailEvent {
    id: string;
    send_id: string;
    event_type: 'open' | 'click' | 'bounce' | 'spam' | 'unsubscribe';
    metadata: Record<string, any>;
    created_at: string;
}

export interface WhatsAppConversation {
    id: string;
    contact_id: string;
    phone: string;
    status: 'open' | 'closed' | 'archived';
    assigned_to?: string;
    last_message_at?: string;
    organization_id: string;
    created_at: string;
    updated_at: string;
}

export interface WhatsAppMessage {
    id: string;
    conversation_id: string;
    direction: 'inbound' | 'outbound';
    content: string;
    type: 'text' | 'image' | 'video' | 'document' | 'audio';
    media_url?: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: string;
}

export interface Automation {
    id: string;
    name: string;
    description?: string;
    trigger_type: string;
    trigger_config: Record<string, any>;
    actions: any[];
    is_active: boolean;
    organization_id: string;
    created_by?: string;
    created_at: string;
    updated_at: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    due_date?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    assigned_to?: string;
    related_to_type?: string;
    related_to_id?: string;
    completed_at?: string;
    organization_id: string;
    created_by?: string;
    created_at: string;
    updated_at: string;
}

export interface Activity {
    id: string;
    type: string;
    description?: string;
    contact_id?: string;
    opportunity_id?: string;
    user_id?: string;
    metadata: Record<string, any>;
    created_at: string;
}
