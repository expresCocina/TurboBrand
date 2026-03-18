"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmedContent() {
  const params = useSearchParams();
  const ok = params.get("ok");
  const already = params.get("already");
  const error = params.get("error");
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const isError = !!error;
  const isAlready = !!already;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(160deg, #0a0a0a 0%, #150010 50%, #0a0a0a 100%)",
      padding: "2rem",
      fontFamily: "var(--font-outfit), sans-serif",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${isError ? "rgba(255,80,80,0.25)" : "rgba(0,255,136,0.2)"}`,
        borderRadius: "20px",
        padding: "3rem 2.5rem",
        maxWidth: "480px",
        width: "100%",
        textAlign: "center",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1.25rem" }}>
          {isError ? "❌" : "✅"}
        </div>
        <h1 style={{
          color: "#fff",
          fontSize: "1.75rem",
          fontWeight: 700,
          margin: "0 0 1rem",
        }}>
          {isError
            ? error === "2"
              ? "Reunión cancelada"
              : "Algo salió mal"
            : isAlready
            ? "¡Ya estaba confirmada!"
            : "¡Reunión confirmada!"}
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: "1rem",
          lineHeight: 1.7,
          margin: "0 0 2rem",
        }}>
          {isError
            ? error === "2"
              ? "Esta reunión ya fue cancelada. Contáctanos por WhatsApp si necesitas reagendar."
              : "No pudimos confirmar tu reunión. El enlace puede haber expirado. Contáctanos por WhatsApp."
            : isAlready
            ? "Tu reunión ya estaba registrada como confirmada. ¡Nos vemos pronto!"
            : "Tu asistencia ha sido registrada exitosamente. ¡Nos vemos en la reunión!"}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
          <a
            href="https://wa.me/573138537261"
            style={{
              display: "inline-block",
              padding: "0.85rem 2rem",
              background: "linear-gradient(135deg, #9E0060 0%, #FF0080 100%)",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            📲 Contactar por WhatsApp
          </a>
          <Link
            href="/"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmadaPage() {
  return (
    <Suspense>
      <ConfirmedContent />
    </Suspense>
  );
}
