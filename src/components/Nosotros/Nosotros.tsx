"use client";

import { useState } from 'react';
import { Target, Eye, TrendingUp, BarChart3, Zap } from 'lucide-react';
import styles from './Nosotros.module.css';

export default function Nosotros() {
    const [activeTab, setActiveTab] = useState<'mision' | 'vision'>('mision');

    return (
        <section className={styles.nosotrosSection} id="nosotros">
            <div className={styles.nosotrosContainer}>
                <div className={styles.nosotrosHeader}>
                    <h2 className={styles.nosotrosTitle}>¿Quiénes Somos?</h2>
                    <p className={styles.nosotrosIntro}>
                        Turbo Brand es una agencia de marketing digital 5.0 especializada en pauta, 
                        diseños web y procesos de alto impacto.
                    </p>
                </div>

                {/* ÁREA DE TABS (MISIÓN / VISIÓN) */}
                <div className={styles.tabsArea}>
                    <div className={styles.tabButtonsRow}>
                        <button 
                            className={`${styles.tabButton} ${activeTab === 'mision' ? styles.tabButtonActive : ''}`}
                            onClick={() => setActiveTab('mision')}
                        >
                            <Target size={18} /> Nuestra Misión
                        </button>
                        <button 
                            className={`${styles.tabButton} ${activeTab === 'vision' ? styles.tabButtonActive : ''}`}
                            onClick={() => setActiveTab('vision')}
                        >
                            <Eye size={18} /> Nuestra Visión
                        </button>
                    </div>
                    
                    <div className={styles.tabPanel}>
                        <div className={styles.panelContent}>
                            <div className={styles.verticalBar} />
                            <div>
                                <h3>{activeTab === 'mision' ? 'Misión' : 'Visión'}</h3>
                                <p>
                                    {activeTab === 'mision' 
                                        ? 'Hacer crecer tu marca mediante estrategias de pauta digital y marketing basado en datos, ayudando a nuestros clientes a tomar decisiones más inteligentes.' 
                                        : 'Ser la agencia reconocida por nuestro enfoque de crecimiento, nuestra transparencia y la claridad con la que demostramos el impacto de cada inversión.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABLERO KANBAN PROFESIONAL */}
                <h3 className={styles.kanbanMainTitle}>ADN Turbo Brand</h3>
                <div className={styles.kanbanGrid}>
                    {/* ENFOQUE */}
                    <div className={styles.kanbanCol}>
                        <div className={styles.colLabel}><TrendingUp size={14}/> ENFOQUE</div>
                        <div className={styles.kanbanCard}>
                            <div className={styles.cardCategory}>ROI</div>
                            <h4>Crecimiento Real</h4>
                            <p>Foco en leads y ventas reales, no en números vacíos.</p>
                        </div>
                    </div>

                    {/* EJECUCIÓN */}
                    <div className={styles.kanbanCol}>
                        <div className={styles.colLabel}><Zap size={14}/> EJECUCIÓN</div>
                        <div className={styles.kanbanCard}>
                            <div className={styles.cardCategory}>DATA</div>
                            <h4>Sin Tecnicismos</h4>
                            <p>Hablamos claro, explicando qué funciona y qué no.</p>
                        </div>
                    </div>

                    {/* ESCALA */}
                    <div className={styles.kanbanCol}>
                        <div className={styles.colLabel}><BarChart3 size={14}/> ESCALA</div>
                        <div className={styles.kanbanCard}>
                            <div className={styles.cardCategory}>TECH</div>
                            <h4>Automatización</h4>
                            <p>Escalamos tu marketing para que tú no pierdas tiempo.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}