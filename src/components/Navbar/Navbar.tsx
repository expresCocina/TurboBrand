"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        {/* Logo Area */}
        <Link href="/" className={styles.logoWrapper}>
          <div className={styles.logoTextPlaceholder}>
            TURBO <span style={{ color: 'var(--brand)' }}>BRAND</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className={styles.links}>
          <Link href="#nosotros" className={styles.link}>Nosotros</Link>
          <Link href="#servicios" className={styles.link}>Servicios</Link>
          <Link href="#clientes" className={styles.link}>Clientes</Link>
          <Link href="#contacto" className={styles.cta}>Contacto</Link>
        </div>

        {/* Mobile Menu Button - Hidden on Desktop handled by CSS */}
        <button className={styles.menuBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
    </nav>
  );
}
