"use client";
import React, { useState } from 'react';
import styles from './ContactoForm.module.css';

export default function ContactoForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        country: '',
        company: '',
        role: '',
        phone: '',
        sector: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            // Basic validation for step 1
            if (formData.name && formData.email && formData.company) {
                setStep(2);
            }
        } else {
            // Submit logic with dual tracking
            setIsSubmitting(true);
            try {
                const response = await fetch('/api/leads/web-form', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    const result = await response.json();

                    // Client-side Facebook Pixel tracking
                    if (typeof window !== 'undefined' && (window as any).fbq) {
                        // Generate unique event ID for deduplication
                        const eventId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

                        (window as any).fbq('track', 'Lead', {
                            content_name: 'Contact Form',
                            content_category: 'Web Form',
                            value: 0,
                            currency: 'COP',
                        }, { eventID: eventId });

                        // Server-side CAPI tracking with same event_id for deduplication
                        fetch('/api/capi', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                eventName: 'Lead',
                                eventId: eventId,
                                emails: [formData.email],
                                phones: formData.phone ? [`+57${formData.phone}`] : undefined,
                                sourceUrl: window.location.href,
                                clientIp: undefined, // Will be captured server-side if needed
                                userAgent: navigator.userAgent,
                                customData: {
                                    content_name: 'Contact Form',
                                    content_category: 'Web Form',
                                },
                            }),
                        }).catch(err => console.error('CAPI tracking failed:', err));
                    }

                    setSubmitted(true);
                } else {
                    alert('Hubo un error al enviar el formulario. Intenta de nuevo.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Error de conexión.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (submitted) {
        return (
            <div className={`container ${styles.section} ${styles.successContainer}`}>
                <h2>¡Gracias!</h2>
                <p>Hemos recibido tus datos correctamente. Nuestro equipo se pondrá en contacto contigo pronto.</p>
            </div>
        );
    }

    return (
        <div className={`container ${styles.section}`}>
            <div className={styles.textContainer}>
                <h2>Hablemos de negocios</h2>
                <p>
                    Te invito a completar este formulario para conocerte mejor y asegurarme de estar alineada con tu propósito
                    y los objetivos de tu empresa antes de nuestra reunión.
                </p>
            </div>

            <form className={styles.form} onSubmit={handleNext}>
                <div className={styles.stepperIndicator}>
                    <span className={step === 1 ? styles.activeStep : ''}>Datos Básicos</span>
                    <div className={styles.line}></div>
                    <span className={step === 2 ? styles.activeStep : ''}>Detalles</span>
                </div>

                {step === 1 && (
                    <div className={styles.stepContent}>
                        <div className={styles.field}>
                            <label htmlFor="name">Nombre completo *</label>
                            <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="email">Email *</label>
                            <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="country">País *</label>
                            <input type="text" id="country" name="country" required value={formData.country} onChange={handleChange} />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="company">Nombre de la empresa *</label>
                            <input type="text" id="company" name="company" required value={formData.company} onChange={handleChange} />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="role">Cargo</label>
                            <input type="text" id="role" name="role" value={formData.role} onChange={handleChange} />
                        </div>
                        <button type="submit" className={styles.submitBtn}>Siguiente</button>
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.stepContent}>
                        <div className={styles.field}>
                            <label htmlFor="phone">Teléfono *</label>
                            <div style={{ display: 'flex' }}>
                                <span className={styles.prefix}>+57</span>
                                <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} style={{ borderRadius: '0 4px 4px 0', borderLeft: 'none' }} />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="sector">Sector *</label>
                            <select id="sector" name="sector" required value={formData.sector} onChange={handleChange}>
                                <option value="">Selecciona...</option>
                                <option value="Transporte">Transporte</option>
                                <option value="Salud">Salud</option>
                                <option value="Educación">Educación</option>
                                <option value="Retail">Retail</option>
                                <option value="Servicios">Servicios</option>
                                <option value="Inmobiliaria">Inmobiliaria</option>
                                <option value="Restaurantes">Restaurantes</option>
                                <option value="Belleza">Belleza</option>
                                <option value="Tecnología">Tecnología</option>
                                <option value="Otros">Otros</option>
                            </select>
                        </div>
                        <div className={styles.btnGroup}>
                            <button type="button" className={styles.backBtn} onClick={() => setStep(1)}>Atrás</button>
                            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
