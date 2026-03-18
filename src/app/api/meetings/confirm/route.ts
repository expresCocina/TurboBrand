import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
}

function formatTime(t: string) {
  const [hh, mm] = t.split(':');
  const h = parseInt(hh);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${mm} ${ampm}`;
}

// GET /api/meetings/confirm?id=UUID
// Called when the client clicks "Confirmar Cita" in their email
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.redirect(new URL('/agenda/confirmada?error=1', req.url));
  }

  // Fetch ALL fields needed for emails
  const { data: meeting, error: fetchError } = await supabaseAdmin
    .from('meetings')
    .select('id, status, name, email, phone, meeting_type, date, time, message, scheduled_by')
    .eq('id', id)
    .single();

  if (fetchError || !meeting) {
    return NextResponse.redirect(new URL('/agenda/confirmada?error=1', req.url));
  }

  if (meeting.status === 'confirmed') {
    return NextResponse.redirect(new URL('/agenda/confirmada?already=1', req.url));
  }

  if (meeting.status === 'cancelled') {
    return NextResponse.redirect(new URL('/agenda/confirmada?error=2', req.url));
  }

  // Update to confirmed
  const { error: updateError } = await supabaseAdmin
    .from('meetings')
    .update({ status: 'confirmed' })
    .eq('id', id);

  if (updateError) {
    console.error('[meetings/confirm] Update error:', updateError);
    return NextResponse.redirect(new URL('/agenda/confirmada?error=1', req.url));
  }

  // ── Send emails (non-blocking — don't let email failure block the redirect) ──
  try {
    const fromEmail = process.env.EMAIL_FROM || 'noreply@send.turbobrandcol.com';
    const notifyEmail = process.env.MEETINGS_NOTIFY_EMAIL || fromEmail;
    const gerencia = 'gerencia@turbobrandcol.com';

    // Try to retrieve the meet_link if stored (may not be in schema yet — graceful fallback)
    const meetLink: string | undefined = (meeting as Record<string, unknown>).meet_link as string | undefined;

    const clientHtml = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>¡Reunión Confirmada!</title></head>
<body style="margin:0;padding:0;font-family:'Outfit',Arial,sans-serif;background:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
      <tr><td style="background:linear-gradient(135deg,#00897B 0%,#00BCD4 100%);padding:36px 40px;text-align:center;">
        <p style="margin:0;color:#fff;font-size:13px;letter-spacing:3px;text-transform:uppercase;opacity:0.8;">Turbo Brand</p>
        <h1 style="margin:10px 0 0;color:#fff;font-size:26px;font-weight:700;">¡Tu reunión está confirmada! 🎉</h1>
      </td></tr>
      <tr><td style="padding:36px 40px;">
        <p style="color:rgba(255,255,255,0.85);font-size:16px;line-height:1.6;margin:0 0 24px;">
          Hola <strong style="color:#fff;">${meeting.name}</strong>, hemos registrado tu confirmación. ¡Todo listo para vernos!
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;margin-bottom:24px;">
          <tr><td style="padding:20px;">
            <table width="100%" cellpadding="8" cellspacing="0">
              <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;width:38%;">📅 Fecha</td><td style="color:#fff;font-weight:600;">${formatDate(meeting.date)}</td></tr>
              <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;">⏰ Hora</td><td style="color:#fff;font-weight:600;">${formatTime(meeting.time.substring(0,5))} (Colombia)</td></tr>
              <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;">🎯 Tipo</td><td style="color:#fff;font-weight:600;">${meeting.meeting_type}</td></tr>
            </table>
          </td></tr>
        </table>
        ${meetLink ? `
        <div style="text-align:center;margin-bottom:20px;">
          <a href="${meetLink}" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#00897B 0%,#00BCD4 100%);color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:16px;">
            🎥 Unirse a la reunión por Google Meet
          </a>
        </div>` : ''}
        <div style="text-align:center;">
          <a href="https://wa.me/573138537261" style="display:inline-block;padding:12px 28px;background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.75);text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;border:1px solid rgba(255,255,255,0.12);">
            📲 Contactar por WhatsApp
          </a>
        </div>
      </td></tr>
      <tr><td style="border-top:1px solid rgba(255,255,255,0.08);padding:18px 40px;text-align:center;">
        <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;">© 2025 Turbo Brand · turbobrandcol.com</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;

    const ownerHtml = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Reunión Confirmada por Cliente</title></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
      <tr><td style="background:linear-gradient(135deg,#00897B 0%,#00BCD4 100%);padding:28px 40px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">✅ Reunión Confirmada por el Cliente</h1>
      </td></tr>
      <tr><td style="padding:28px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;">
          <tr><td style="padding:20px;">
            <table width="100%" cellpadding="9" cellspacing="0">
              <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;width:35%;">👤 Nombre</td><td style="color:#fff;font-weight:600;">${meeting.name}</td></tr>
              <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;">📧 Correo</td><td style="color:#fff;">${meeting.email}</td></tr>
              <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;">📱 Teléfono</td><td style="color:#fff;">${meeting.phone}</td></tr>
              <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;">📅 Fecha</td><td style="color:#fff;">${formatDate(meeting.date)}</td></tr>
              <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;">⏰ Hora</td><td style="color:#fff;">${formatTime(meeting.time.substring(0,5))} (Colombia)</td></tr>
              <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;">🎯 Tipo</td><td style="color:#FF0080;font-weight:600;">${meeting.meeting_type}</td></tr>
              ${meetLink ? `<tr><td style="color:rgba(255,255,255,0.5);font-size:13px;">🎥 Google Meet</td><td><a href="${meetLink}" style="color:#00BCD4;font-weight:600;">${meetLink}</a></td></tr>` : ''}
              ${meeting.message ? `<tr><td style="color:rgba(255,255,255,0.5);font-size:13px;vertical-align:top;padding-top:12px;">💬 Mensaje</td><td style="color:rgba(255,255,255,0.85);padding-top:12px;">${meeting.message}</td></tr>` : ''}
            </table>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="border-top:1px solid rgba(255,255,255,0.08);padding:16px 40px;text-align:center;">
        <p style="color:rgba(255,255,255,0.35);font-size:12px;margin:0;">Turbo Brand — Panel Administrativo</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;

    const subject = `✅ ${meeting.name} confirmó su reunión — ${meeting.meeting_type}`;

    await Promise.allSettled([
      // Email de confirmación al cliente (con Meet link si existe)
      resend.emails.send({
        from: `Turbo Brand <${fromEmail}>`,
        to: meeting.email,
        subject: `✅ ¡Reunión confirmada! — ${meeting.meeting_type} | Turbo Brand`,
        html: clientHtml,
      }),
      // Notificación al dueño
      resend.emails.send({
        from: `Turbo Brand <${fromEmail}>`,
        to: notifyEmail,
        subject,
        html: ownerHtml,
      }),
      // CC fijo a gerencia
      resend.emails.send({
        from: `Turbo Brand <${fromEmail}>`,
        to: gerencia,
        subject,
        html: ownerHtml,
      }),
    ]);
  } catch (emailErr) {
    console.error('[meetings/confirm] Email error (non-blocking):', emailErr);
  }

  return NextResponse.redirect(new URL('/agenda/confirmada?ok=1', req.url));
}

