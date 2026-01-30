"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.push('/admin/login');
    }, [router]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            color: '#fff',
            fontSize: '1.2rem'
        }}>
            Redirigiendo al panel de administración...
        </div>
    );
}
