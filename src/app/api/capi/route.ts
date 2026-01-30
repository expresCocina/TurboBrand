import { NextRequest, NextResponse } from 'next/server';

const PIXEL_ID = '1234567890'; // Replace with actual Pixel ID
const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN; // Needs to be set in .env

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { eventName, eventId, emails, phones, clientIp, userAgent, sourceUrl } = body;

        const eventData = [
            {
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                event_id: eventId,
                event_source_url: sourceUrl,
                action_source: 'website',
                user_data: {
                    client_ip_address: clientIp,
                    client_user_agent: userAgent,
                    em: emails ? emails.map((e: string) => hash(e)) : undefined,
                    ph: phones ? phones.map((p: string) => hash(p)) : undefined,
                }
            }
        ];

        if (!ACCESS_TOKEN) {
            console.warn('FB_ACCESS_TOKEN not set');
            return NextResponse.json({ status: 'skipped', reason: 'no_token' });
        }

        const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: eventData
            }),
        });

        const result = await response.json();
        return NextResponse.json(result);

    } catch (error) {
        console.error('CAPI Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Simple SHA256 helper for demo (in prod use crypto lib)
function hash(input: string) {
    // In a real implementation, use actual SHA256 hashing here
    // For this template, we return as is or mock hash
    return input;
}
