"use client";

import Image from "next/image";
import styles from "./Hero.module.css";
import HeroCards from "../HeroCards/HeroCards";

export default function Hero() {
    return (
        <section id="home" className={styles.hero}>
            <div className={`${styles.imageBackground} ${styles.hideOnMobile}`}>
                <Image
                    src="/fondohero.png"
                    alt="Background Turbo Brand"
                    fill
                    priority
                    fetchPriority="high"
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 100vw"
                    className={styles.heroImage}
                />
            </div>
            <div className={styles.overlay} />

            <div className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.textWrapper}>
                        <p className={styles.eyebrow}>AGENCIA DE MARKETING 5.0</p>

                        <h1 className={styles.headline}>
                            ¡Somos Turbo <br /> <span className={styles.typewriter}>Brand!</span>
                        </h1>

                        <p className={styles.lead}>
                            Somos una agencia de Marketing 5.0 impulsada por inteligencia artificial,
                            escalamos marcas de comercio online, marcas personales y proyectos de
                            alto impacto desde 0.
                        </p>
                    </div>

                    <div className={styles.cardsWrapper}>
                        <HeroCards />
                    </div>
                </div>

                <div className={styles.right} />
            </div>

            <div className={styles.divider}>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path
                        d="M1200 120L0 120 0 0 24 0 48 40 72 0 96 40 120 0 144 40 168 0 192 40 216 0 240 40 264 0 288 40 312 0 336 40 360 0 384 40 408 0 432 40 456 0 480 40 504 0 528 40 552 0 576 40 600 0 624 40 648 0 672 40 696 0 720 40 744 0 768 40 792 0 816 40 840 0 864 40 888 0 912 40 936 0 960 40 984 0 1008 40 1032 0 1056 40 1080 0 1104 40 1128 0 1152 40 1176 0 1200 45V120z"
                        fill="#484343"
                    />
                </svg>
            </div>
        </section>
    );
}