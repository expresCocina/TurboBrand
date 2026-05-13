'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import WhatsAppButton from '@/components/WhatsAppButton/WhatsAppButton';

// AuthProvider solo se importa (y por tanto se ejecuta Supabase) en rutas admin/login.
// En rutas públicas (/, servicios, etc) NO se instancia para no desperdiciar
// recursos de red ni añadir trabajo al hilo principal.
import { AuthProvider } from '@/contexts/AuthContext';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLogin = pathname?.startsWith('/login');
    const isAdmin = pathname?.startsWith('/admin');
    const isProtectedRoute = isLogin || isAdmin;

    // En rutas públicas: sin AuthProvider (sin llamada a Supabase auth en cada visita)
    if (!isProtectedRoute) {
        return (
            <>
                <Navbar />
                {children}
                <WhatsAppButton />
                <Footer />
            </>
        );
    }

    // Solo en admin/login incluimos el AuthProvider
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}
