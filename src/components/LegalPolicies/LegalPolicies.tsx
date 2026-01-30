"use client";

import React, { useState } from 'react';
import styles from './LegalPolicies.module.css';
import Link from 'next/link';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';

const termsData = [
    {
        title: "1. Términos y condiciones de uso del sitio web",
        content: [
            {
                subtitle: "1. Aceptación de los términos",
                text: "Al acceder o usar el sitio web de Turbo Brand, usted acepta cumplir estos términos y condiciones. Si no está de acuerdo, no debe usar el sitio."
            },
            {
                subtitle: "2. Objeto del sitio",
                text: "El sitio tiene como propósito informar sobre los servicios de marketing digital y pauta digital que ofrece Turbo Brand, así como permitir el contacto, la cotización y la contratación de servicios bajo acuerdos separados."
            },
            {
                subtitle: "3. Uso del sitio",
                text: `El usuario se compromete a:
- Usar el sitio de forma legal y respetuosa.
- No intentar vulnerar la seguridad del sitio ni de terceros.
- No usar el contenido del sitio (textos, imágenes, logos) sin autorización previa.`
            },
            {
                subtitle: "4. Propiedad intelectual",
                text: "Todo el contenido del sitio (textos, diseños, marcas, logotipos, plantillas, código) es propiedad de Turbo Brand o de sus licenciantes. Queda prohibida su reproducción, distribución o uso comercial sin autorización escrita."
            },
            {
                subtitle: "5. Limitación de responsabilidad",
                text: `Turbo Brand no se responsabiliza por:
- Errores u omisiones en la información publicada en el sitio.
- Resultados de campañas de pauta digital, que dependen de plataformas externas (Meta, Google, TikTok, etc.).
- Daños derivados del uso indebido del sitio por parte del usuario.`
            },
            {
                subtitle: "6. Modificaciones",
                text: "Turbo Brand puede actualizar estos términos en cualquier momento. El uso continuado del sitio implica aceptación de las nuevas condiciones."
            }
        ]
    },
    {
        title: "2. Política de privacidad (tratamiento de datos)",
        content: [
            {
                subtitle: "1. Responsable del tratamiento",
                text: `Responsable: Turbo Brand, con NIT 1152450212-5, domicilio en Medellín, Colombia.
Correo de contacto: turbobrandcol@gmail.com`
            },
            {
                subtitle: "2. Información que recopilamos",
                text: "Recopilamos datos personales como: nombre, correo electrónico, teléfono, empresa, cargo y cualquier otro dato que usted nos proporcione al contactarnos, cotizar o contratar servicios."
            },
            {
                subtitle: "3. Finalidad del tratamiento",
                text: `Usamos sus datos para:
- Gestionar contactos, cotizaciones y contratación de servicios de marketing digital y pauta digital.
- Enviar información comercial relacionada con nuestros servicios (si acepta recibir comunicaciones).
- Cumplir obligaciones legales y contractuales.`
            },
            {
                subtitle: "4. Base legal y consentimiento",
                text: "El tratamiento se realiza con su consentimiento previo o por ejecución de un contrato. Usted puede revocar el consentimiento para recibir comunicaciones comerciales en cualquier momento."
            },
            {
                subtitle: "5. Almacenamiento y seguridad",
                text: "Sus datos se almacenan en servidores seguros y solo podrán acceder a ellos personas autorizadas. No vendemos ni cedemos sus datos a terceros sin su autorización, salvo por obligación legal."
            },
            {
                subtitle: "6. Derechos del titular",
                text: "Usted tiene derecho a conocer, actualizar, rectificar, suprimir, solicitar prueba de autorización y revocar el consentimiento. Para ejercer estos derechos, escríbanos a [turbobrandcol@gmail.com]."
            },
            {
                subtitle: "7. Cookies y herramientas de análisis",
                text: "El sitio puede usar cookies para mejorar la experiencia de usuario y analizar el tráfico. Usted puede gestionar sus preferencias de cookies desde su navegador."
            }
        ]
    },
    {
        title: "3. Términos de servicio / condiciones de contratación",
        content: [
            {
                subtitle: "1. Objeto del contrato",
                text: "Estos términos regulan la prestación de servicios de marketing digital, por parte de Turbo Brand a favor del cliente, siempre que se firme un contrato o orden de servicio adicional."
            },
            {
                subtitle: "2. Servicios ofrecidos",
                text: `Turbo Brand puede prestar, entre otros:
- Planificación y ejecución de campañas de pauta digital en Meta, Google, TikTok u otras plataformas.
- Creación de contenido y creatividades para campañas.
- Reportes y análisis de resultados.`
            },
            {
                subtitle: "3. Inversión y pagos",
                text: `El cliente define el presupuesto de inversión publicitaria y/o de honorarios de la agencia.
Los pagos se realizarán según lo pactado en el contrato (fechas, medios de pago, penalidades por mora).`
            },
            {
                subtitle: "4. Responsabilidades del cliente",
                text: `El cliente se compromete a:
- Entregar información veraz, oportuna y completa para la ejecución de los servicios.
- Aprobar creatividades, audiencias y campañas dentro de los plazos establecidos.
- Cumplir con las políticas de las plataformas de pauta (Meta Ads, Google Ads, etc.).`
            },
            {
                subtitle: "5. Propiedad de los materiales",
                text: `Turbo Brand conserva los derechos de propiedad intelectual sobre plantillas, procesos, metodologías y herramientas internas.
Los contenidos específicos creados para el cliente (copy, diseños, videos) se ceden al cliente para su uso exclusivo en las campañas contratadas, salvo pacto distinto.`
            },
            {
                subtitle: "6. Confidencialidad",
                text: "Ambas partes se obligan a mantener confidencial la información sensible del cliente y de Turbo Brand, incluso después de terminado el contrato."
            },
            {
                subtitle: "7. Duración y terminación",
                text: `El contrato tendrá la duración pactada (mensual, trimestral, por proyecto).
Puede terminarse anticipadamente por incumplimiento grave, con notificación previa y liquidación de lo adeudado.`
            },
            {
                subtitle: "8. Limitación de responsabilidad y garantías",
                text: `Turbo Brand no garantiza resultados específicos de alcance, ventas o leads, ya que dependen de múltiples factores externos (algoritmos, competencia, presupuesto del cliente).
La agencia se compromete a ejecutar los servicios con diligencia profesional, dentro de los estándares del sector.`
            },
            {
                subtitle: "9. Jurisdicción y notificaciones",
                text: `Estos términos se rigen por las leyes de Colombia.
Las notificaciones se harán por correo electrónico o por escrito a las direcciones registradas.`
            }
        ]
    }
];

