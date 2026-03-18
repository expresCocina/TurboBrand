import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import { google } from 'googleapis';

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];
  return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
}

function formatTime(timeStr: string) {
  const [hh, mm] = timeStr.split(':');
  const h = parseInt(hh);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${mm} ${ampm}`;
}

// ─── Email templates ────────────────────────────────────────────────────────

function clientEmailHtml(data: {
  name: string;
  email: string;
  meeting_type: string;
  date: string;
  time: string;
  confirmUrl: string;
  meetLink?: string;
}) {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Confirma tu Reunión</title></head>
<body style="margin:0;padding:0;font-family:'Outfit',Arial,sans-serif;background:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#9E0060 0%,#FF0080 100%);padding:40px 40px 30px;text-align:center;">
            <p style="margin:0;color:#fff;font-size:14px;letter-spacing:3px;text-transform:uppercase;opacity:0.8;">Turbo Brand</p>
            <h1 style="margin:12px 0 0;color:#fff;font-size:26px;font-weight:700;">¡Confirma tu cita!</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="color:rgba(255,255,255,0.85);font-size:16px;line-height:1.6;margin:0 0 28px;">
              Hola <strong style="color:#fff;">${data.name}</strong>, hemos recibido tu solicitud de reunión. Por favor confirma tu asistencia haciendo clic en el botón:
            </p>
            <!-- Confirm button -->
            <div style="text-align:center;margin-bottom:28px;">
              <a href="${data.confirmUrl}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#9E0060 0%,#FF0080 100%);color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:17px;letter-spacing:0.5px;">
                ✅ Confirmar Cita
              </a>
            </div>
            <!-- Details card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;margin-bottom:28px;">
              <tr>
                <td style="padding:24px;">
                  <table width="100%" cellpadding="8" cellspacing="0">
                    <tr>
                      <td style="color:rgba(255,255,255,0.5);font-size:13px;text-transform:uppercase;letter-spacing:1px;width:40%;">📅 Fecha</td>
                      <td style="color:#fff;font-size:15px;font-weight:600;">${formatDate(data.date)}</td>
                    </tr>
                    <tr>
                      <td style="color:rgba(255,255,255,0.5);font-size:13px;text-transform:uppercase;letter-spacing:1px;">⏰ Hora</td>
                      <td style="color:#fff;font-size:15px;font-weight:600;">${formatTime(data.time)} (hora Colombia)</td>
                    </tr>
                    <tr>
                      <td style="color:rgba(255,255,255,0.5);font-size:13px;text-transform:uppercase;letter-spacing:1px;">🎯 Tipo</td>
                      <td style="color:#fff;font-size:15px;font-weight:600;">${data.meeting_type}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <p style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;margin:0 0 28px;text-align:center;">
              Si no solicitaste esta reunión, ignora este correo. Si necesitas ayuda contáctanos por WhatsApp.
            </p>
            <div style="text-align:center;">
              <a href="https://wa.me/573138537261" style="display:inline-block;padding:12px 28px;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.75);text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;border:1px solid rgba(255,255,255,0.12);">
                Contactar por WhatsApp
              </a>
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="border-top:1px solid rgba(255,255,255,0.08);padding:24px 40px;text-align:center;">
            <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0;">© 2025 Turbo Brand · Marketing Digital 5.0 · Medellín, Colombia</p>
            <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:8px 0 0;">turbobrandcol.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ownerEmailHtml(data: {
  name: string;
  email: string;
  phone: string;
  meeting_type: string;
  date: string;
  time: string;
  message?: string;
  scheduled_by: string;
  meetLink?: string;
}) {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Nueva Solicitud de Reunión</title></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a2e 0%,#9E0060 100%);padding:30px 40px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">🗓️ Nueva Solicitud de Reunión</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">
              Agendada por: <strong style="color:#FF0080;">${data.scheduled_by === 'admin' ? 'Administrador' : 'Cliente'}</strong>
              &nbsp;&middot;&nbsp;
              <strong style="color:#FFD700;">⏳ Pendiente de confirmación del cliente</strong>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;">
              <tr><td style="padding:24px;">
                <table width="100%" cellpadding="10" cellspacing="0">
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
                    <td style="color:rgba(255,255,255,0.5);font-size:13px;width:35%;">👤 Nombre</td>
                    <td style="color:#fff;font-weight:600;">${data.name}</td>
                  </tr>
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
                    <td style="color:rgba(255,255,255,0.5);font-size:13px;">📧 Correo</td>
                    <td style="color:#fff;">${data.email}</td>
                  </tr>
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
                    <td style="color:rgba(255,255,255,0.5);font-size:13px;">📱 Teléfono</td>
                    <td style="color:#fff;">${data.phone}</td>
                  </tr>
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
                    <td style="color:rgba(255,255,255,0.5);font-size:13px;">📅 Fecha</td>
                    <td style="color:#fff;">${formatDate(data.date)}</td>
                  </tr>
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
                    <td style="color:rgba(255,255,255,0.5);font-size:13px;">⏰ Hora</td>
                    <td style="color:#fff;">${formatTime(data.time)} (Colombia)</td>
                  </tr>
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
                    <td style="color:rgba(255,255,255,0.5);font-size:13px;">🎯 Tipo</td>
                    <td style="color:#FF0080;font-weight:600;">${data.meeting_type}</td>
                  </tr>
                  ${data.meetLink ? `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
                    <td style="color:rgba(255,255,255,0.5);font-size:13px;">🎥 Google Meet</td>
                    <td style="padding:6px 0;"><a href="${data.meetLink}" style="color:#00BCD4;font-weight:600;word-break:break-all;">${data.meetLink}</a></td>
                  </tr>` : ''}
                  ${data.message ? `
                  <tr>
                    <td style="color:rgba(255,255,255,0.5);font-size:13px;vertical-align:top;padding-top:14px;">💬 Mensaje</td>
                    <td style="color:rgba(255,255,255,0.85);padding-top:14px;">${data.message}</td>
                  </tr>` : ''}
                </table>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid rgba(255,255,255,0.08);padding:20px 40px;text-align:center;">
            <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">Turbo Brand — Panel Administrativo</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── POST /api/meetings ──────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, meeting_type, message, date, time, scheduled_by = 'client' } = body;

    // Validation
    if (!name || !email || !phone || !meeting_type || !date || !time) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
    }

    // ── Verificar doble booking ───────────────────────────────────────────────
    const { data: existing } = await supabaseAdmin
      .from('meetings')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .neq('status', 'cancelled')
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({
        error: 'Este horario ya está reservado. Por favor elige otra fecha u hora.',
        code: 'SLOT_TAKEN',
      }, { status: 409 });
    }

    // ── PASO 1: Guardar en Supabase ──────────────────────────────────────────
    const { data: meeting, error: dbError } = await supabaseAdmin
      .from('meetings')
      .insert([{ name, email, phone, meeting_type, message: message || null, date, time, status: 'pending', scheduled_by }])
      .select()
      .single();

    if (dbError) {
      console.error('[meetings] Supabase error:', dbError);
      return NextResponse.json({ error: `Error al guardar en base de datos: ${dbError.message}` }, { status: 500 });
    }

    // ── PASO 2: Crear evento en Google Calendar ──────────────────────────────
    let meetLink: string | undefined;
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
      const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

      if (clientId && clientSecret && refreshToken) {
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
        oauth2Client.setCredentials({ refresh_token: refreshToken });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // Build datetime strings in America/Bogota (UTC-5)
        const startIso = `${date}T${time}:00`;
        const [hh, mm] = time.split(':').map(Number);
        const endHH = String(hh + 1).padStart(2, '0');
        const endIso = `${date}T${endHH}:${String(mm).padStart(2, '0')}:00`;

        const calEvent = await calendar.events.insert({
          calendarId,
          // conferenceDataVersion=1 enables Google Meet generation
          conferenceDataVersion: 1,
          requestBody: {
            summary: `Reunión con ${name} — Turbo Brand`,
            description: `Tipo: ${meeting_type}\nTeléfono: ${phone}${message ? `\nMensaje: ${message}` : ''}`,
            start: { dateTime: startIso, timeZone: 'America/Bogota' },
            end: { dateTime: endIso, timeZone: 'America/Bogota' },
            attendees: [{ email }],
            conferenceData: {
              createRequest: {
                requestId: meeting.id,
                conferenceSolutionKey: { type: 'hangoutsMeet' },
              },
            },
          },
        });

        // Extract the Meet link from the response
        const entryPoints = calEvent.data.conferenceData?.entryPoints ?? [];
        const videoEntry = entryPoints.find((ep) => ep.entryPointType === 'video');
        meetLink = videoEntry?.uri ?? entryPoints[0]?.uri ?? undefined;

        if (meetLink) {
          console.log('[meetings] Google Meet link generated:', meetLink);
          // Persist meet_link in Supabase so it's available when client confirms
          await supabaseAdmin
            .from('meetings')
            .update({ meet_link: meetLink })
            .eq('id', meeting.id);
        }
      } else {
        console.warn('[meetings] Google Calendar credentials not configured — skipping calendar event');
      }
    } catch (calErr) {
      console.error('[meetings] Google Calendar error:', calErr);
      return NextResponse.json({ error: 'Reunión guardada, pero falló la creación en Google Calendar. Verifica las credenciales.' }, { status: 500 });
    }

    // ── PASO 3: Enviar correos con Resend ────────────────────────────────────
    const fromEmail = process.env.EMAIL_FROM || 'noreply@send.turbobrandcol.com';
    const notifyEmail = process.env.MEETINGS_NOTIFY_EMAIL || fromEmail;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://turbobrandcol.com';
    const confirmUrl = `${appUrl}/api/meetings/confirm?id=${meeting.id}`;

    const emailResults = await Promise.allSettled([
      // Email al cliente con botón de confirmación
      resend.emails.send({
        from: `Turbo Brand <${fromEmail}>`,
        to: email,
        subject: `⏳ Confirma tu cita — ${meeting_type} | Turbo Brand`,
        html: clientEmailHtml({ name, email, meeting_type, date, time, confirmUrl }),
      }),
      // Email al dueño
      resend.emails.send({
        from: `Turbo Brand <${fromEmail}>`,
        to: notifyEmail,
        subject: `🗓️ Nueva solicitud: ${name} — ${meeting_type}`,
        html: ownerEmailHtml({ name, email, phone, meeting_type, date, time, message, scheduled_by, meetLink }),
      }),
      // CC fijo a gerencia
      resend.emails.send({
        from: `Turbo Brand <${fromEmail}>`,
        to: 'gerencia@turbobrandcol.com',
        subject: `🗓️ Nueva solicitud: ${name} — ${meeting_type}`,
        html: ownerEmailHtml({ name, email, phone, meeting_type, date, time, message, scheduled_by, meetLink }),
      }),
    ]);

    const emailErrors = emailResults
      .filter((r) => r.status === 'rejected')
      .map((r) => (r as PromiseRejectedResult).reason);

    if (emailErrors.length > 0) {
      console.error('[meetings] Email errors:', emailErrors);
      return NextResponse.json({
        error: 'Reunión agendada y calendario creado, pero fallaron los correos: ' + emailErrors.join(', '),
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, meeting });
  } catch (err) {
    console.error('[meetings] Unexpected error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}

// ─── GET /api/meetings (para el panel admin) ─────────────────────────────────

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('meetings')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, meetings: data });
  } catch (err) {
    console.error('[meetings] GET error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}

// ─── DELETE /api/meetings ────────────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const { error } = await supabaseAdmin.from('meetings').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[meetings] DELETE error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
