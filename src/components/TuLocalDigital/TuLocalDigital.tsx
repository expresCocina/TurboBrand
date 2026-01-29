"use client";

import dynamic from 'next/dynamic';
import styles from './TuLocalDigital.module.css';
import kanbanStyles from './KanbanCards.module.css';
import Link from 'next/link';
import { MapPin, Zap, Gift } from 'lucide-react';

// Lazy load the map component
const RealMedellinMap = dynamic(
    () => import('../RealMedellinMap/RealMedellinMap'),
    {
        ssr: false,
        loading: () => (
            <div style={{
                width: '100%',
                height: '600px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                borderRadius: '20px',
                color: '#00ff88',
                fontSize: '1.2rem',
                border: '2px solid rgba(0, 255, 136, 0.3)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '1rem', fontSize: '2rem' }}>🗺️</div>
                    <div>Cargando mapa interactivo...</div>
                </div>
            </div>
        )
    }
);

export default function TuLocalDigital() {
    return (
        <div className={`container ${styles.section}`} id="tu-local-digital">
            {/* Hero Statement */}
            <div className={styles.heroStatement}>
                <div className={styles.badge}>
                    <Zap size={16} />
                    <span>SERVICIO EXCLUSIVO</span>
                </div>
                <h2 className={styles.mainTitle}>
                    Tu Local Digital: El servicio que hace que <span className={styles.highlight}>solo TÚ</span> aparezcas en Google
                </h2>
                <p className={styles.heroSubtitle}>
                    Posicionamos tu negocio local como <strong>el único de tu rubro en tu zona</strong>.
                    Pauta digital + SEO local + Video UGC gratis. Todo en un solo paquete.
                </p>
            </div>

            {/* Process Section - Kanban Style */}
            <div className={kanbanStyles.processSection}>
                <h3 className={kanbanStyles.processTitle}>
                    ¿Cómo funciona? <span className={kanbanStyles.processSubtitle}>(3 pasos simples)</span>
                </h3>

                <div className={kanbanStyles.kanbanBoard}>
                    {/* Card 1 */}
                    <div className={kanbanStyles.kanbanCard}>
                        <div className={kanbanStyles.cardHeader}>
                            <div className={kanbanStyles.stepBadge}>
                                <span className={kanbanStyles.stepNumber}>1</span>
                            </div>
                            <div className={kanbanStyles.cardStatus}>
                                <span className={kanbanStyles.statusDot}></span>
                                PASO INICIAL
                            </div>
                        </div>

                        <div className={kanbanStyles.cardBody}>
                            <h4 className={kanbanStyles.cardTitle}>
                                Nosotros posicionamos tu local en Google
                            </h4>

                            <p className={kanbanStyles.cardDescription}>
                                Invertimos en <strong>SEO y pauta paga</strong> para que cuando alguien busque en Google el tipo de negocio en tu zona, <strong>tu local sea el primero en aparecer</strong>.
                            </p>

                            <div className={kanbanStyles.cardFeatures}>
                                <div className={kanbanStyles.feature}>
                                    <span className={kanbanStyles.featureIcon}>✓</span>
                                    <span>Estrategia SEO local</span>
                                </div>
                                <div className={kanbanStyles.feature}>
                                    <span className={kanbanStyles.featureIcon}>✓</span>
                                    <span>Campañas locales (Google Search, Google Maps)</span>
                                </div>
                                <div className={kanbanStyles.feature}>
                                    <span className={kanbanStyles.featureIcon}>✓</span>
                                    <span>Optimización Google Business</span>
                                </div>
                            </div>
                        </div>

                        <div className={kanbanStyles.cardFooter}>
                            <div className={kanbanStyles.cardMetric}>
                                <span className={kanbanStyles.metricLabel}>Tiempo estimado</span>
                                <span className={kanbanStyles.metricValue}>2-4 semanas</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className={kanbanStyles.kanbanCard}>
                        <div className={kanbanStyles.cardHeader}>
                            <div className={kanbanStyles.stepBadge}>
                                <span className={kanbanStyles.stepNumber}>2</span>
                            </div>
                            <div className={kanbanStyles.cardStatus}>
                                <span className={kanbanStyles.statusDot}></span>
                                EN PROGRESO
                            </div>
                        </div>

                        <div className={kanbanStyles.cardBody}>
                            <h4 className={kanbanStyles.cardTitle}>
                                Tú ganas visibilidad en Google + Meta
                            </h4>

                            <p className={kanbanStyles.cardDescription}>
                                Tu local sale en Google cuando buscan tu servicio. <strong>Google Search, Google Maps</strong>. Además, con Meta Ads y Facebook, atraemos clientes con anuncios de pauta ultra segmentados.
                            </p>

                            <div className={kanbanStyles.cardFeatures}>
                                <div className={kanbanStyles.feature}>
                                    <span className={kanbanStyles.featureIcon}>✓</span>
                                    <span>Apareces en búsquedas locales</span>
                                </div>
                                <div className={kanbanStyles.feature}>
                                    <span className={kanbanStyles.featureIcon}>✓</span>
                                    <span>Campañas Meta Ads segmentadas</span>
                                </div>
                                <div className={kanbanStyles.feature}>
                                    <span className={kanbanStyles.featureIcon}>✓</span>
                                    <span>Tráfico directo a tu zona</span>
                                </div>
                            </div>
                        </div>

                        <div className={kanbanStyles.cardFooter}>
                            <div className={kanbanStyles.cardMetric}>
                                <span className={kanbanStyles.metricLabel}>Alcance</span>
                                <span className={kanbanStyles.metricValue}>Miles de personas</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className={kanbanStyles.kanbanCard}>
                        <div className={kanbanStyles.cardHeader}>
                            <div className={kanbanStyles.stepBadge}>
                                <span className={kanbanStyles.stepNumber}>3</span>
                            </div>
                            <div className={kanbanStyles.cardStatus}>
                                <span className={kanbanStyles.statusDot}></span>
                                BONUS GRATIS
                            </div>
                        </div>

                        <div className={kanbanStyles.cardBody}>
                            <h4 className={kanbanStyles.cardTitle}>
                                Te regalamos un video UGC para pauta en Meta Ads
                            </h4>

                            <p className={kanbanStyles.cardDescription}>
                                Hacemos <strong>1 video profesional estilo UGC</strong> (contenido real de clientes) que muestre tu producto/servicio. <strong>Completamente GRATIS</strong> por adquirir contrato fijo con Turbo Brand.
                            </p>

                            <div className={kanbanStyles.cardFeatures}>
                                <div className={kanbanStyles.feature}>
                                    <span className={kanbanStyles.featureIcon}>🎁</span>
                                    <span>Video UGC profesional</span>
                                </div>
                                <div className={kanbanStyles.feature}>
                                    <span className={kanbanStyles.featureIcon}>🎁</span>
                                    <span>Optimizado para Meta Ads</span>
                                </div>
                                <div className={kanbanStyles.feature}>
                                    <span className={kanbanStyles.featureIcon}>🎁</span>
                                    <span>Aumenta conversión hasta 3x</span>
                                </div>
                            </div>

                            <div className={kanbanStyles.bonusBadge}>
                                <Gift size={20} />
                                <span>REGALO EXCLUSIVO</span>
                            </div>
                        </div>

                        <div className={kanbanStyles.cardFooter}>
                            <div className={kanbanStyles.cardMetric}>
                                <span className={kanbanStyles.metricLabel}>Valor</span>
                                <span className={kanbanStyles.metricValue}>$500+ USD</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exclusivity Section */}
            <div className={styles.exclusivity}>
                <h3>🔒 Exclusividad Territorial</h3>
                <p><strong>Escogemos 1 negocio por rubro y zona para que tú seas el local más visible en Google y Meta.</strong></p>
            </div>

            {/* Interactive Map Section */}
            <div className={styles.mapSection}>
                <div className={styles.mapIntro}>
                    <MapPin className={styles.mapIcon} size={32} />
                    <h3>Mapa Interactivo: Medellín y Área Metropolitana</h3>
                    <p>
                        Explora las <strong>16 comunas de Medellín</strong> y los <strong>9 municipios del área metropolitana</strong>.
                        <br />
                        <span className={styles.legend}>
                            <span className={styles.legendItem}>
                                <span className={styles.dot} style={{ background: '#00ff88' }}></span>
                                Zona Disponible
                            </span>
                            <span className={styles.legendItem}>
                                <span className={styles.dot} style={{ background: '#666' }}></span>
                                Zona Ocupada
                            </span>
                        </span>
                    </p>
                </div>

                <RealMedellinMap />

                <p className={styles.mapNote}>
                    💡 <strong>Haz click</strong> en cualquier zona del mapa para ver su disponibilidad y reservar tu espacio exclusivo.
                </p>
            </div>

            {/* CTA */}
            <div className={styles.ctaWrapper}>
                <Link href="#contacto" className={styles.cta}>
                    ¿Quieres que tu local sea el único visible en tu zona? Agenda una llamada
                </Link>
            </div>
        </div>
    );
}
