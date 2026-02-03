'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import WhatsAppButton from '@/components/WhatsAppButton/WhatsAppButton';

import { AuthProvider } from '@/contexts/AuthContext';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isCRM = pathname?.startsWith('/crm');
    const isLogin = pathname?.startsWith('/login');

    return (
        <AuthProvider>
            {!isCRM && !isLogin && <Navbar />}
            {children}
            {!isCRM && !isLogin && <WhatsAppButton />}
            {!isCRM && !isLogin && <Footer />}
        </AuthProvider>
    );
}
