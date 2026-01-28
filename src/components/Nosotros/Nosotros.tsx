import styles from './Nosotros.module.css';

export default function Nosotros() {
    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.header}>
                <h2 className={styles.title}>¿Quiénes Somos?</h2>
                <div className={styles.introText}>
                    <p>
                        Turbo Brand es una agencia de marketing digital 5.0 especializada en pauta, diseños web,
                        estandarización de procesos de alto impacto y crecimiento para marcas en todo Colombia y Latinoamérica.
                    </p>
                    <p>
                        No solo ejecutamos campañas: diseñamos estrategias inteligentes, las probamos en el mercado real,
                        medimos su impacto y las optimizamos constantemente para que tu inversión se convierta en ventas reales,
                        sin tantos conceptos técnicos, hacemos que vendas más con menos presupuesto.
                    </p>
                </div>
            </div>

            <div className={styles.missionVisionGrid}>
                <div className={styles.mvCard}>
                    <h3>Misión</h3>
                    <p>
                        Hacer crecer tu marca mediante estrategias de pauta digital y marketing basado en datos,
                        ayudando a nuestros clientes a tomar decisiones más inteligentes y obtener resultados rentables,
                        predecibles y escalables.
                    </p>
                </div>
                <div className={styles.mvCard}>
                    <h3>Visión</h3>
                    <p>
                        Ser la agencia clave para el mercado local e internacional para marcas que buscan crecer,
                        llegar al siguiente nivel en su ciclo comercial, ser reconocida por nuestro enfoque de crecimiento,
                        nuestra transparencia y la claridad con la que demostramos el impacto de cada inversión.
                    </p>
                </div>
            </div>

            <h3 className={styles.valuesTitle}>Nuestros Valores</h3>
            <div className={styles.valuesGrid}>
                <div className={styles.valueItem}>
                    <h4>1. Creemos en el crecimiento real, no en los números bonitos</h4>
                    <p>
                        Para nosotros, lo importante no es el alcance o las impresiones, sino lo que realmente mueve tu negocio:
                        leads convertidos, ventas, fidelización y rentabilidad. Hacemos foco en lo que genera impacto real,
                        no en métricas que solo se ven bien en un informe.
                    </p>
                </div>
                <div className={styles.valueItem}>
                    <h4>2. Pensamos como negocio, no como agencia</h4>
                    <p>
                        Tomamos decisiones desde la perspectiva de tu empresa: ¿esta inversión vale la pena?
                        ¿Este resultado es sostenible? ¿Qué sigue después de la campaña?
                    </p>
                </div>
                <div className={styles.valueItem}>
                    <h4>3. Experimentamos, pero nunca arriesgamos tu dinero</h4>
                    <p>
                        Probamos creativos, audiencias y ofertas, pero con un enfoque de bajo riesgo y alto aprendizaje.
                        Nos aseguramos de que cada test tenga un objetivo claro y que, si algo falla, el impacto sea controlado
                        y el aprendizaje sea real.
                    </p>
                </div>
                <div className={styles.valueItem}>
                    <h4>4. Claro, sin tecnicismos, sin tapujos</h4>
                    <p>
                        Hablamos claro, sin jergas innecesarias. Si algo funciona, lo decimos. Si no funciona, también lo decimos,
                        y explicamos por qué. Nuestros reportes y reuniones están hechos para que tú entiendas qué pasó y qué sigue.
                    </p>
                </div>
                <div className={styles.valueItem}>
                    <h4>5. Trabajamos como tu equipo, no como un contacto más</h4>
                    <p>
                        Nos involucramos como parte de tu equipo, entendemos tu cultura, tus prioridades y tu ritmo,
                        para que el marketing camine al mismo paso que tu negocio.
                    </p>
                </div>
                <div className={styles.valueItem}>
                    <h4>6. Automatizamos para que tú puedas escalar</h4>
                    <p>
                        Nuestra meta es que tu estrategia de marketing pueda crecer sin que tú (ni tu equipo) pasen más horas
                        sentados en frente del computador.
                    </p>
                </div>
            </div>
        </div>
    );
}
