import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getGoogleBusyIntervals, isSlotBusy } from '@/lib/googleCalendar';

const HOURLY_SLOTS = [
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00',
];

// GET /api/meetings/slots?date=YYYY-MM-DD
// Returns the list of time strings already booked on a given date, combining
// meetings agendadas (Supabase) con eventos existentes en Google Calendar
// (incluye los creados manualmente por fuera del agendador).
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

  const supabaseBooked = (data ?? []).map((r: { time: string }) => r.time.substring(0, 5));

  const busyIntervals = await getGoogleBusyIntervals(date);
  const calendarBooked = HOURLY_SLOTS.filter((slot) => isSlotBusy(date, slot, busyIntervals));

  const booked = Array.from(new Set([...supabaseBooked, ...calendarBooked]));

  return NextResponse.json({ date, booked });
}
