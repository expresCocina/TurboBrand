"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Typewriter from 'typewriter-effect';
import { TrendingUp, Users, Award, Target, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './Clientes.module.css';

const caseStudies = [
    {
        company: "VitaHealth",
        logo: "/clients/vitahealth.svg",
        industry: "Salud y Bienestar",
        color: "#10b981",
        challenge: "Baja conversión en landing pages de productos naturales",
        solution: "Rediseño de experiencia de usuario + pauta segmentada en Meta Ads",
        results: [
            { label: "ROI", value: "+320%" },
            { label: "Conversiones", value: "4.2x" },
            { label: "CAC", value: "-45%" }
        ],
        testimonial: {
            text: "Turbo Brand transformó nuestra presencia digital. En 3 meses triplicamos las ventas online.",
            author: "María González",
            position: "CEO, VitaHealth"
        }
    },
    {
        company: "TechFlow",
        logo: "/clients/techflow.svg",
        industry: "Software & Tech",
        color: "#3b82f6",
        challenge: "Necesitaban escalar adquisición de clientes B2B",
        solution: "Estrategia de contenido + LinkedIn Ads + automatización de leads",
        results: [
            { label: "Leads", value: "+580%" },
            { label: "Costo/Lead", value: "-62%" },
            { label: "Cierre", value: "35%" }
        ],
        testimonial: {
            text: "El equipo de Turbo Brand entiende el mercado B2B. Resultados medibles desde el primer mes.",
            author: "Carlos Ruiz",
            position: "CMO, TechFlow"
        }
    },
    {
        company: "EduPro",
        logo: "/clients/edupro.svg",
        industry: "Educación Online",
        color: "#f59e0b",
        challenge: "Alto costo de adquisición en cursos digitales",
        solution: "Funnel de contenido educativo + TikTok Ads + remarketing estratégico",
        results: [
            { label: "Inscripciones", value: "+425%" },
            { label: "ROI", value: "6.8x" },
            { label: "Retención", value: "+78%" }
        ],
        testimonial: {
            text: "Pasamos de 50 a 300 estudiantes mensuales. Su estrategia de contenido fue clave.",
            author: "Ana Martínez",
            position: "Fundadora, EduPro"
        }
    },
    {
        company: "FitZone",
        logo: "/clients/fitzone.svg",
        industry: "Fitness & Gym",
        color: "#ef4444",
        challenge: "Competencia alta en mercado local de gimnasios",
        solution: "Branding local + Google Ads + contenido UGC en redes",
        results: [
            { label: "Membresías", value: "+250%" },
            { label: "Engagement", value: "12x" },
            { label: "Retención", value: "89%" }
        ],
        testimonial: {
            text: "Nos posicionaron como el gym #1 de la zona. El contenido UGC generó confianza real.",
            author: "Roberto Silva",
            position: "Dueño, FitZone"
        }
    },
    {
        company: "GourmetBox",
        logo: "/clients/gourmetbox.svg",
        industry: "E-commerce Food",
        color: "#8b5cf6",
        challenge: "Carrito abandonado del 78% en tienda online",
        solution: "Optimización de checkout + email automation + retargeting",
        results: [
            { label: "Ventas", value: "+380%" },
            { label: "Abandono", value: "-52%" },
            { label: "Ticket", value: "+35%" }
        ],
        testimonial: {
            text: "La automatización de emails recuperó miles de ventas perdidas. ROI impresionante.",
            author: "Laura Pérez",
            position: "Co-founder, GourmetBox"
        }
    },
    {
        company: "PropTech",
        logo: "/clients/proptech.svg",
        industry: "Real Estate Tech",
        color: "#06b6d4",
        challenge: "Generar leads calificados para propiedades premium",
        solution: "Landing pages optimizadas + Facebook Lead Ads + CRM integration",
        results: [
            { label: "Leads", value: "+490%" },
            { label: "Calidad", value: "92%" },
            { label: "Cierre", value: "28%" }
        ],
        testimonial: {
            text: "Generamos 150+ leads calificados al mes. Su sistema de calificación es excelente.",
            author: "Diego Morales",
            position: "Director, PropTech"
        }
    }
];

export default function Clientes() {
    const [expandedCards, setExpandedCards] = useState<number[]>([]);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [counters, setCounters] = useState({
        clients: 0,
        roi: 0,
        years: 0,
        projects: 0
    });
    const statsRef = useRef<HTMLDivElement>(null);

    const toggleCard = (index: number) => {
        setExpandedCards(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    // Intersection Observer for counter animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true);

                        const duration = 2000;
                        const steps = 60;
                        const interval = duration / steps;

                        let currentStep = 0;
                        const timer = setInterval(() => {
                            currentStep++;
                            const progress = currentStep / steps;

                            setCounters({
                                clients: Math.floor(50 * progress),
                                roi: parseFloat((4.2 * progress).toFixed(1)),
                                years: Math.floor(8 * progress),
                                projects: Math.floor(200 * progress)
                            });

                            if (currentStep >= steps) {
                                clearInterval(timer);
                                setCounters({
                                    clients: 50,
                                    roi: 4.2,
                                    years: 8,
                                    projects: 200
                                });
                            }
                        }, interval);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => {
            if (statsRef.current) {
                observer.unobserve(statsRef.current);
            }
        };
    }, [hasAnimated]);

    return (
        <div className={`container ${styles.section}`}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    <Typewriter
                        onInit={(typewriter) => {
                            typewriter
                                .typeString('Casos de éxito reales')
                                .start();
                        }}
                        options={{
                            autoStart: false,
                            loop: false,
                            delay: 40,
                            cursor: '',
                            deleteSpeed: Infinity,
                        }}
                    />
                </h2>
                <p className={styles.intro}>
                    Conoce cómo ayudamos a diferentes marcas a escalar con estrategias de marketing digital,
                    generando resultados medibles y alcanzando sus objetivos de negocio.
                </p>
            </div>

            {/* Global Stats */}
            <div ref={statsRef} className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <Users className={styles.statIcon} />
                    <div className={styles.statValue}>{counters.clients}+</div>
                    <div className={styles.statLabel}>Clientes Activos</div>
                </div>
                <div className={styles.statCard}>
                    <TrendingUp className={styles.statIcon} />
                    <div className={styles.statValue}>{counters.roi}x</div>
                    <div className={styles.statLabel}>ROI Promedio</div>
                </div>
                <div className={styles.statCard}>
                    <Award className={styles.statIcon} />
                    <div className={styles.statValue}>{counters.years}+</div>
                    <div className={styles.statLabel}>Años de Experiencia</div>
                </div>
                <div className={styles.statCard}>
                    <Target className={styles.statIcon} />
                    <div className={styles.statValue}>{counters.projects}+</div>
                    <div className={styles.statLabel}>Proyectos Completados</div>
                </div>
            </div>

            {/* Kanban-style Case Studies */}
            <div className={styles.kanbanGrid}>
                {caseStudies.map((study, index) => (
                    <div key={index} className={styles.caseCard}>
                        {/* Header with company and industry */}
                        <div className={styles.cardHeader}>
                            <div className={styles.companyInfo}>
                                <Image
                                    src={study.logo}
                                    alt={study.company}
                                    width={120}
                                    height={48}
                                    className={styles.companyLogo}
                                />
                            </div>
                            <div
                                className={styles.industryBadge}
                                style={{ backgroundColor: `${study.color}20`, color: study.color }}
                            >
                                {study.industry}
                            </div>
                        </div>

                        {/* Results Metrics - Always visible */}
                        <div className={styles.metricsGrid}>
                            {study.results.map((result, idx) => (
                                <div key={idx} className={styles.metric}>
                                    <div className={styles.metricValue} style={{ color: study.color }}>
                                        {result.value}
                                    </div>
                                    <div className={styles.metricLabel}>{result.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Toggle Button */}
                        <button
                            className={styles.toggleButton}
                            onClick={() => toggleCard(index)}
                            style={{ borderColor: study.color }}
                        >
                            {expandedCards.includes(index) ? (
                                <>
                                    Ocultar detalles
                                    <ChevronUp size={18} />
                                </>
                            ) : (
                                <>
                                    Ver caso completo
                                    <ChevronDown size={18} />
                                </>
                            )}
                        </button>

                        {/* Collapsible Content */}
                        {expandedCards.includes(index) && (
                            <div className={styles.expandedContent}>
                                {/* Challenge & Solution */}
                                <div className={styles.cardContent}>
                                    <div className={styles.section}>
                                        <div className={styles.sectionLabel}>Desafío</div>
                                        <p className={styles.sectionText}>{study.challenge}</p>
                                    </div>
                                    <div className={styles.section}>
                                        <div className={styles.sectionLabel}>Solución</div>
                                        <p className={styles.sectionText}>{study.solution}</p>
                                    </div>
                                </div>

                                {/* Testimonial */}
                                <div className={styles.testimonial}>
                                    <p className={styles.testimonialText}>"{study.testimonial.text}"</p>
                                    <div className={styles.testimonialAuthor}>
                                        <strong>{study.testimonial.author}</strong>
                                        <span>{study.testimonial.position}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Categories */}
            <div className={styles.categories}>
                <h4 className={styles.catTitle}>Servicios Implementados:</h4>
                <p className={styles.catList}>
                    Pauta Digital • Estrategia • Contenido UGC • SEO • Automatización • Email Marketing • Branding • Analytics
                </p>
            </div>
        </div>
    );
}
