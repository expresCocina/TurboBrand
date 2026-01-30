"use client";

import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');

    return (
        <footer className={styles.footer} style={{ display: isAdminRoute ? 'none' : 'block' }}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.brandCol}>
                        <div className={styles.footerLogo}>
                            <Image
                                src="/LogoTurboBrand.webp"
                                alt="Turbo Brand Logo"
                                width={200}
                                height={67}
                                className={styles.logoImage}
                            />
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Agencia de Marketing Digital & Growth.
                            <br />
                            Impulsada por Inteligencia Artificial.
                        </p>
                    </div>

                    <div className={styles.infoCol}>
                        <h4>Contacto</h4>
                        <p>Carrera 43 A # 16 sur 245, piso 3, Poblado</p>
                        <p>Medellín, Colombia</p>

                        <div className={styles.socials}>
                            <Link href="https://instagram.com/Turbobrandcol" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                <Instagram size={20} /> @Turbobrandcol
                            </Link>
                            <Link href="https://facebook.com/Turbobrandcolombia" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                <Facebook size={20} /> @Turbobrandcolombia
                            </Link>
                        </div>
                    </div>
                </div>

                <div className={styles.madeBy}>
                    Hecho con ❤️ por{' '}
                    <Link
                        href="https://wa.me/573138537261"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.agencyLink}
                    >
                        Renting AMC Agency
                    </Link>
                </div>

                <div className={styles.copyright}>
                    &copy; {new Date().getFullYear()} Turbo Brand. Todos los derechos reservados.
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '10px' }}>
                        <Link href="/politicas" className={styles.adminLink}>
                            Políticas y Términos
                        </Link>
                        <Link href="/admin/login" className={styles.adminLink}>
                            🔐 Admin
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
