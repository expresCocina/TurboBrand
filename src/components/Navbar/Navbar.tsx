"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";

type NavItem = { label: string; href: string };

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const items: NavItem[] = useMemo(
    () => [
      { label: "Nosotros", href: "#nosotros" },
      { label: "Servicios", href: "#servicios" },
      { label: "Clientes", href: "#clientes" },
      { label: "Tu Local Digital", href: "#tu-local-digital" },
    ],
    []
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const scrollToAnchor = useCallback((href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  }, []);

  const handleAnchor = (href: string) => (e: React.MouseEvent) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    scrollToAnchor(href);
  };

  const toggleMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
      style={{ display: isAdminRoute ? 'none' : 'block' }}
    >
      <div className={styles.navContainer}>
        <Link
          href="#home"
          onClick={handleAnchor("#home")}
          className={styles.logoWrapper}
          aria-label="Ir al inicio"
        >
          <Image
            src="/LogoTurboBrand.webp"
            alt="Turbo Brand Logo"
            width={180}
            height={60}
            priority
            className={styles.logoImage}
          />
        </Link>

        <div className={styles.links} aria-label="Navegación principal">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              onClick={handleAnchor(it.href)}
              className={styles.link}
            >
              {it.label}
            </Link>
          ))}
          <Link
            href="#contacto"
            onClick={handleAnchor("#contacto")}
            className={styles.cta}
          >
            Contacto
          </Link>
        </div>

        <button
          className={styles.menuBtn}
          onClick={toggleMenu}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
          type="button"
        >
          <span className={styles.menuIcon} aria-hidden="true" />
        </button>
      </div>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'stretch'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '320px',
              maxWidth: '85vw',
              background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.98) 0%, rgba(30, 30, 30, 0.98) 100%)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Image
                src="/LogoTurboBrand.webp"
                alt="Turbo Brand"
                width={120}
                height={40}
                style={{ maxHeight: '40px', width: 'auto' }}
              />
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '24px'
                }}
                aria-label="Cerrar menú"
              >
                ×
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              {items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={handleAnchor(it.href)}
                  style={{
                    textDecoration: 'none',
                    color: 'rgba(255, 255, 255, 0.85)',
                    padding: '16px',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  {it.label}
                </Link>
              ))}
              <Link
                href="#contacto"
                onClick={handleAnchor("#contacto")}
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #9E0060 0%, #FF0080 100%)',
                  textAlign: 'center',
                  marginTop: '16px'
                }}
              >
                Contacto
              </Link>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}
