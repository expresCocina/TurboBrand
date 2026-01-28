"use client";

import styles from "./Hero.module.css";
import HeroCards from "../HeroCards/HeroCards";

export default function Hero() {
  return (
    <section id="home" className={styles.hero}>
      {/* Visual (derecha) */}
      <div className={styles.visual} aria-hidden="true" />

      {/* Overlay global */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Contenido */}
      <div className={styles.mainContainer}>
        <div className={styles.left}>
          <div className={styles.textWrapper}>
            <p className={styles.eyebrow}>AGENCIA DE MARKETING 5.0</p>

            <h1 className={styles.headline}>¡Somos Turbo Brand!</h1>

            <p className={styles.lead}>
              Impulsamos tu marca con estrategias digitales de alto impacto e
              inteligencia artificial.
            </p>
          </div>

          <div className={styles.cardsWrapper}>
            <HeroCards />
          </div>
        </div>

        {/* Columna derecha “vacía” (solo para layout) */}
        <div className={styles.right} aria-hidden="true" />
      </div>

      {/* Zigzag */}
      <div className={styles.divider} aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M1200 120L0 120 0 0 24 0 48 40 72 0 96 40 120 0 144 40 168 0 192 40 216 0 240 40 264 0 288 40 312 0 336 40 360 0 384 40 408 0 432 40 456 0 480 40 504 0 528 40 552 0 576 40 600 0 624 40 648 0 672 40 696 0 720 40 744 0 768 40 792 0 816 40 840 0 864 40 888 0 912 40 936 0 960 40 984 0 1008 40 1032 0 1056 40 1080 0 1104 40 1128 0 1152 40 1176 0 1200 45V120z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
