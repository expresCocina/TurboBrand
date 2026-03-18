"use client";

import { useState, useCallback, useEffect } from "react";
import styles from "./page.module.css";

const MEETING_TYPES = [
  "Consultoría Estratégica",
  "Pauta Digital",
  "Ingeniería Web",
  "Automatización",
  "Clases Personalizadas",
  "Otro",
];

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00",
];

function formatTimeLabel(t: string) {
  const [hh] = t.split(":");
  const h = parseInt(hh);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:00 ${ampm}`;
}

function getTodayStr() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function isWeekend(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return day === 0 || day === 6;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  meeting_type: string;
  message: string;
  date: string;
  time: string;
}

const INITIAL: FormData = {
  name: "", email: "", phone: "",
  meeting_type: "", message: "",
  date: "", time: "",
};

export default function AgendaPage() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const fetchSlots = useCallback(async (date: string) => {
    if (!date) { setBookedSlots([]); return; }
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/meetings/slots?date=${date}`);
      const data = await res.json();
      setBookedSlots(data.booked ?? []);
    } catch {
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  // Preload slots once component mounts if date already set
  useEffect(() => {
    if (form.date) fetchSlots(form.date);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim())        e.name = "El nombre es requerido.";
    if (!form.email.trim())       e.email = "El correo es requerido.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Correo inválido.";
    if (!form.phone.trim())       e.phone = "El teléfono es requerido.";
    if (!form.meeting_type)       e.meeting_type = "Selecciona el tipo de reunión.";
    if (!form.date)               e.date = "Selecciona una fecha.";
    else if (form.date < getTodayStr()) e.date = "La fecha no puede ser en el pasado.";
    else if (isWeekend(form.date))      e.date = "Solo se permiten días hábiles (lunes a viernes).";
    if (!form.time)               e.time = "Selecciona una hora.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, scheduled_by: "client" }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === 'SLOT_TAKEN') {
          setErrors((prev) => ({ ...prev, time: 'Este horario ya está reservado. Elige otra hora o fecha.' }));
          // Refresh slots to reflect any new bookings
          await fetchSlots(form.date);
        } else {
          setApiError(data.error || "Ocurrió un error. Intenta nuevamente.");
        }
        return;
      }
      setSuccess(true);
      setForm(INITIAL);
    } catch {
      setApiError("Error de conexión. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.splitContainer}>
        {/* Left Column: Hero + Info */}
        <section className={styles.leftCol}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>📅 Agenda tu reunión</span>
            <h1 className={styles.heroTitle}>
              Hablemos de hacer<br />
              <span className={styles.gradient}>crecer tu marca</span>
            </h1>
            <p className={styles.heroSub}>
              Reserva una sesión gratuita con nuestro equipo. Analizamos tu negocio y te presentamos una estrategia personalizada.
            </p>
          </div>

          <aside className={styles.sideInfo}>
            <h3>¿Por qué reunirte con nosotros?</h3>
            <ul className={styles.benefitList}>
              <li>
                <span className={styles.benefitIcon}>🚀</span>
                <div>
                  <strong>Estrategia personalizada</strong>
                  <p>Analizamos tu negocio y te damos un plan de acción claro.</p>
                </div>
              </li>
              <li>
                <span className={styles.benefitIcon}>📊</span>
                <div>
                  <strong>Expertos en Marketing 5.0</strong>
                  <p>IA + creatividad para escalar marcas en Colombia.</p>
                </div>
              </li>
              <li>
                <span className={styles.benefitIcon}>🎯</span>
                <div>
                  <strong>Resultados comprobados</strong>
                  <p>Clientes con crecimiento real en ventas y reconocimiento.</p>
                </div>
              </li>
              <li>
                <span className={styles.benefitIcon}>💬</span>
                <div>
                  <strong>Sin compromisos</strong>
                  <p>La primera sesión es completamente gratuita.</p>
                </div>
              </li>
            </ul>
          </aside>
        </section>

        {/* Right Column: Form */}
        <section className={styles.rightCol}>
          <div className={styles.formCard}>
            {success ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>🎉</div>
                <h2>¡Reunión agendada exitosamente!</h2>
                <p>
                  Recibirás un correo de confirmación con los detalles de tu cita.
                  Si necesitas cambiar algo, contáctanos por WhatsApp.
                </p>
                <div className={styles.successActions}>
                  <a
                    href="https://wa.me/573138537261"
                    className={styles.whatsappBtn}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📲 Contactar por WhatsApp
                  </a>
                  <button
                    className={styles.newBtn}
                    onClick={() => setSuccess(false)}
                  >
                    Agendar otra reunión
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.formHeader}>
                  <h2 className={styles.formTitle}>Completa tus datos</h2>
                  <p className={styles.formSub}>Todos los campos marcados con * son requeridos.</p>
                </div>

                {apiError && (
                  <div className={styles.apiError}>
                    ⚠️ {apiError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                  <div className={styles.row}>
                    {/* Nombre */}
                    <div className={styles.field}>
                      <label htmlFor="ag-name">Nombre completo *</label>
                      <input
                        id="ag-name"
                        type="text"
                        placeholder="Juan Pérez"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        className={errors.name ? styles.inputError : ""}
                      />
                      {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className={styles.field}>
                      <label htmlFor="ag-email">Correo electrónico *</label>
                      <input
                        id="ag-email"
                        type="email"
                        placeholder="juan@empresa.com"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        className={errors.email ? styles.inputError : ""}
                      />
                      {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
                    </div>
                  </div>

                  <div className={styles.row}>
                    {/* Teléfono */}
                    <div className={styles.field}>
                      <label htmlFor="ag-phone">Teléfono *</label>
                      <input
                        id="ag-phone"
                        type="tel"
                        placeholder="+57 300 000 0000"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        className={errors.phone ? styles.inputError : ""}
                      />
                      {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
                    </div>

                    {/* Tipo de reunión */}
                    <div className={styles.field}>
                      <label htmlFor="ag-type">Tipo de reunión *</label>
                      <select
                        id="ag-type"
                        value={form.meeting_type}
                        onChange={(e) => set("meeting_type", e.target.value)}
                        className={errors.meeting_type ? styles.inputError : ""}
                      >
                        <option value="">Selecciona una opción...</option>
                        {MEETING_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {errors.meeting_type && <span className={styles.errorMsg}>{errors.meeting_type}</span>}
                    </div>
                  </div>

                  <div className={styles.row}>
                    {/* Fecha */}
                    <div className={styles.field}>
                      <label htmlFor="ag-date">Fecha *</label>
                      <input
                        id="ag-date"
                        type="date"
                        min={getTodayStr()}
                        value={form.date}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && isWeekend(val)) {
                            setErrors((prev) => ({ ...prev, date: "Solo se permiten días hábiles (lunes a viernes)." }));
                            set("date", val);
                          } else {
                            set("date", val);
                            // Reset time when date changes and fetch new slots
                            setForm((prev) => ({ ...prev, date: val, time: "" }));
                            setErrors((prev) => ({ ...prev, date: "", time: "" }));
                            fetchSlots(val);
                          }
                        }}
                        className={errors.date ? styles.inputError : ""}
                      />
                      {errors.date && <span className={styles.errorMsg}>{errors.date}</span>}
                      {!errors.date && <span className={styles.hint}>Solo días hábiles (lun–vie)</span>}
                    </div>

                    {/* Hora */}
                    <div className={styles.field}>
                      <label htmlFor="ag-time">
                        Hora *{loadingSlots && <span className={styles.hint}> Cargando disponibilidad...</span>}
                      </label>
                      <select
                        id="ag-time"
                        value={form.time}
                        onChange={(e) => set("time", e.target.value)}
                        className={errors.time ? styles.inputError : ""}
                        disabled={!form.date || loadingSlots}
                      >
                        <option value="">
                          {!form.date ? "Selecciona primero una fecha" : "Selecciona una hora..."}
                        </option>
                        {TIME_SLOTS.map((t) => {
                          const isBooked = bookedSlots.includes(t);
                          return (
                            <option key={t} value={t} disabled={isBooked}>
                              {formatTimeLabel(t)}{isBooked ? " (ocupado)" : ""}
                            </option>
                          );
                        })}
                      </select>
                      {errors.time && <span className={styles.errorMsg}>{errors.time}</span>}
                      {!errors.time && <span className={styles.hint}>Zona horaria: Colombia (GMT-5)</span>}
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div className={styles.field}>
                    <label htmlFor="ag-message">Mensaje <span className={styles.optional}>(opcional)</span></label>
                    <textarea
                      id="ag-message"
                      rows={3}
                      placeholder="Cuéntanos brevemente sobre tu negocio y qué esperas de esta reunión..."
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className={styles.spinner}>Agendando...</span>
                    ) : (
                      "📅 Agendar Reunión"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
