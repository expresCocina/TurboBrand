import styles from './Clientes.module.css';
import Image from 'next/image';

const clients = [
    'client-01', 'client-02', 'client-03',
    'client-04', 'client-05', 'client-06'
];

export default function Clientes() {
    return (
        <div className={`container ${styles.section}`}>
            <div className={styles.header}>
                <h2 className={styles.title}>Casos de trabajo con nuestros clientes</h2>
                <h3 className={styles.subtitle}>Turbo Brand | Servicios de Marketing Digital</h3>
                <p className={styles.intro}>
                    Conoce las diferentes metodologías de trabajo y adaptación sobre estrategias de Marketing,
                    generando resultados y alcanzando sus objetivos a través de nuestros diferentes servicios adaptados a sus necesidades.
                </p>
            </div>

            <div className={styles.grid}>
                {clients.map((c) => (
                    <div key={c} className={styles.logoWrapper}>
                        <Image
                            src={`/clients/${c}.svg`}
                            alt={c}
                            width={140}
                            height={70}
                            className={styles.img}
                        />
                    </div>
                ))}
            </div>

            <div className={styles.categories}>
                <h4 className={styles.catTitle}>Categorías:</h4>
                <p className={styles.catList}>
                    Automatización - Contenidos - Creatividad - Estrategia - Influencers - UGC - Pauta - SEO - ADS.
                </p>
            </div>
        </div>
    );
}