export default function LegalPolicies() {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    const toggleSection = (id: string) => {
        setOpenSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.background}>
                <div className={`${styles.blob} ${styles.blob1}`}></div>
                <div className={`${styles.blob} ${styles.blob2}`}></div>
            </div>

            <div className={styles.contentWrapper}>
                <Link href="/" className={styles.backButton}>
                    <ChevronLeft size={20} />
                    Volver al inicio
                </Link>

                <header className={styles.header}>
                    <h1 className={styles.title}>Políticas y Términos</h1>
                    <p className={styles.subtitle}>Transparencia y claridad en nuestros servicios</p>
                </header>

                <div className={styles.card}>
                    {termsData.map((section, idx) => (
                        <div key={idx} className={styles.section}>
                            <h2 className={styles.sectionTitle}>{section.title}</h2>
                            {section.content.map((article, aIdx) => {
                                const id = `${idx}-${aIdx}`;
                                const isOpen = openSections[id];

                                return (
                                    <div key={aIdx} className={styles.article}>
                                        <button
                                            className={styles.articleToogle}
                                            onClick={() => toggleSection(id)}
                                        >
                                            <span className={styles.articleTitle}>{article.subtitle}</span>
                                            {isOpen ? <ChevronUp size={20} color="var(--brand)" /> : <ChevronDown size={20} color="gray" />}
                                        </button>
                                        {isOpen && (
                                            <div className={styles.articleContent}>
                                                {article.text}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
