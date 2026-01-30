"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                router.push('/admin/zones');
            }
        } catch (error: any) {
            setError(error.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Animated Background */}
            <div className={styles.backgroundAnimation}>
                <div className={styles.circle1}></div>
                <div className={styles.circle2}></div>
                <div className={styles.circle3}></div>
            </div>

            {/* Login Card */}
            <div className={styles.loginCard}>
                <div className={styles.logoSection}>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>🗺️</span>
                    </div>
                    <h1 className={styles.title}>Turbo Brand</h1>
                    <p className={styles.subtitle}>Panel de Administración</p>
                </div>

                <form onSubmit={handleLogin} className={styles.form}>
                    {error && (
                        <div className={styles.errorAlert}>
                            <span>⚠️</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Correo Electrónico</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>📧</span>
                            <input
                                id="email"
                                type="email"
                                placeholder="admin@turbobrand.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Contraseña</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>🔒</span>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className={styles.spinner}></span>
                                Iniciando sesión...
                            </>
                        ) : (
                            <>
                                <span>✨</span>
                                Iniciar Sesión
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>🔐 Acceso seguro con Supabase</p>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className={styles.decorativeGrid}></div>
        </div>
    );
}
