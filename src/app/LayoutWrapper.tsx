'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import WhatsAppButton from '@/components/WhatsAppButton/WhatsAppButton';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isCRM = pathname?.startsWith('/crm');

    return (
        <>
            {!isCRM && <Navbar />}
            {children}
            {!isCRM && <WhatsAppButton />}
            {!isCRM && <Footer />}
        </>
    );
}
