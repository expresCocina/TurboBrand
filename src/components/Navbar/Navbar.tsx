"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
          <div className={styles.logoText}>
            TURBO <span className={styles.logoAccent}>BRAND</span>
          </div>
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
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          type="button"
        >
          <span className={styles.menuIcon} aria-hidden="true" />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileOpen : ""
          }`}
        role="dialog"
        aria-label="Menú móvil"
        aria-modal="true"
        onClick={() => setMobileOpen(false)}
      >
        <div
          className={styles.mobilePanel}
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              onClick={handleAnchor(it.href)}
              className={styles.mobileLink}
            >
              {it.label}
            </Link>
          ))}
          <Link
            href="#contacto"
            onClick={handleAnchor("#contacto")}
            className={styles.mobileCta}
          >
            Contacto
          </Link>
        </div>
      </div>
    </nav>
  );
}
