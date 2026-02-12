'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import WhatsAppButton from '@/components/WhatsAppButton/WhatsAppButton';

import { AuthProvider } from '@/contexts/AuthContext';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLogin = pathname?.startsWith('/login');
    const isAdmin = pathname?.startsWith('/admin');

    return (
        <AuthProvider>
            {!isLogin && !isAdmin && <Navbar />}
            {children}
            {!isLogin && !isAdmin && <WhatsAppButton />}
            {!isLogin && !isAdmin && <Footer />}
        </AuthProvider>
    );
}
