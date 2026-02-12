"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { TrendingUp, Users, Award, Target, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './Clientes.module.css';

const caseStudies = [
    {
        company: "Sell House",
        logo: "/clients/sellhouse.svg",
        industry: "Real Estate",
        color: "#06b6d4",
        challenge: "Baja conversión en landing pages de propiedades premium",
        solution: "Rediseño de experiencia de usuario + pauta segmentada en Meta Ads + Google Ads",
        results: [
            { label: "ROI", value: "+320%" },
            { label: "Conversiones", value: "4.2x" },
            { label: "CAC", value: "-45%" }
        ],
        testimonial: {
            text: "Turbo Brand transformó nuestra presencia digital. En 3 meses triplicamos las ventas de propiedades.",
            author: "María González",
            position: "CEO, Sell House"
        }
    },
    {
        company: "Contenedor de Lujo",
        logo: "/clients/contenedordelujo.svg",
        industry: "Importaciones USA & Europa",
        color: "#f59e0b",
        challenge: "Necesitaban escalar adquisición de clientes para productos importados",
        solution: "Estrategia de contenido + Meta Ads + LinkedIn Ads + automatización de leads",
        results: [
            { label: "Leads", value: "+580%" },
            { label: "Costo/Lead", value: "-62%" },
            { label: "Cierre", value: "35%" }
        ],
        testimonial: {
            text: "El equipo de Turbo Brand entiende el mercado de importaciones. Resultados medibles desde el primer mes.",
            author: "Carlos Ruiz",
            position: "Director, Contenedor de Lujo"
        }
    },
    {
        company: "Tickets Premium",
        logo: "/clients/ticketspremium.svg",
        industry: "Eventos Masivos",
        color: "#8b5cf6",
        challenge: "Alto costo de adquisición en venta de boletos para conciertos masivos",
        solution: "Funnel de contenido viral + TikTok Ads + Meta Ads + remarketing estratégico",
        results: [
            { label: "Ventas", value: "+425%" },
            { label: "ROI", value: "6.8x" },
            { label: "Retención", value: "+78%" }
        ],
        testimonial: {
            text: "Pasamos de vender 500 a 2,000 boletos por evento. Su estrategia de contenido fue clave.",
            author: "Ana Martínez",
            position: "Fundadora, Tickets Premium"
        }
    },
    {
        company: "VitaHealth",
        logo: "/clients/vitahealth.svg",
        industry: "Salud y Bienestar",
        color: "#10b981",
        challenge: "Baja conversión en landing pages de productos naturales",
        solution: "Rediseño de experiencia de usuario + pauta segmentada en Meta Ads",
        results: [
            { label: "ROI", value: "+280%" },
            { label: "Conversiones", value: "3.8x" },
            { label: "CAC", value: "-38%" }
        ],
        testimonial: {
            text: "Turbo Brand transformó nuestra presencia digital. En 3 meses duplicamos las ventas online.",
            author: "Laura Pérez",
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
            { label: "Leads", value: "+450%" },
            { label: "Costo/Lead", value: "-55%" },
            { label: "Cierre", value: "32%" }
        ],
        testimonial: {
            text: "El equipo de Turbo Brand entiende el mercado B2B. Resultados medibles desde el primer mes.",
            author: "Roberto Silva",
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
            { label: "Inscripciones", value: "+380%" },
            { label: "ROI", value: "5.2x" },
            { label: "Retención", value: "+65%" }
        ],
        testimonial: {
            text: "Pasamos de 50 a 250 estudiantes mensuales. Su estrategia de contenido fue clave.",
            author: "Diego Morales",
            position: "Fundador, EduPro"
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
        projects: 0,
        investment: 0
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
                                clients: Math.floor(30 * progress),
                                roi: parseFloat((5.5 * progress).toFixed(1)),
                                years: Math.floor(8 * progress),
                                projects: Math.floor(200 * progress),
                                investment: Math.floor(1000 * progress)
                            });

                            if (currentStep >= steps) {
                                clearInterval(timer);
                                setCounters({
                                    clients: 30,
                                    roi: 5.5,
                                    years: 8,
                                    projects: 200,
                                    investment: 1000
                                });
                            }
                        }, interval);
                    }
                });
            },
            { threshold: 0.1 } // Faster trigger
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
        <section className={styles.section} id="clientes">
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Casos de éxito reales
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
                    <div className={styles.statCard}>
                        <TrendingUp className={styles.statIcon} />
                        <div className={styles.statValue}>+${counters.investment}M</div>
                        <div className={styles.statLabel}>Invertidos en Pauta</div>
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
                                        loading="lazy"
                                        sizes="(max-width: 768px) 100px, 120px"
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
        </section>
    );
}
