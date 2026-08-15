import { google } from 'googleapis';

export interface BusyInterval {
  start: string;
  end: string;
}

// Consulta la disponibilidad real del calendario de Google (incluye eventos
// creados manualmente, no solo los generados por el agendador) vía freebusy.query.
export async function getGoogleBusyIntervals(date: string): Promise<BusyInterval[]> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

  if (!clientId || !clientSecret || !refreshToken) {
    return [];
  }

  try {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const res = await calendar.freebusy.query({
      requestBody: {
        timeMin: `${date}T00:00:00-05:00`,
        timeMax: `${date}T23:59:59-05:00`,
        timeZone: 'America/Bogota',
        items: [{ id: calendarId }],
      },
    });

    const busy = res.data.calendars?.[calendarId]?.busy ?? [];
    return busy
      .filter((b): b is { start: string; end: string } => !!b.start && !!b.end)
      .map((b) => ({ start: b.start, end: b.end }));
  } catch (err) {
    console.error('[googleCalendar] freebusy error:', err);
    return [];
  }
}

// Un slot de 1 hora se considera ocupado si se solapa con cualquier intervalo "busy".
export function isSlotBusy(date: string, time: string, busyIntervals: BusyInterval[]): boolean {
  const slotStart = new Date(`${date}T${time}:00-05:00`);
  const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);

  return busyIntervals.some(({ start, end }) => {
    const busyStart = new Date(start);
    const busyEnd = new Date(end);
    return slotStart < busyEnd && slotEnd > busyStart;
  });
}
