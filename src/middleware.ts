// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    return NextResponse.next();
    /* 
    // Comentado temporalmente por error 500 con createMiddlewareClient
    try {
        const res = NextResponse.next();
        const supabase = createMiddlewareClient({ req, res });
        // ... (resto del código)
    } catch (e) { ... } 
    */
}

export const config = {
    matcher: ['/admin/:path*', '/login'],
};
