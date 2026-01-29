import styles from "./HeroCards.module.css";

export default function HeroCards() {
  return (
    <div className={styles.cardsGrid}>
      {/* Columna izquierda con servicios principales */}
      <div className={styles.left}>
        <div className={styles.card}>
          <span className={styles.tag}>GROWING TOGETHER</span>
          <h3>Aumenta las ventas de tu tienda en línea</h3>
        </div>

        <div className={styles.card}>
          <span className={styles.tag}>GROWING TOGETHER</span>
          <h3>Posiciona tu marca en canales digitales</h3>
        </div>
      </div>

      {/* Columna derecha destacada (Social Media) */}
      <div className={styles.right}>
        <div className={`${styles.card} ${styles.highlight}`}>
          <span className={styles.tag}>SOCIAL MEDIA</span>
          <h3>Crea una comunidad digital</h3>
        </div>
      </div>
    </div>
  );
}