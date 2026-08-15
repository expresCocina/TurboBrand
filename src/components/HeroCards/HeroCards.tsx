import styles from "./HeroCards.module.css";

export default function HeroCards() {
  return (
    <div className={styles.cardsGrid}>
      {/* Columna izquierda con servicios principales */}
      <div className={styles.left}>
        <div className={styles.card}>
          <span className={styles.tag}>GROWING TOGETHER</span>
          <h2>Aumenta las ventas de tu tienda en línea</h2>
        </div>

        <div className={styles.card}>
          <span className={styles.tag}>FAST RESULTS</span>
          <h2>Posiciona tu marca en canales digitales</h2>
        </div>
      </div>

      {/* Columna derecha destacada (Social Media) */}
      <div className={styles.right}>
        <div className={`${styles.card} ${styles.highlight}`}>
          <span className={styles.tag}>SOCIAL MEDIA</span>
          <h2>Crea una comunidad digital</h2>
        </div>
      </div>
    </div>
  );
}