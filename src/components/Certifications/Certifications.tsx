"use client";

import Image from 'next/image';
import styles from './Certifications.module.css';

const certifications = [
    { name: 'Google Ads', logo: '/certifications/google-ads.webp' },
    { name: 'Meta Business Partner', logo: '/certifications/meta.webp' },
    { name: 'TikTok Ads', logo: '/certifications/tiktok-ads.webp' },
    { name: 'Google Partner', logo: '/certifications/google-partner.svg' },
    { name: 'Agency Partner', logo: '/certifications/agency-partner.svg' },
];

export default function Certifications() {
    return (
        <section className={styles.certificationsSection}>
            <div className={styles.container}>
                <h2 className={styles.title}>Certificados y Partners Oficiales</h2>
            </div>

            <div className={styles.marqueeWrapper}>
                <div className={styles.marquee}>
                    {/* Primera copia de los logos */}
                    {certifications.map((cert, index) => (
                        <div key={`cert-1-${index}`} className={styles.logoItem}>
                            <div className={styles.logoBox}>
                                <Image
                                    src={cert.logo}
                                    alt={cert.name}
                                    fill
                                    sizes="(max-width: 640px) 120px, 160px"
                                    className={styles.logoImage}
                                    style={{ objectFit: 'contain' }}
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    ))}
                    {/* Segunda copia para loop infinito */}
                    {certifications.map((cert, index) => (
                        <div key={`cert-2-${index}`} className={styles.logoItem} aria-hidden="true">
                            <div className={styles.logoBox}>
                                <Image
                                    src={cert.logo}
                                    alt=""
                                    fill
                                    sizes="(max-width: 640px) 120px, 160px"
                                    className={styles.logoImage}
                                    style={{ objectFit: 'contain' }}
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    ))}
                    {/* Tercera copia para pantallas muy anchas */}
                    {certifications.map((cert, index) => (
                        <div key={`cert-3-${index}`} className={styles.logoItem} aria-hidden="true">
                            <div className={styles.logoBox}>
                                <Image
                                    src={cert.logo}
                                    alt=""
                                    fill
                                    sizes="(max-width: 640px) 120px, 160px"
                                    className={styles.logoImage}
                                    style={{ objectFit: 'contain' }}
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
