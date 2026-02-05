import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const ACCESS_TOKEN = process.env.FB_CAPI_ACCESS_TOKEN;

/**
 * SHA-256 hash function for PII normalization
 * Facebook requires emails and phones to be hashed before sending
 */
function hashSHA256(input: string): string {
    return crypto.createHash('sha256').update(input.toLowerCase().trim()).digest('hex');
}

/**
 * Normalize and hash email
 */
function normalizeEmail(email: string): string {
    return hashSHA256(email.toLowerCase().trim());
}

/**
 * Normalize and hash phone number
 * Removes all non-numeric characters
 */
function normalizePhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    return hashSHA256(cleaned);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            eventName,
            eventId,
            emails,
            phones,
            clientIp,
            userAgent,
            sourceUrl,
            customData = {},
            value,
            currency = 'COP'
        } = body;

        // Validate required fields
        if (!eventName) {
            return NextResponse.json({ error: 'eventName is required' }, { status: 400 });
        }

        // Build user_data with hashed PII
        const userData: any = {
            client_ip_address: clientIp,
            client_user_agent: userAgent,
        };

        if (emails && emails.length > 0) {
            userData.em = emails.map((e: string) => normalizeEmail(e));
        }

        if (phones && phones.length > 0) {
            userData.ph = phones.map((p: string) => normalizePhone(p));
        }

        // Build custom_data
        const eventCustomData: any = { ...customData };
        if (value !== undefined) {
            eventCustomData.value = value;
        }
        if (currency) {
            eventCustomData.currency = currency;
        }

        const eventData = [
            {
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                event_id: eventId || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                event_source_url: sourceUrl || req.headers.get('referer') || '',
                action_source: 'website',
                user_data: userData,
                custom_data: Object.keys(eventCustomData).length > 0 ? eventCustomData : undefined,
            }
        ];

        if (!ACCESS_TOKEN) {
            console.warn('⚠️ FB_CAPI_ACCESS_TOKEN not set - skipping CAPI event');
            return NextResponse.json({
                status: 'skipped',
                reason: 'no_token',
                message: 'CAPI access token not configured'
            });
        }

        if (!PIXEL_ID) {
            console.warn('⚠️ NEXT_PUBLIC_FB_PIXEL_ID not set - skipping CAPI event');
            return NextResponse.json({
                status: 'skipped',
                reason: 'no_pixel_id',
                message: 'Pixel ID not configured'
            });
        }

        console.log('📊 Sending CAPI Event:', {
            eventName,
            eventId: eventData[0].event_id,
            hasEmail: !!userData.em,
            hasPhone: !!userData.ph,
        });

        const response = await fetch(
            `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: eventData,
                    test_event_code: process.env.FB_TEST_EVENT_CODE, // Optional: for testing in Events Manager
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error('❌ CAPI Error Response:', result);
            return NextResponse.json({
                error: 'Facebook API error',
                details: result
            }, { status: response.status });
        }

        console.log('✅ CAPI Event Sent Successfully:', result);
        return NextResponse.json({
            success: true,
            ...result
        });

    } catch (error: any) {
        console.error('❌ CAPI Server Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error.message
        }, { status: 500 });
    }
}
