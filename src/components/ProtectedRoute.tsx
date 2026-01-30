"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();

        // Escuchar cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                router.push('/admin/login');
            }
            setAuthenticated(!!session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    const checkAuth = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/admin/login');
            } else {
                setAuthenticated(true);
            }
        } catch (error) {
            console.error('Error checking auth:', error);
            router.push('/admin/login');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                color: '#fff',
                fontSize: '1.5rem'
            }}>
                <div>
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>🔐</div>
                    Verificando autenticación...
                </div>
            </div>
        );
    }

    if (!authenticated) {
        return null;
    }

    return <>{children}</>;
}
