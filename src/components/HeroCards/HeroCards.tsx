import styles from './HeroCards.module.css';

export default function HeroCards() {
    const cards = [
        {
            subtitle: "GROWING TOGETHER",
            title: "Aumenta las ventas de tu tienda en línea",
            type: "dark"
        },
        {
            subtitle: "GROWING TOGETHER",
            title: "Posiciona tu marca en canales digitales",
            type: "dark"
        },
        {
            subtitle: "SOCIAL MEDIA",
            title: "Crea una comunidad digital",
            type: "brand"
        }
    ];

    return (
        <div className={styles.grid}>
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`${styles.card} ${card.type === 'brand' ? styles.brandCard : styles.darkCard}`}
                >
                    <span className={styles.subtitle}>{card.subtitle}</span>
                    <h3 className={styles.title}>{card.title}</h3>
                </div>
            ))}
        </div>
    );
}
