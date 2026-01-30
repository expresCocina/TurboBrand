"use client";

import Image from 'next/image';
import styles from './Certifications.module.css';

const certifications = [
    { name: 'Google Ads', logo: '/certifications/google-ads.png' },
    { name: 'Meta Business Partner', logo: '/certifications/meta.png' },
    { name: 'TikTok Ads', logo: '/certifications/tiktok-ads.png' },
    { name: 'Google Partner', logo: '/certifications/google-partner.svg' },
    { name: 'Agency Partner', logo: '/certifications/agency-partner.svg' },
];

export default function Certifications() {
    return (
        <section className={styles.certificationsSection}>
            <div className={styles.container}>
                <h3 className={styles.title}>Certificados y Partners Oficiales</h3>
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
                                    className={styles.logoImage}
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                        </div>
                    ))}
                    {/* Segunda copia para loop infinito */}
                    {certifications.map((cert, index) => (
                        <div key={`cert-2-${index}`} className={styles.logoItem}>
                            <div className={styles.logoBox}>
                                <Image
                                    src={cert.logo}
                                    alt={cert.name}
                                    fill
                                    className={styles.logoImage}
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                        </div>
                    ))}
                    {/* Tercera copia para pantallas muy anchas */}
                    {certifications.map((cert, index) => (
                        <div key={`cert-3-${index}`} className={styles.logoItem}>
                            <div className={styles.logoBox}>
                                <Image
                                    src={cert.logo}
                                    alt={cert.name}
                                    fill
                                    className={styles.logoImage}
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
