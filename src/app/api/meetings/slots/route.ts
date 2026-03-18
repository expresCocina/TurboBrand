import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/meetings/slots?date=YYYY-MM-DD
// Returns the list of time strings already booked on a given date (status != cancelled)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Fecha inválida.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('meetings')
    .select('time')
    .eq('date', date)
    .neq('status', 'cancelled');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return only the HH:MM part of each time string
  const booked = (data ?? []).map((r: { time: string }) => r.time.substring(0, 5));

  return NextResponse.json({ date, booked });
}
